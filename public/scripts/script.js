var CheckBox = /** @class */ (function () {
    function CheckBox() {
        var _this = this;
        this.element = document.createElement("div");
        this.element.classList.add("checkbox");
        var tick = document.createElement("span");
        tick.classList.add("material-symbols-rounded");
        tick.innerHTML = "check";
        this.element.appendChild(tick);
        this.element.addEventListener("click", function () { return _this.setChecked(!_this.checked); });
    }
    CheckBox.prototype.setChecked = function (checked) {
        this.checked = checked;
        this.element.setAttribute("checked", "".concat(this.checked));
    };
    return CheckBox;
}());
var LiteEvent = /** @class */ (function () {
    function LiteEvent() {
        this.handlers = [];
    }
    LiteEvent.prototype.addListener = function (handler) {
        this.handlers.push(handler);
    };
    LiteEvent.prototype.removeListener = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    LiteEvent.prototype.dispatch = function (data) {
        this.handlers.slice(0).forEach(function (h) { return h(data); });
    };
    LiteEvent.prototype.expose = function () {
        return this;
    };
    return LiteEvent;
}());
var Graph;
(function (Graph_1) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x !== null && x !== void 0 ? x : 0;
            this.y = y !== null && y !== void 0 ? y : 0;
        }
        Point.prototype.add = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        return Point;
    }());
    Graph_1.Point = Point;
    var Graph = /** @class */ (function () {
        function Graph() {
            var _this = this;
            this.nodes = [];
            this.dragging = false;
            this.dragNode = null;
            this.linking = false;
            this.linkPin = null;
            this.viewport = document.getElementById("graph-viewport");
            this.drawingLink = new Link();
            this.viewport.addEventListener("mousemove", function (event) { return _this.onMouseMove(event); });
            this.viewport.addEventListener("mouseup", function (event) { return _this.onMouseUp(event); });
            this.viewport.addEventListener("contextmenu", function (event) { return _this.onContextMenu(event); });
        }
        Graph.prototype.onMouseMove = function (event) {
            if (this.dragging) {
                var position = new Point(this.dragNodeStart.x + event.clientX - this.dragCursorStart.x, this.dragNodeStart.y + event.clientY - this.dragCursorStart.y);
                this.dragNode.setPosition(position);
            }
            if (this.linking) {
                var position = new Point(event.clientX, event.clientY);
                switch (this.linkPin.getType()) {
                    case PinType.Output:
                        this.drawingLink.setEndPoint(position);
                        break;
                    case PinType.Input:
                        this.drawingLink.setStartPoint(position);
                        break;
                }
            }
        };
        Graph.prototype.onMouseUp = function (event) {
            if (this.dragging) {
                this.dragNode.endDrag();
                this.dragNode = null;
                this.dragging = false;
            }
            if (this.linking) {
                this.drawingLink.reset();
                this.linking = false;
            }
        };
        Graph.prototype.onContextMenu = function (event) {
            event.preventDefault();
            var nodeMenu = document.getElementById("node-menu");
            var rect = this.viewport.getBoundingClientRect();
            nodeMenu.style.left = "".concat(event.clientX - rect.x, "px");
            nodeMenu.style.top = "".concat(event.clientY - rect.y, "px");
            nodeMenu.classList.add("visible");
            var searchbar = document.getElementById("node-search-bar");
            searchbar.value = "";
            searchbar.focus();
        };
        Graph.prototype.beginDrag = function (node, position) {
            this.dragNode = node;
            this.dragCursorStart = position;
            this.dragNodeStart = this.dragNode.getPosition();
            this.dragging = true;
        };
        Graph.prototype.beginLink = function (pin) {
            this.linkPin = pin;
            this.linking = true;
            var position = this.linkPin.getPosition();
            this.drawingLink.setPoints(position, position);
        };
        Graph.prototype.endLink = function (pin) {
            if (this.linkPin != pin
                && this.linkPin.getType() != pin.getType()
                && this.linkPin.getNode() != pin.getNode()
                && this.linkPin.getValueType() == pin.getValueType()) {
                var link = void 0;
                switch (this.linkPin.getType()) {
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
        };
        return Graph;
    }());
    Graph_1.Graph = Graph;
    var Link = /** @class */ (function () {
        function Link(startPin, endPin) {
            if (startPin != undefined && startPin != null) {
                this.startPin = startPin;
                this.startPoint = startPin.getPosition();
            }
            else {
                this.startPin = null;
                this.startPoint = new Point();
            }
            if (endPin != undefined && endPin != null) {
                this.endPin = endPin;
                this.endPoint = endPin.getPosition();
            }
            else {
                this.endPin = null;
                this.endPoint = new Point();
            }
            this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            var linksParent = document.getElementById("graph-links");
            linksParent.appendChild(this.path);
            this.updatePath();
        }
        Link.prototype.setStartPoint = function (startPoint) {
            this.startPoint = startPoint;
            this.updatePath();
        };
        Link.prototype.setEndPoint = function (endPoint) {
            this.endPoint = endPoint;
            this.updatePath();
        };
        Link.prototype.setPoints = function (startPoint, endPoint) {
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            this.updatePath();
        };
        Link.prototype.reset = function () {
            this.startPoint = new Point(0, 0);
            this.endPoint = new Point(0, 0);
            this.path.setAttribute("d", "");
        };
        Link.prototype.destroy = function () {
            this.path.parentElement.removeChild(this.path);
            this.startPin.breakLink(this);
            this.endPin.breakLink(this);
        };
        Link.prototype.updatePath = function () {
            var startControl = new Point(this.startPoint.x + Link.curve, this.startPoint.y);
            var endControl = new Point(this.endPoint.x - Link.curve, this.endPoint.y);
            this.path.setAttribute("d", "M ".concat(this.startPoint.x, " ").concat(this.startPoint.y, " C ").concat(startControl.x, " ").concat(startControl.y, ", ").concat(endControl.x, " ").concat(endControl.y, ", ").concat(this.endPoint.x, " ").concat(this.endPoint.y));
        };
        Link.curve = 32;
        return Link;
    }());
    Graph_1.Link = Link;
    var PinType;
    (function (PinType) {
        PinType[PinType["Output"] = 0] = "Output";
        PinType[PinType["Input"] = 1] = "Input";
    })(PinType || (PinType = {}));
    var ValueType;
    (function (ValueType) {
        ValueType[ValueType["Flow"] = 1] = "Flow";
        ValueType[ValueType["Int"] = 2] = "Int";
        ValueType[ValueType["Float"] = 4] = "Float";
        ValueType[ValueType["String"] = 8] = "String";
        ValueType[ValueType["Boolean"] = 16] = "Boolean";
    })(ValueType || (ValueType = {}));
    var Pin = /** @class */ (function () {
        function Pin(graph, node, valueType, type) {
            if (type === void 0) { type = PinType.Output; }
            var _this = this;
            this.type = PinType.Output;
            this.links = [];
            this.linksChangedEvent = new LiteEvent();
            this.graph = graph;
            this.node = node;
            this.type = type;
            this.valueType = valueType;
            this.element = document.createElement("div");
            this.element.classList.add("pin");
            if (this.type == PinType.Output)
                this.element.classList.add("right");
            this.element.addEventListener("mousedown", function (event) { return _this.onMouseDown(event); });
            this.element.addEventListener("mouseup", function (event) { return _this.onMouseUp(event); });
            this.element.addEventListener("mouseenter", function (event) { return _this.onMouseEnter(event); });
            this.element.addEventListener("mouseleave", function (event) { return _this.onMouseExit(event); });
            this.element.addEventListener("contextmenu", function (event) { return event.preventDefault(); });
            this.graphic = document.createElement("div");
            this.graphic.classList.add("pin-graphic");
            switch (this.valueType) {
                case ValueType.Flow:
                    this.graphic.classList.add("type-flow");
                    break;
                case ValueType.Int:
                    this.graphic.classList.add("type-int");
                    break;
                case ValueType.Float:
                    this.graphic.classList.add("type-float");
                    break;
                case ValueType.String:
                    this.graphic.classList.add("type-string");
                    break;
                case ValueType.Boolean:
                    this.graphic.classList.add("type-boolean");
                    break;
            }
            this.element.appendChild(this.graphic);
        }
        Pin.prototype.getType = function () { return this.type; };
        Pin.prototype.getValueType = function () { return this.valueType; };
        Pin.prototype.getNode = function () { return this.node; };
        Object.defineProperty(Pin.prototype, "onLinksChanged", {
            get: function () { return this.linksChangedEvent.expose(); },
            enumerable: false,
            configurable: true
        });
        Pin.prototype.getPosition = function () {
            var rect = this.element.getBoundingClientRect();
            return new Point(rect.left + rect.width / 2, rect.top + rect.height / 2);
        };
        Pin.prototype.addLink = function (link) {
            this.links.push(link);
            this.setGraphicSolid(true);
            this.linksChangedEvent.dispatch(this.links.length);
        };
        Pin.prototype.breakLink = function (link) {
            var index = this.links.indexOf(link);
            if (index > -1)
                this.links.splice(index, 1);
            if (this.links.length <= 0)
                this.setGraphicSolid(false);
            this.linksChangedEvent.dispatch(this.links.length);
        };
        Pin.prototype.setGraphicSolid = function (solid) {
            if (solid)
                this.element.classList.add("solid");
            else
                this.element.classList.remove("solid");
        };
        Pin.prototype.onMouseDown = function (event) {
            if (!event.target.classList.contains("pin"))
                return;
            if (event.button == 0) {
                event.preventDefault();
                event.stopPropagation();
                this.graph.beginLink(this);
            }
            else if (event.button == 2) {
                event.preventDefault();
                event.stopPropagation();
                var linkCount = this.links.length;
                for (var i = 0; i < linkCount; i++)
                    this.links[0].destroy();
            }
        };
        Pin.prototype.onMouseUp = function (event) {
            if (!event.target.classList.contains("pin"))
                return;
            if (event.button == 0)
                this.graph.endLink(this);
        };
        Pin.prototype.onMouseEnter = function (event) {
            this.setGraphicSolid(true);
        };
        Pin.prototype.onMouseExit = function (event) {
            if (this.links.length <= 0)
                this.setGraphicSolid(false);
        };
        Pin.prototype.updateLinkPositions = function () {
            var _this = this;
            switch (this.type) {
                case PinType.Output:
                    this.links.forEach(function (link) { return link.setStartPoint(_this.getPosition()); });
                    break;
                case PinType.Input:
                    this.links.forEach(function (link) { return link.setEndPoint(_this.getPosition()); });
                    break;
            }
        };
        return Pin;
    }());
    var Node = /** @class */ (function () {
        function Node(graph, nodeData) {
            var _this = this;
            this.inputs = [];
            this.outputs = [];
            this.id = Node.currentID++;
            this.graph = graph;
            var nodeDefinition = nodeDefinitions[nodeData.type];
            // Node
            this.nodeElement = document.createElement("div");
            this.nodeElement.addEventListener("mousedown", function (event) { return _this.onMouseDown(event); });
            this.nodeElement.classList.add("graph-node");
            // Head
            var head = document.createElement("div");
            head.classList.add("head");
            var title = document.createElement("span");
            title.innerHTML = nodeDefinition.name;
            head.appendChild(title);
            this.nodeElement.appendChild(head);
            // Body
            var body = document.createElement("div");
            body.classList.add("body");
            this.nodeElement.appendChild(body);
            // Rows
            var rows = Math.max(nodeDefinition.inputs.length, nodeDefinition.outputs.length);
            var _loop_1 = function (i) {
                var row = i + 1;
                if (i < nodeDefinition.inputs.length) {
                    var input = nodeDefinition.inputs[i];
                    var valueType = stringToValueType(input.type);
                    var inputPin = new Pin(this_1.graph, this_1, valueType, PinType.Input);
                    inputPin.element.style.gridColumn = "1";
                    inputPin.element.style.gridRow = row.toString();
                    this_1.inputs.push(inputPin);
                    body.appendChild(inputPin.element);
                    var inputLabel = document.createElement("span");
                    inputLabel.innerHTML = input.name;
                    inputLabel.style.gridColumn = "2";
                    inputLabel.style.gridRow = row.toString();
                    body.appendChild(inputLabel);
                    if (valueType & (ValueType.Int | ValueType.Float | ValueType.String)) {
                        var inputField_1 = document.createElement("span");
                        inputField_1.classList.add("input");
                        inputField_1.setAttribute("role", "textbox");
                        inputField_1.setAttribute("contenteditable", "true");
                        inputField_1.style.gridColumn = "3";
                        inputField_1.style.gridRow = row.toString();
                        body.appendChild(inputField_1);
                        inputPin.onLinksChanged.addListener(function (linkCount) {
                            inputField_1.style.visibility = linkCount > 0 ? "hidden" : "visible";
                        });
                    }
                    else if (valueType == ValueType.Boolean) {
                        var inputCheck_1 = new CheckBox();
                        inputCheck_1.element.style.gridColumn = "3";
                        inputCheck_1.element.style.gridRow = row.toString();
                        body.appendChild(inputCheck_1.element);
                        inputPin.onLinksChanged.addListener(function (linkCount) {
                            inputCheck_1.element.style.visibility = linkCount > 0 ? "hidden" : "visible";
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
                if (i < nodeDefinition.outputs.length) {
                    var output = nodeDefinition.outputs[i];
                    var valueType = stringToValueType(output.type);
                    var outputLabel = document.createElement("span");
                    outputLabel.classList.add("text-right");
                    outputLabel.innerHTML = output.name;
                    outputLabel.style.gridColumn = "5";
                    outputLabel.style.gridRow = row.toString();
                    body.appendChild(outputLabel);
                    var outputPin = new Pin(this_1.graph, this_1, valueType);
                    outputPin.element.style.gridColumn = "6";
                    outputPin.element.style.gridRow = row.toString();
                    this_1.outputs.push(outputPin);
                    body.appendChild(outputPin.element);
                }
            };
            var this_1 = this;
            for (var i = 0; i < rows; i++) {
                _loop_1(i);
            }
            this.graph.viewport.appendChild(this.nodeElement);
            this.setPosition(new Point(nodeData.posX, nodeData.posY));
        }
        Node.prototype.getPosition = function () {
            var style = window.getComputedStyle(this.nodeElement);
            var matrix = new DOMMatrixReadOnly(style.transform);
            return new Point(matrix.m41, matrix.m42);
        };
        Node.prototype.setPosition = function (position) {
            this.nodeElement.style.transform = "translate(".concat(position.x, "px, ").concat(position.y, "px)");
            this.inputs.forEach(function (input) { return input.updateLinkPositions(); });
            this.outputs.forEach(function (output) { return output.updateLinkPositions(); });
        };
        Node.prototype.endDrag = function () {
            this.nodeElement.style.cursor = null;
        };
        Node.prototype.onMouseDown = function (event) {
            if (!event.target.classList.contains("graph-node"))
                return;
            event.preventDefault();
            var position = new Point(event.clientX, event.clientY);
            this.graph.beginDrag(this, position);
            this.nodeElement.style.cursor = "grabbing";
        };
        Node.currentID = 0;
        return Node;
    }());
    Graph_1.Node = Node;
    function stringToValueType(valueType) {
        switch (valueType) {
            case "Flow": return ValueType.Flow;
            case "Int": return ValueType.Int;
            case "Float": return ValueType.Float;
            case "String": return ValueType.String;
            case "Boolean": return ValueType.Boolean;
            default: return ValueType.Flow;
        }
    }
})(Graph || (Graph = {}));
var nodeDefinitions = {
    start: {
        name: "Start",
        category: "Flow",
        inputs: [],
        outputs: [{ name: "", type: "Flow" }]
    },
    if: {
        name: "If",
        category: "Flow",
        inputs: [{ name: "", type: "Flow" }, { name: "Condition", type: "Boolean" }],
        outputs: [{ name: "True", type: "Flow" }, { name: "False", type: "Flow" }]
    },
    add: {
        name: "Add",
        category: "Math",
        inputs: [{ name: "A", type: "Int" }, { name: "B", type: "Int" }],
        outputs: [{ name: "", type: "Int" }]
    },
};
var nodes = [
    {
        id: 0,
        type: "start",
        posX: 32,
        posY: 32,
        inLinks: [],
        outLinks: [{ node: 1, index: 0 }]
    },
    {
        id: 1,
        type: "add",
        posX: 160,
        posY: 32,
        inLinks: [{ node: 0, index: 0 }, { node: null }],
        outLinks: [{ node: null }]
    },
    {
        id: 2,
        type: "if",
        posX: 288,
        posY: 32,
        inLinks: [],
        outLinks: []
    }
];
// Generate graph
var graph = new Graph.Graph();
for (var i = 0; i < nodes.length; i++) {
    var nodeData = nodes[i];
    graph.nodes.push(new Graph.Node(graph, nodeData));
}
// Generate add node menu items
function addTreeViewBranch(parent, label) {
    var branchElement = document.createElement("li");
    branchElement.classList.add("branch");
    branchElement.addEventListener("click", function () { return branchElement.classList.toggle("expanded"); });
    var rowElement = document.createElement("div");
    var arrowElement = document.createElement("span");
    arrowElement.classList.add("material-symbols-rounded");
    rowElement.appendChild(arrowElement);
    var labelElement = document.createElement("span");
    labelElement.textContent = label;
    rowElement.appendChild(labelElement);
    branchElement.appendChild(rowElement);
    var childList = document.createElement("ul");
    branchElement.appendChild(childList);
    parent.appendChild(branchElement);
    return childList;
}
function addTreeViewListItem(parent, label) {
    var itemElement = document.createElement("li");
    itemElement.classList.add("branch");
    var rowElement = document.createElement("div");
    var labelElement = document.createElement("span");
    labelElement.textContent = label;
    rowElement.appendChild(labelElement);
    itemElement.appendChild(rowElement);
    parent.appendChild(itemElement);
}
var nodeTreeView = document.getElementById("node-tree-view");
var categoryLists = {};
for (var key in nodeDefinitions) {
    var definition = nodeDefinitions[key];
    if (!(definition.category in categoryLists))
        categoryLists[definition.category] = addTreeViewBranch(nodeTreeView, definition.category);
    addTreeViewListItem(categoryLists[definition.category], definition.name);
}
function roundMultiple(value, multiple) {
    return Math.round(value / multiple) * multiple;
}
function ceilMultiple(value, multiple) {
    return Math.ceil(value / multiple) * multiple;
}
//# sourceMappingURL=script.js.map