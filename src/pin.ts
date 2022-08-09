import { Link } from "./link";
import { Graph } from "./graph";
import { Node } from "./node";
import { ILiteEvent, LiteEvent } from "./event";
import { Point } from "./util";

export enum PinType {
    Output,
    Input
}

export enum ValueType {
    Flow = 1,
    Int = 2,
    Float = 4,
    String = 8,
    Boolean = 16
}

export class Pin {
    private _type: PinType = PinType.Output;
    private _valueType: ValueType;
    links: Array<Link> = [];

    private _graph: Graph;
    private _node: Node;

    element: HTMLDivElement;
    private graphic: HTMLDivElement;

    private readonly linksChangedEvent = new LiteEvent<number>();

    constructor(graph: Graph, node: Node, valueType: ValueType, type: PinType = PinType.Output) {
        this._graph = graph;
        this._node = node;
        this._type = type;
        this._valueType = valueType;

        this.element = document.createElement("div");
        this.element.classList.add("pin");
        if(this._type == PinType.Output)
            this.element.classList.add("right");

        this.element.addEventListener("mousedown", event => this.onMouseDown(event));
        this.element.addEventListener("mouseup", event => this.onMouseUp(event));
        this.element.addEventListener("mouseenter", event => this.onMouseEnter(event));
        this.element.addEventListener("mouseleave", event => this.onMouseExit(event))
        this.element.addEventListener("contextmenu", event => event.preventDefault());

        this.graphic = document.createElement("div");
        this.graphic.classList.add("pin-graphic");
        switch(this._valueType) {
            case ValueType.Flow: this.graphic.classList.add("type-flow"); break;
            case ValueType.Int: this.graphic.classList.add("type-int"); break;
            case ValueType.Float: this.graphic.classList.add("type-float"); break;
            case ValueType.String: this.graphic.classList.add("type-string"); break;
            case ValueType.Boolean: this.graphic.classList.add("type-boolean"); break;
        }

        this.element.appendChild(this.graphic);
    }

    get type(): PinType { return this._type; }
    get valueType(): ValueType { return this._valueType; }
    get node(): Node { return this._node; }

    get onLinksChanged(): ILiteEvent<number> { return this.linksChangedEvent.expose(); }

    get position(): Point {
        const graphRect: DOMRect = this._graph.graphArea.getBoundingClientRect();
        const pinRect: DOMRect = this.element.getBoundingClientRect();
        return new Point(
            pinRect.left + pinRect.width / 2 - graphRect.left,
            pinRect.top + pinRect.height / 2 - graphRect.top);
    }

    addLink(link: Link): void {
        this.links.push(link);
        this.setGraphicSolid(true);
        this.linksChangedEvent.dispatch(this.links.length);
    }

    breakLink(link: Link): void {
        let index: number = this.links.indexOf(link);
        if(index > -1)
            this.links.splice(index, 1);
        if(this.links.length <= 0)
            this.setGraphicSolid(false);
        this.linksChangedEvent.dispatch(this.links.length);
    }

    updateLinkPositions(): void {
        switch(this._type) {
            case PinType.Output:
                this.links.forEach(link => { link.startPoint = this.position });
                break;
            case PinType.Input:
                this.links.forEach(link => { link.endPoint = this.position });
                break;
        }
    }

    private setGraphicSolid(solid: boolean): void {
        if(solid)
            this.element.classList.add("solid");
        else
            this.element.classList.remove("solid");
    }

    private onMouseDown(event: MouseEvent): void {
        if(!(<Element>event.target).classList.contains("pin"))
            return;

        if(event.button == 0) {
            event.preventDefault();
            event.stopPropagation();
            this._graph.beginLink(this);
        }
        else if(event.button == 2) {
            event.preventDefault();
            event.stopPropagation();

            const linkCount: number = this.links.length;
            for (let i = 0; i < linkCount; i++)
                this.links[0].destroy();     
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if(!(<Element>event.target).classList.contains("pin"))
            return;

        if(event.button == 0)
            this._graph.endLink(this);
    }

    private onMouseEnter(event: MouseEvent): void {
        this.setGraphicSolid(true);
    }

    private onMouseExit(event: MouseEvent): void {
        if(this.links.length <= 0)
            this.setGraphicSolid(false);
    }
}