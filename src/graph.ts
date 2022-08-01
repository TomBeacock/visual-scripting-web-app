namespace Graph {
    export class Point {
        x: number;
        y: number;

        constructor(x?: number, y?: number) {
            this.x = x ?? 0;
            this.y = y ?? 0;
        }

        add(x: number, y: number): Point {
            this.x += x;
            this.y += y;
            return this;
        }
    }

    export class Graph {
        viewport: HTMLElement;
        nodes: Array<Node> = [];
        
        private dragging: boolean = false;
        private dragNode: Node = null;
        private dragCursorStart: Point;
        private dragNodeStart: Point;
        
        private linking: boolean = false;
        private linkPin: Pin = null;
        private drawingLink: Link;

        constructor() {
            this.viewport = document.getElementById("graph-viewport");
            this.drawingLink = new Link();
            this.viewport.addEventListener("mousemove", event => this.onMouseMove(event));
            this.viewport.addEventListener("mouseup", event => this.onMouseUp(event));
            this.viewport.addEventListener("contextmenu", event => this.onContextMenu(event));
        }

        private onMouseMove(event: MouseEvent): void {
            if(this.dragging) {
                let position: Point = new Point(
                    this.dragNodeStart.x + event.clientX - this.dragCursorStart.x,
                    this.dragNodeStart.y + event.clientY - this.dragCursorStart.y
                );
                this.dragNode.setPosition(position);
            }
        
            if(this.linking) {
                const position: Point = new Point(event.clientX, event.clientY);
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
            if(this.dragging) {
                this.dragNode.endDrag();
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
            const nodeMenu: HTMLElement = document.getElementById("node-menu");
            const rect = this.viewport.getBoundingClientRect();
            nodeMenu.style.left = `${event.clientX - rect.x}px`;
            nodeMenu.style.top = `${event.clientY - rect.y}px`;
            nodeMenu.classList.add("visible");
        }

        beginDrag(node: Node, position: Point): void {
            this.dragNode = node;
            this.dragCursorStart = position;
            this.dragNodeStart = this.dragNode.getPosition();
            this.dragging = true;
        }

        beginLink(pin: Pin): void {
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
    }

    export class Link {
        static readonly curve : number = 32;

        private startPoint: Point;
        private endPoint: Point;
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

            this.path = <SVGPathElement>document.createElementNS("http://www.w3.org/2000/svg", "path");
            const linksParent: HTMLElement = document.getElementById("graph-links");
            linksParent.appendChild(this.path);
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
            const startControl: Point = new Point(this.startPoint.x + Link.curve, this.startPoint.y);
            const endControl: Point = new Point(this.endPoint.x - Link.curve, this.endPoint.y);
            this.path.setAttribute("d", `M ${this.startPoint.x} ${this.startPoint.y} C ${startControl.x} ${startControl.y}, ${endControl.x} ${endControl.y}, ${this.endPoint.x} ${this.endPoint.y}`);
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
            const rect: DOMRect = this.element.getBoundingClientRect();
            return new Point(rect.left + rect.width / 2, rect.top + rect.height / 2);
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
        private nodeElement : HTMLDivElement;
        private inputs: Array<Pin> = [];
        private outputs: Array<Pin> = [];

        private graph: Graph;
    
        constructor(graph: Graph, nodeData) {
            this.id = Node.currentID++;
            this.graph = graph;

            const nodeDefinition = nodeDefinitions[nodeData.type];
        
            // Node
            this.nodeElement = document.createElement("div");
            this.nodeElement.addEventListener("mousedown", event => this.onMouseDown(event));
            this.nodeElement.classList.add("graph-node");
        
            // Head
            const head: HTMLDivElement = document.createElement("div");
            head.classList.add("head");
            const title: HTMLSpanElement = document.createElement("span");
            title.innerHTML = nodeDefinition.name;
            head.appendChild(title);
            this.nodeElement.appendChild(head);

            // Body
            const body: HTMLDivElement = document.createElement("div");
            body.classList.add("body");
            this.nodeElement.appendChild(body);
        
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
            this.graph.viewport.appendChild(this.nodeElement);

            this.setPosition(new Point(nodeData.posX, nodeData.posY));
        }

        getPosition(): Point {
            const style: CSSStyleDeclaration = window.getComputedStyle(this.nodeElement);
            const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
            return new Point(matrix.m41, matrix.m42);
        }

        setPosition(position: Point): void {
            this.nodeElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
            this.inputs.forEach(input => input.updateLinkPositions());
            this.outputs.forEach(output => output.updateLinkPositions());
        }

        endDrag(): void {
            this.nodeElement.style.cursor = null;
        }

        private onMouseDown(event: MouseEvent): void {
            if(!(<Element>event.target).classList.contains("graph-node"))
                return; 
            
            event.preventDefault();

            const position: Point = new Point(event.clientX, event.clientY);
            this.graph.beginDrag(this, position);
            this.nodeElement.style.cursor = "grabbing";
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
