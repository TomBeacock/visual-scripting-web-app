import { Graph } from "./graph";
import { Pin, PinType, ValueType } from "./pin";
import { nodeDefinitions } from "./node-definitions";
import { Point, getTranslation, setTranslation } from "./util";

export class Node {
    element : HTMLDivElement;
    private _inputs: Array<{ pin: Pin, valueField: NodeValueField }> = [];
    private _outputs: Array<Pin> = [];

    private _graph: Graph;
    private _type: string;

    constructor(graph: Graph, type: string, position: Point) {
        this._graph = graph;
        this._type = type;

        if(!(type in nodeDefinitions)) {
            console.error("Invalid node types");
            return;
        }

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

                // Input Pin
                let inputPin: Pin = new Pin(this._graph, this, valueType, PinType.Input);
                inputPin.element.style.gridColumn = "1";
                inputPin.element.style.gridRow = row.toString();
                body.appendChild(inputPin.element);
                
                // Input Label
                const inputLabel: HTMLSpanElement = document.createElement("span");
                inputLabel.innerHTML = input.name;
                inputLabel.style.gridColumn = "2";
                inputLabel.style.gridRow = row.toString();
                body.appendChild(inputLabel);
                
                // Input Field
                let valueField: NodeValueField = null;
                if(valueType != ValueType.Flow) {
                    if(valueType & (ValueType.Int | ValueType.Float | ValueType.String))
                        valueField = new TextValueField();
                    else if(valueType == ValueType.Boolean) 
                        valueField = new BooleanValueField();
    
                    valueField.element.style.gridColumn = "3";
                    valueField.element.style.gridRow = row.toString();
                    body.appendChild(valueField.element);
    
                    inputPin.onLinksChanged.addListener((linkCount: number) => {
                        valueField.element.style.visibility = linkCount > 0 ? "hidden" : "visible";
                    });
                }

                this._inputs.push({ pin: inputPin, valueField: valueField });

                /* Enum
                else if(valueType == ValueType.Enum) {
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

                const outputPin = new Pin(this._graph, this, valueType);
                outputPin.element.style.gridColumn = "6";
                outputPin.element.style.gridRow = row.toString();
                this._outputs.push(outputPin);
                body.appendChild(outputPin.element);
            }
        }
        const graphNodes = document.getElementById("graph-nodes");
        graphNodes.appendChild(this.element);

        this.position = position;
    }

    get position(): Point {
        return getTranslation(this.element);
    }

    set position(position: Point) {
        setTranslation(this.element, position);
        this._inputs.forEach(input => input.pin.updateLinkPositions());
        this._outputs.forEach(output => output.updateLinkPositions());
    }

    get type(): string {
        return this._type;
    }

    getInput(index: number): Node | string {
        const input: { pin: Pin, valueField: NodeValueField } = this._inputs[index];
        if(input.pin.links.length > 0) {
            return input.pin.links[0].startPin.node;
        }
        return input.valueField.value;
    }

    private onMouseDown(event: MouseEvent): void {
        if(!(<Element>event.target).classList.contains("graph-node"))
            return; 
        
        if(event.button == 0) {
            event.preventDefault();

            const position: Point = new Point(event.clientX, event.clientY);
            this._graph.beginDrag(this, position);
        }
    }
}

interface NodeValueField {
    get element(): HTMLElement;
    get value(): string;
}

class BooleanValueField implements NodeValueField {
    private _checked: boolean;
    private _element: HTMLDivElement;

    constructor() {
        this._element = document.createElement("div");
        this._element.classList.add("checkbox");
        const tick: HTMLSpanElement = document.createElement("span");
        tick.classList.add("material-symbols-rounded");
        tick.innerHTML = "check";
        this._element.appendChild(tick);
        this._element.addEventListener("click", () => { this.checked = !this._checked });
    }

    set checked(checked: boolean) {
        this._checked = checked;
        this._element.setAttribute("checked", `${this._checked}`);
    }

    get element(): HTMLElement {
        return this._element;
    }

    get value(): string {
        return this._checked ? "true" : "false";
    }
}

class TextValueField implements NodeValueField {
    private _element: HTMLSpanElement;

    constructor() {
        this._element = document.createElement("span");
        this._element.classList.add("input");
        this._element.setAttribute("role", "textbox");
        this._element.setAttribute("contenteditable", "true");
    }

    get element(): HTMLElement {
        return this._element;
    }

    get value(): string {
        return this._element.textContent;
    }
}

function stringToValueType(valueType: string): ValueType {
    switch(valueType) {
        case "Flow": return ValueType.Flow;
        case "Int": return ValueType.Int;
        case "Float": return ValueType.Float;
        case "String": return ValueType.String;
        case "Bool": return ValueType.Boolean;
        default: return ValueType.Flow;
    }
}