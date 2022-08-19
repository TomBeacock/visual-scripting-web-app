import { nodeDefinitions } from "./node-definitions";
import { Node } from "./node";

function evaluateNode(node: Node): null | number | boolean | string {
    if(node === null)
        return null;

    switch(node.type) {
        case "start": {
            evaluateNode(node.getOutput(0));
            return null;
        }
        case "if": {
            let condition: Node | number | boolean | string = node.getInput(1);
            if(condition instanceof Node)
                condition = evaluateNode(condition);

            if(typeof condition === 'boolean')
                evaluateNode(node.getOutput(condition ? 0 : 1));
            else
                console.error("Expected inputs [boolean] interpreting node 'if'");
            return null;
        }
        case "while": {
            while(true) {
                let input: Node | number | boolean | string = node.getInput(1);
                if(input instanceof Node)
                    input = evaluateNode(input);
                    
                if(typeof input === 'boolean')
                {
                    if(input)
                        evaluateNode(node.getOutput(1));
                    else
                        break;
                }
                else {
                    console.error("Expected inputs [boolean] interpreting node 'while");
                    return null;
                }
            }
            evaluateNode(node.getOutput(0));
            return null;
        }
        case "for": {
            let first: Node | number | boolean | string = node.getInput(1);
            let last: Node | number | boolean | string = node.getInput(2);
            let step: Node | number | boolean | string = node.getInput(3);
            if(first instanceof Node)
                first = evaluateNode(first);
            if(last instanceof Node)
                last = evaluateNode(last);
            if(step instanceof Node)
                step = evaluateNode(step);

            if(typeof first === "number" && typeof last === "number" && typeof step === "number") {
                let i: number = first;
                while(i < last) {
                    evaluateNode(node.getOutput(1));
                    i += step;
                }
                evaluateNode(node.getOutput(0));
            }
            else {
                console.error("Expected inputs [number, number, number] interpreting node 'for");
                return null;
            }
            return null;
        }
        case "add": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a + b;
            else
                console.error("Expected inputs [number, number] interpreting node 'add'");
            return 0;
        }
        case "subtract": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a - b;
            else
                console.error("Expected inputs [number, number] interpreting node 'subtract'");
            return 0;
        }
        case "multiply": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a * b;
            else
                console.error("Expected inputs [number, number] interpreting node 'multiply'");
            return 0;
        }
        case "divide": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number") {
                if(b == 0) {
                    console.error("Cannot divide by zero interpreting node 'divide");
                    return 0;
                }
                return a / b;
            }
            else
                console.error("Expected inputs [number, number] interpreting node 'add'");
            return 0;
        }
        case "and": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "boolean" && typeof b === "boolean")
                return a && b;
            else
                console.error("Expected inputs [boolean, boolean] interpreting node 'and'");
            return false;
        }
        case "or": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "boolean" && typeof b === "boolean")
                return a && b;
            else
                console.error("Expected inputs [boolean, boolean] interpreting node 'and'");
            return false;
        }
        case "not": {
            let a: Node | number | boolean | string = node.getInput(0);
            if(a instanceof Node)
                a = evaluateNode(a);

            if(typeof a === "boolean")
                return !a;
            else
                console.error("Expected inputs [boolean] interpreting node 'not'");
            return false;
        }
        case "equal": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a == b;
            else
                console.error("Expected inputs [number, number] interpreting node 'equal'");
            return false;
        }
        case "notEqual": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a != b;
            else
                console.error("Expected inputs [number, number] interpreting node 'notEqual'");
            return false;
        }
        case "less": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a < b;
            else
                console.error("Expected inputs [number, number] interpreting node 'less'");
            return false;
        }
        case "lessOrEqual": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a <= b;
            else
                console.error("Expected inputs [number, number] interpreting node 'lessOrEqual'");
            return false;
        }
        case "greater": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a > b;
            else
                console.error("Expected inputs [number, number] interpreting node 'greater'");
            return false;
        }
        case "greaterOrEqual": {
            let a: Node | number | boolean | string = node.getInput(0);
            let b: Node | number | boolean | string = node.getInput(1);
            if(a instanceof Node)
                a = evaluateNode(a);
            if(b instanceof Node)
                b = evaluateNode(b);

            if(typeof a === "number" && typeof b === "number")
                return a >= b;
            else
                console.error("Expected inputs [number, number] interpreting node 'greaterOrEqual'");
            return false;
        }
        case "printInt": {
            let input: Node | number | boolean | string = node.getInput(1);
            if(input instanceof Node)
                input = evaluateNode(input);

            if(typeof input === "number") {
                console.log(input);
                evaluateNode(node.getOutput(0));
            }
            else
                console.error("Expected inputs [number] interpreting node 'printInt'");
            return false;
        }
    }
}

export function interpret(start: Node) {
    if(start.type == "start")
        evaluateNode(start);
}