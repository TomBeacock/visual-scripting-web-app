import { Pin, ValueType } from "./pin";
import { Point, Rect, setTranslation } from "./util";

export class Link {
    static readonly curve : number = 32;

    private _startPoint: Point;
    private _endPoint: Point;
    private _element: SVGElement;
    private _path: SVGPathElement;
    
    private _startPin: Pin;
    private _endPin: Pin;

    constructor(startPin?: Pin, endPin?: Pin) {      
        if(startPin != undefined && startPin != null) {
            this._startPin = startPin;
            this._startPoint = startPin.position;
        }
        else {
            this._startPin = null;
            this._startPoint = new Point();
        }

        if(endPin != undefined && endPin != null) {
            this._endPin = endPin;
            this._endPoint = endPin.position;
        }
        else {
            this._endPin = null;
            this._endPoint = new Point();
        }
        this._element = <SVGElement>document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._element.classList.add("graph-link");
        this._path = <SVGPathElement>document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.appendChild(this._path);
        const graphLinks: HTMLElement = document.getElementById("graph-links");
        graphLinks.appendChild(this._element);
        this.updatePath();
    }

    get startPin(): Pin {
        return this._startPin;
    }

    get endPin(): Pin {
        return this._endPin;
    }

    set startPoint(startPoint: Point) {
        this._startPoint = startPoint;
        this.updatePath();
    }

    set endPoint(endPoint: Point) {
        this._endPoint = endPoint;
        this.updatePath();
    }

    set valueType(valueType: ValueType) {
        this._element.classList.value = "graph-link";
        switch(valueType) {
            case ValueType.Flow: this._element.classList.add("link-type-flow"); break;
            case ValueType.Int: this._element.classList.add("link-type-int"); break;
            case ValueType.Float: this._element.classList.add("link-type-float"); break;
            case ValueType.String: this._element.classList.add("link-type-string"); break;
            case ValueType.Boolean: this._element.classList.add("link-type-boolean"); break;
        }
    }

    setPoints(startPoint: Point, endPoint: Point): void {
        this._startPoint = startPoint;
        this._endPoint = endPoint;
        this.updatePath();
    }

    reset(): void {
        this._startPoint = new Point(0, 0);
        this._endPoint = new Point(0, 0);
        this._path.setAttribute("d", "");
    }

    destroy(): void {
        this._path.parentElement.removeChild(this._path);
        this._startPin.breakLink(this);
        this._endPin.breakLink(this);
    }

    private updatePath(): void {
        const startControlX: number = this._startPoint.x + Link.curve;
        const endControlX: number = this._endPoint.x - Link.curve;

        const newBounds: Rect = new Rect();

        const s: Point = new Point();
        const e: Point = new Point();

        if(this._startPoint.x <= endControlX) {
            newBounds.x = this._startPoint.x;
            newBounds.width = this._endPoint.x - this._startPoint.x;
            e.x = newBounds.width;
        }
        else {
            newBounds.x = endControlX;
            newBounds.width = startControlX - endControlX;
            s.x = this._startPoint.x - endControlX;
            e.x = Link.curve;
        }

        if(this._startPoint.y <= this._endPoint.y) {
            newBounds.y = this._startPoint.y - 2;
            newBounds.height = this._endPoint.y - this._startPoint.y + 4;
            s.y = 2;
            e.y = newBounds.height - 2;
        }
        else {
            newBounds.y = this._endPoint.y - 2;
            newBounds.height = this._startPoint.y - this._endPoint.y + 4;
            s.y = newBounds.height - 2;
            e.y = 2;
        }

        setTranslation(this._element, new Point(newBounds.x, newBounds.y));
        this._element.setAttribute("width", `${newBounds.width}`);
        this._element.setAttribute("height", `${newBounds.height}`)
        
        this._path.setAttribute("d", `M ${s.x} ${s.y} C ${s.x + Link.curve} ${s.y}, ${e.x - Link.curve} ${e.y}, ${e.x} ${e.y}`);
    }
}