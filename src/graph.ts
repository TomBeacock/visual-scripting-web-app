import { Pin, PinType } from "./pin";
import { Node } from "./node";
import { Link } from "./link";
import { Point, getTranslation, setTranslation } from "./util";

export class Graph {
    viewport: HTMLElement;
    graphArea: HTMLElement;
    nodes: Array<Node> = [];
    
    private _dragCursorBegin: Point;
    private _dragTargetBegin: Point;
    
    private _panning: boolean = false;
    private _dragging: boolean = false;

    private _dragNode: Node = null;
    
    private _linking: boolean = false;
    private _linkPin: Pin = null;
    private _drawingLink: Link;

    constructor() {
        this.viewport = document.getElementById("graph-viewport");
        this.graphArea = document.getElementById("graph-area");
        this._drawingLink = new Link();
        this._drawingLink.reset();
        this.viewport.addEventListener("mousedown", event => this.onMouseDown(event));
        this.viewport.addEventListener("mousemove", event => this.onMouseMove(event));
        this.viewport.addEventListener("mouseup", event => this.onMouseUp(event));
        this.viewport.addEventListener("contextmenu", event => this.onContextMenu(event));
    }

    beginDrag(node: Node, position: Point): void {
        if(this._panning || this._linking)
            return;

        this._dragNode = node;
        this._dragNode.element.style.cursor = "grabbing";
        this._dragCursorBegin = position;
        this._dragTargetBegin = this._dragNode.position;
        this._dragging = true;
    }

    beginLink(pin: Pin): void {
        if(this._panning || this._dragging)
            return;

        this._linkPin = pin;
        this._linking = true;

        const position: Point = this._linkPin.position;
        this._drawingLink.setPoints(position, position);
    }

    endLink(pin: Pin): void {
        if(this._linkPin != pin
            && this._linkPin.type != pin.type         
            && this._linkPin.node != pin.node
            && this._linkPin.valueType == pin.valueType) {
            let link: Link;
            switch(this._linkPin.type) {
                case PinType.Output:
                    link = new Link(this._linkPin, pin);
                    break;
                case PinType.Input:
                    link = new Link(pin, this._linkPin);
                    break;
            }                
            this._linkPin.addLink(link);
            pin.addLink(link);
        }
        this._drawingLink.reset();
        this._linking = false;
    }

    viewportToAreaPoint(point: Point): Point {
        const areaPos = getTranslation(this.graphArea);
        return point.subtract(areaPos.x, areaPos.y);
    }

    private onMouseDown(event: MouseEvent): void {
        if(event.button == 0)
            document.getElementById("node-menu").classList.remove("visible");

        if(event.button == 1 && !this._dragging && !this._linking) {
            this._dragTargetBegin = getTranslation(this.graphArea);
            this._dragCursorBegin = new Point(event.clientX, event.clientY);
            this._panning = true;
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if(this._panning) {
            let position: Point = new Point(
                this._dragTargetBegin.x + event.clientX - this._dragCursorBegin.x,
                this._dragTargetBegin.y + event.clientY - this._dragCursorBegin.y
            );
            setTranslation(this.graphArea, position);
        }

        if(this._dragging) {
            let position: Point = new Point(
                this._dragTargetBegin.x + event.clientX - this._dragCursorBegin.x,
                this._dragTargetBegin.y + event.clientY - this._dragCursorBegin.y
            );
            this._dragNode.position = position;
        }
    
        if(this._linking) {
            const areaRect: DOMRect = this.graphArea.getBoundingClientRect();
            const position: Point = new Point(event.clientX - areaRect.left, event.clientY - areaRect.top);
            switch(this._linkPin.type) {
                case PinType.Output:
                    this._drawingLink.endPoint = position;
                    break;
                case PinType.Input:
                    this._drawingLink.startPoint = position;
                    break;
            }
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if(this._panning) {
            this._panning = false;
        }
        
        if(this._dragging) {
            this._dragNode.element.style.cursor = null;
            this._dragNode = null;
            this._dragging = false;
        }

        if(this._linking) {
            this._drawingLink.reset();
            this._linking = false;
        }
    }

    private onContextMenu(event: MouseEvent): void {
        event.preventDefault();
        const viewportRect: DOMRect = this.viewport.getBoundingClientRect();
        const nodeMenu: HTMLElement = document.getElementById("node-menu");
        const nodeMenuRect: DOMRect = nodeMenu.getBoundingClientRect();
        const alignRight = event.clientX > viewportRect.width / 2;
        nodeMenu.style.left = `${event.clientX - viewportRect.x - (alignRight ? nodeMenuRect.width : 0)}px`;
        nodeMenu.style.top = `${event.clientY - viewportRect.y}px`;
        nodeMenu.classList.add("visible");

        const searchbar: HTMLInputElement = <HTMLInputElement>document.getElementById("node-search-bar");
        searchbar.value = "";
        searchbar.focus();
    }
}
