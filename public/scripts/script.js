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
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x !== null && x !== void 0 ? x : 0;
        this.y = y !== null && y !== void 0 ? y : 0;
        this.width = width !== null && width !== void 0 ? width : 0;
        this.height = height !== null && height !== void 0 ? height : 0;
    }
    return Rect;
}());
function roundMultiple(value, multiple) {
    return Math.round(value / multiple) * multiple;
}
function ceilMultiple(value, multiple) {
    return Math.ceil(value / multiple) * multiple;
}
function getTranslation(element) {
    var style = window.getComputedStyle(element);
    var matrix = new DOMMatrixReadOnly(style.transform);
    return new Point(matrix.m41, matrix.m42);
}
function setTranslation(element, translation) {
    element.style.transform = "translate(".concat(translation.x, "px, ").concat(translation.y, "px)");
}
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
var Graph;
(function (Graph_1) {
    var Graph = /** @class */ (function () {
        function Graph() {
            var _this = this;
            this.nodes = [];
            this.panning = false;
            this.dragging = false;
            this.dragNode = null;
            this.linking = false;
            this.linkPin = null;
            this.viewport = document.getElementById("graph-viewport");
            this.graphArea = document.getElementById("graph-area");
            this.drawingLink = new Link();
            this.viewport.addEventListener("mousedown", function (event) { return _this.onMouseDown(event); });
            this.viewport.addEventListener("mousemove", function (event) { return _this.onMouseMove(event); });
            this.viewport.addEventListener("mouseup", function (event) { return _this.onMouseUp(event); });
            this.viewport.addEventListener("contextmenu", function (event) { return _this.onContextMenu(event); });
        }
        Graph.prototype.onMouseDown = function (event) {
            if (this.dragging || this.linking)
                return;
            if (event.button == 1) {
                this.dragTargetBegin = getTranslation(this.graphArea);
                this.dragCursorBegin = new Point(event.clientX, event.clientY);
                this.panning = true;
            }
        };
        Graph.prototype.onMouseMove = function (event) {
            if (this.panning) {
                var position = new Point(this.dragTargetBegin.x + event.clientX - this.dragCursorBegin.x, this.dragTargetBegin.y + event.clientY - this.dragCursorBegin.y);
                setTranslation(this.graphArea, position);
            }
            if (this.dragging) {
                var position = new Point(this.dragTargetBegin.x + event.clientX - this.dragCursorBegin.x, this.dragTargetBegin.y + event.clientY - this.dragCursorBegin.y);
                this.dragNode.setPosition(position);
            }
            if (this.linking) {
                var areaRect = this.graphArea.getBoundingClientRect();
                var position = new Point(event.clientX - areaRect.left, event.clientY - areaRect.top);
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
            if (this.panning) {
                this.panning = false;
            }
            if (this.dragging) {
                this.dragNode.element.style.cursor = null;
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
            var viewportRect = this.viewport.getBoundingClientRect();
            var nodeMenu = document.getElementById("node-menu");
            var nodeMenuRect = nodeMenu.getBoundingClientRect();
            var alignRight = event.clientX > viewportRect.width / 2;
            nodeMenu.style.left = "".concat(event.clientX - viewportRect.x - (alignRight ? nodeMenuRect.width : 0), "px");
            nodeMenu.style.top = "".concat(event.clientY - viewportRect.y, "px");
            nodeMenu.classList.add("visible");
            var searchbar = document.getElementById("node-search-bar");
            searchbar.value = "";
            searchbar.focus();
        };
        Graph.prototype.beginDrag = function (node, position) {
            if (this.panning || this.linking)
                return;
            this.dragNode = node;
            this.dragNode.element.style.cursor = "grabbing";
            this.dragCursorBegin = position;
            this.dragTargetBegin = this.dragNode.getPosition();
            this.dragging = true;
        };
        Graph.prototype.beginLink = function (pin) {
            if (this.panning || this.dragging)
                return;
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
            this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.element.classList.add("graph-link");
            this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.element.appendChild(this.path);
            var graphLinks = document.getElementById("graph-links");
            graphLinks.appendChild(this.element);
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
            var startControlX = this.startPoint.x + Link.curve;
            var endControlX = this.endPoint.x - Link.curve;
            var newBounds = new Rect();
            var s = new Point();
            var e = new Point();
            if (this.startPoint.x <= endControlX) {
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
            if (this.startPoint.y <= this.endPoint.y) {
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
            this.element.setAttribute("width", "".concat(newBounds.width));
            this.element.setAttribute("height", "".concat(newBounds.height));
            this.path.setAttribute("d", "M ".concat(s.x, " ").concat(s.y, " C ").concat(s.x + Link.curve, " ").concat(s.y, ", ").concat(e.x - Link.curve, " ").concat(e.y, ", ").concat(e.x, " ").concat(e.y));
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
            var graphRect = this.graph.graphArea.getBoundingClientRect();
            var pinRect = this.element.getBoundingClientRect();
            return new Point(pinRect.left + pinRect.width / 2 - graphRect.left, pinRect.top + pinRect.height / 2 - graphRect.top);
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
            this.element = document.createElement("div");
            this.element.addEventListener("mousedown", function (event) { return _this.onMouseDown(event); });
            this.element.classList.add("graph-node");
            // Head
            var head = document.createElement("div");
            head.classList.add("head");
            var title = document.createElement("span");
            title.innerHTML = nodeDefinition.name;
            head.appendChild(title);
            this.element.appendChild(head);
            // Body
            var body = document.createElement("div");
            body.classList.add("body");
            this.element.appendChild(body);
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
            var graphNodes = document.getElementById("graph-nodes");
            graphNodes.appendChild(this.element);
            this.setPosition(new Point(nodeData.posX, nodeData.posY));
        }
        Node.prototype.getPosition = function () {
            return getTranslation(this.element);
        };
        Node.prototype.setPosition = function (position) {
            setTranslation(this.element, position);
            this.inputs.forEach(function (input) { return input.updateLinkPositions(); });
            this.outputs.forEach(function (output) { return output.updateLinkPositions(); });
        };
        Node.prototype.onMouseDown = function (event) {
            if (!event.target.classList.contains("graph-node"))
                return;
            if (event.button == 0) {
                event.preventDefault();
                var position = new Point(event.clientX, event.clientY);
                this.graph.beginDrag(this, position);
            }
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
    subtract: {
        name: "Subtract",
        category: "Math",
        inputs: [{ name: "A", type: "Int" }, { name: "B", type: "Int" }],
        outputs: [{ name: "", type: "Int" }]
    },
    multipy: {
        name: "Multiply",
        category: "Math",
        inputs: [{ name: "A", type: "Int" }, { name: "B", type: "Int" }],
        outputs: [{ name: "", type: "Int" }]
    },
    divide: {
        name: "Divide",
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
//# sourceMappingURL=script.js.map