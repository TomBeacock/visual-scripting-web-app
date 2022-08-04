import { Pin, PinType } from "./pin";
import { Node } from "./node";
import { Link } from "./link";
import { Point, getTranslation, setTranslation } from "./util";

export class Graph {
    viewport: HTMLElement;
    graphArea: HTMLElement;
    nodes: Array<Node> = [];
    
    private dragCursorBegin: Point;
    private dragTargetBegin: Point;
    
    private panning: boolean = false;
    private dragging: boolean = false;

    private dragNode: Node = null;
    
    private linking: boolean = false;
    private linkPin: Pin = null;
    private drawingLink: Link;

    constructor() {
        this.viewport = document.getElementById("graph-viewport");
        this.graphArea = document.getElementById("graph-area");
        this.drawingLink = new Link();
        this.drawingLink.reset();
        this.viewport.addEventListener("mousedown", event => this.onMouseDown(event));
        this.viewport.addEventListener("mousemove", event => this.onMouseMove(event));
        this.viewport.addEventListener("mouseup", event => this.onMouseUp(event));
        this.viewport.addEventListener("contextmenu", event => this.onContextMenu(event));
    }

    private onMouseDown(event: MouseEvent): void {
        if(event.button == 0)
            document.getElementById("node-menu").classList.remove("visible");

        if(event.button == 1 && !this.dragging && !this.linking) {
            this.dragTargetBegin = getTranslation(this.graphArea);
            this.dragCursorBegin = new Point(event.clientX, event.clientY);
            this.panning = true;
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if(this.panning) {
            let position: Point = new Point(
                this.dragTargetBegin.x + event.clientX - this.dragCursorBegin.x,
                this.dragTargetBegin.y + event.clientY - this.dragCursorBegin.y
            );
            setTranslation(this.graphArea, position);
        }

        if(this.dragging) {
            let position: Point = new Point(
                this.dragTargetBegin.x + event.clientX - this.dragCursorBegin.x,
                this.dragTargetBegin.y + event.clientY - this.dragCursorBegin.y
            );
            this.dragNode.setPosition(position);
        }
    
        if(this.linking) {
            const areaRect: DOMRect = this.graphArea.getBoundingClientRect();
            const position: Point = new Point(event.clientX - areaRect.left, event.clientY - areaRect.top);
            switch(this.linkPin.getType()) {
                case PinType.Output:
                    this.drawingLink.setEndPoint(position);
                    break;
                case PinType.Input:
                    this.drawingLink.setStartPoint(position);
                    break;
            }
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if(this.panning) {
            this.panning = false;
        }
        
        if(this.dragging) {
            this.dragNode.element.style.cursor = null;
            this.dragNode = null;
            this.dragging = false;
        }

        if(this.linking) {
            this.drawingLink.reset();
            this.linking = false;
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

    beginDrag(node: Node, position: Point): void {
        if(this.panning || this.linking)
            return;

        this.dragNode = node;
        this.dragNode.element.style.cursor = "grabbing";
        this.dragCursorBegin = position;
        this.dragTargetBegin = this.dragNode.getPosition();
        this.dragging = true;
    }

    beginLink(pin: Pin): void {
        if(this.panning || this.dragging)
            return;

        this.linkPin = pin;
        this.linking = true;

        const position: Point = this.linkPin.getPosition();
        this.drawingLink.setPoints(position, position);
    }

    endLink(pin: Pin): void {
        if(this.linkPin != pin
            && this.linkPin.getType() != pin.getType()          
            && this.linkPin.getNode() != pin.getNode()
            && this.linkPin.getValueType() == pin.getValueType()) {
            let link: Link;
            switch(this.linkPin.getType()) {
                case PinType.Output:
                    link = new Link(this.linkPin, pin);
                    break;
                case PinType.Input:
                    link = new Link(pin, this.linkPin);
                    break;
            }                
            this.linkPin.addLink(link);
            pin.addLink(link);
        }
        this.drawingLink.reset();
        this.linking = false;
    }

    viewportToAreaPoint(point: Point): Point {
        const areaPos = getTranslation(this.graphArea);
        return point.subtract(areaPos.x, areaPos.y);
    }
}
