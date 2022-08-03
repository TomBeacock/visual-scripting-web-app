namespace Graph {
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

        setStartPoint(startPoint: Point): void {
            this.startPoint = startPoint;
            this.updatePath();
        }

        setEndPoint(endPoint: Point): void {
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

    enum PinType {
        Output,
        Input
    }

    enum ValueType {
        Flow = 1,
        Int = 2,
        Float = 4,
        String = 8,
        Boolean = 16
    }

    class Pin {
        private type: PinType = PinType.Output;
        private valueType: ValueType;
        private links: Array<Link> = [];

        private graph: Graph;
        private node: Node;

        public element: HTMLDivElement;
        private graphic: HTMLDivElement;

        private readonly linksChangedEvent = new LiteEvent<number>();

        constructor(graph: Graph, node: Node, valueType: ValueType, type: PinType = PinType.Output) {
            this.graph = graph;
            this.node = node;
            this.type = type;
            this.valueType = valueType;

            this.element = document.createElement("div");
            this.element.classList.add("pin");
            if(this.type == PinType.Output)
                this.element.classList.add("right");

            this.element.addEventListener("mousedown", event => this.onMouseDown(event));
            this.element.addEventListener("mouseup", event => this.onMouseUp(event));
            this.element.addEventListener("mouseenter", event => this.onMouseEnter(event));
            this.element.addEventListener("mouseleave", event => this.onMouseExit(event))
            this.element.addEventListener("contextmenu", event => event.preventDefault());

            this.graphic = document.createElement("div");
            this.graphic.classList.add("pin-graphic");
            switch(this.valueType) {
                case ValueType.Flow: this.graphic.classList.add("type-flow"); break;
                case ValueType.Int: this.graphic.classList.add("type-int"); break;
                case ValueType.Float: this.graphic.classList.add("type-float"); break;
                case ValueType.String: this.graphic.classList.add("type-string"); break;
                case ValueType.Boolean: this.graphic.classList.add("type-boolean"); break;
            }

            this.element.appendChild(this.graphic);
        }

        getType(): PinType { return this.type; }
        getValueType(): ValueType { return this.valueType; }
        getNode(): Node { return this.node; }

        get onLinksChanged(): ILiteEvent<number> { return this.linksChangedEvent.expose(); }

        getPosition(): Point {
            const graphRect: DOMRect = this.graph.graphArea.getBoundingClientRect();
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
                this.graph.beginLink(this);
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
                this.graph.endLink(this);
        }

        private onMouseEnter(event: MouseEvent): void {
            this.setGraphicSolid(true);
        }

        private onMouseExit(event: MouseEvent): void {
            if(this.links.length <= 0)
                this.setGraphicSolid(false);
        }

        updateLinkPositions(): void {
            switch(this.type) {
                case PinType.Output:
                    this.links.forEach(link => link.setStartPoint(this.getPosition()));
                    break;
                case PinType.Input:
                    this.links.forEach(link => link.setEndPoint(this.getPosition()));
                    break;
            }
        }
    }

    export class Node {
        private static currentID = 0;

        private id: number;

        // UI Elements
        element : HTMLDivElement;
        private inputs: Array<Pin> = [];
        private outputs: Array<Pin> = [];

        private graph: Graph;
    
        constructor(graph: Graph, type: string, position: Point) {
            this.id = Node.currentID++;
            this.graph = graph;

            const nodeDefinition = nodeDefinitions[type];
        
            // Node
            this.element = document.createElement("div");
            this.element.addEventListener("mousedown", event => this.onMouseDown(event));
            this.element.classList.add("graph-node");
        
            // Head
            const head: HTMLDivElement = document.createElement("div");
            head.classList.add("head");
            const title: HTMLSpanElement = document.createElement("span");
            title.innerHTML = nodeDefinition.name;
            head.appendChild(title);
            this.element.appendChild(head);

            // Body
            const body: HTMLDivElement = document.createElement("div");
            body.classList.add("body");
            this.element.appendChild(body);
        
            // Rows
            let rows = Math.max(nodeDefinition.inputs.length, nodeDefinition.outputs.length);
            for (let i = 0; i < rows; i++) {
                const row: number = i + 1;

                if(i < nodeDefinition.inputs.length) {
                    const input = nodeDefinition.inputs[i];
                    const valueType: ValueType = stringToValueType(input.type);

                    let inputPin: Pin = new Pin(this.graph, this, valueType, PinType.Input);
                    inputPin.element.style.gridColumn = "1";
                    inputPin.element.style.gridRow = row.toString();
                    this.inputs.push(inputPin);
                    body.appendChild(inputPin.element);
                    
                    const inputLabel: HTMLSpanElement = document.createElement("span");
                    inputLabel.innerHTML = input.name;
                    inputLabel.style.gridColumn = "2";
                    inputLabel.style.gridRow = row.toString();
                    body.appendChild(inputLabel);
                    
                    if(valueType & (ValueType.Int | ValueType.Float | ValueType.String)) {
                        const inputField: HTMLSpanElement = document.createElement("span");
                        inputField.classList.add("input");
                        inputField.setAttribute("role", "textbox");
                        inputField.setAttribute("contenteditable", "true");
                        inputField.style.gridColumn = "3";
                        inputField.style.gridRow = row.toString();
                        body.appendChild(inputField);

                        inputPin.onLinksChanged.addListener((linkCount: number) => {
                            inputField.style.visibility = linkCount > 0 ? "hidden" : "visible";
                        });
                    }
                    else if(valueType == ValueType.Boolean) {
                        const inputCheck: CheckBox = new CheckBox();
                        inputCheck.element.style.gridColumn = "3";
                        inputCheck.element.style.gridRow = row.toString();
                        body.appendChild(inputCheck.element);

                        inputPin.onLinksChanged.addListener((linkCount: number) => {
                            inputCheck.element.style.visibility = linkCount > 0 ? "hidden" : "visible";
                        });
                    }
                    /* Enum
                    else if(valueType == ValueType.Boolean) {
                        const inputSelect: HTMLSelectElement = document.createElement("select");
                        const trueOption = document.createElement("option");
                        trueOption.innerHTML = "True";
                        inputSelect.options.add(trueOption);
                        const falseOption = document.createElement("option");
                        falseOption.innerHTML = "False";
                        inputSelect.options.add(falseOption);
                        inputSelect.style.gridColumn = "3";
                        inputSelect.style.gridRow = row.toString();
                        body.appendChild(inputSelect);

                        inputPin.onLinksChanged.addListener((linkCount: number) => {
                            inputSelect.style.visibility = linkCount > 0 ? "hidden" : "visible";
                        });
                    }*/
                }
        
                if(i < nodeDefinition.outputs.length) {
                    const output = nodeDefinition.outputs[i];
                    const valueType: ValueType = stringToValueType(output.type);

                    const outputLabel: HTMLSpanElement = document.createElement("span");
                    outputLabel.classList.add("text-right");
                    outputLabel.innerHTML = output.name;
                    outputLabel.style.gridColumn = "5";
                    outputLabel.style.gridRow = row.toString();
                    body.appendChild(outputLabel);

                    const outputPin = new Pin(this.graph, this, valueType);
                    outputPin.element.style.gridColumn = "6";
                    outputPin.element.style.gridRow = row.toString();
                    this.outputs.push(outputPin);
                    body.appendChild(outputPin.element);
                }
            }
            const graphNodes = document.getElementById("graph-nodes");
            graphNodes.appendChild(this.element);

            this.setPosition(position);
        }

        getPosition(): Point {
            return getTranslation(this.element);
        }

        setPosition(position: Point): void {
            setTranslation(this.element, position);
            this.inputs.forEach(input => input.updateLinkPositions());
            this.outputs.forEach(output => output.updateLinkPositions());
        }

        private onMouseDown(event: MouseEvent): void {
            if(!(<Element>event.target).classList.contains("graph-node"))
                return; 
            
            if(event.button == 0) {
                event.preventDefault();
    
                const position: Point = new Point(event.clientX, event.clientY);
                this.graph.beginDrag(this, position);
            }
        }
    }

    function stringToValueType(valueType: string): ValueType {
        switch(valueType) {
            case "Flow": return ValueType.Flow;
            case "Int": return ValueType.Int;
            case "Float": return ValueType.Float;
            case "String": return ValueType.String;
            case "Boolean": return ValueType.Boolean;
            default: return ValueType.Flow;
        }
    }
}
