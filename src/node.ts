import { Graph } from "./graph";
import { Pin, PinType, ValueType } from "./pin";
import { nodeDefinitions } from "./nodedefinitions";
import { CheckBox } from "./checkbox";
import { Point, getTranslation, setTranslation } from "./util";

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