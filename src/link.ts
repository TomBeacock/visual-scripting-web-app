import { Pin } from "./pin";
import { Point, Rect, setTranslation } from "./util";

export class Link {
    static readonly curve : number = 32;

    private startPoint: Point;
    private endPoint: Point;
    private element: SVGElement;
    private path: SVGPathElement;
    private startPin: Pin;
    private endPin: Pin;

    constructor(startPin?: Pin, endPin?: Pin) {      
        if(startPin != undefined && startPin != null) {
            this.startPin = startPin;
            this.startPoint = startPin.getPosition();
        }
        else {
            this.startPin = null;
            this.startPoint = new Point();
        }

        if(endPin != undefined && endPin != null) {
            this.endPin = endPin;
            this.endPoint = endPin.getPosition();
        }
        else {
            this.endPin = null;
            this.endPoint = new Point();
        }
        this.element = <SVGElement>document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.classList.add("graph-link");
        this.path = <SVGPathElement>document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.element.appendChild(this.path);
        const graphLinks: HTMLElement = document.getElementById("graph-links");
        graphLinks.appendChild(this.element);
        this.updatePath();
    }

    get StartPin(): Pin {
        return this.startPin;
    }

    get EndPin(): Pin {
        return this.endPin;
    }

    set StartPoint(startPoint: Point) {
        this.startPoint = startPoint;
        this.updatePath();
    }

    set EndPoint(endPoint: Point) {
        this.endPoint = endPoint;
        this.updatePath();
    }

    setPoints(startPoint: Point, endPoint: Point): void {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.updatePath();
    }

    reset(): void {
        this.startPoint = new Point(0, 0);
        this.endPoint = new Point(0, 0);
        this.path.setAttribute("d", "");
    }

    destroy(): void {
        this.path.parentElement.removeChild(this.path);
        this.startPin.breakLink(this);
        this.endPin.breakLink(this);
    }

    private updatePath(): void {
        const startControlX: number = this.startPoint.x + Link.curve;
        const endControlX: number = this.endPoint.x - Link.curve;

        const newBounds: Rect = new Rect();

        const s: Point = new Point();
        const e: Point = new Point();

        if(this.startPoint.x <= endControlX) {
            newBounds.x = this.startPoint.x;
            newBounds.width = this.endPoint.x - this.startPoint.x;
            e.x = newBounds.width;
        }
        else {
            newBounds.x = endControlX;
            newBounds.width = startControlX - endControlX;
            s.x = this.startPoint.x - endControlX;
            e.x = Link.curve;
        }

        if(this.startPoint.y <= this.endPoint.y) {
            newBounds.y = this.startPoint.y - 2;
            newBounds.height = this.endPoint.y - this.startPoint.y + 4;
            s.y = 2;
            e.y = newBounds.height - 2;
        }
        else {
            newBounds.y = this.endPoint.y - 2;
            newBounds.height = this.startPoint.y - this.endPoint.y + 4;
            s.y = newBounds.height - 2;
            e.y = 2;
        }

        setTranslation(this.element, new Point(newBounds.x, newBounds.y));
        this.element.setAttribute("width", `${newBounds.width}`);
        this.element.setAttribute("height", `${newBounds.height}`)
        
        this.path.setAttribute("d", `M ${s.x} ${s.y} C ${s.x + Link.curve} ${s.y}, ${e.x - Link.curve} ${e.y}, ${e.x} ${e.y}`);
    }
}