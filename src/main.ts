const nodeDefinitions = {
    start: {
        name: "Start",
        category: "Flow",
        inputs: [],
        outputs: [{name: "", type: "Flow"}]
    },
    if: {
        name: "If",
        category: "Flow",
        inputs: [{ name: "", type: "Flow"}, { name: "Condition", type: "Boolean"}],
        outputs: [{ name: "True", type: "Flow"}, { name: "False", type: "Flow"}]
    },
    add: {
        name: "Add",
        category: "Math",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Int"}]
    },
    subtract: {
        name: "Subtract",
        category: "Math",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Int"}]
    },
    multipy: {
        name: "Multiply",
        category: "Math",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Int"}]
    },
    divide: {
        name: "Divide",
        category: "Math",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Int"}]
    },
};

let nodes = [
    {
        id: 0,
        type: "start",
        posX: 32,
        posY: 32,
        inLinks: [],
        outLinks: [{node: 1, index: 0}]
    },
    {
        id: 1,
        type: "add",
        posX: 160,
        posY: 32,
        inLinks: [{node: 0, index: 0}, {node: null}],
        outLinks: [{node: null}]
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
const graph: Graph.Graph = new Graph.Graph();

for (let i = 0; i < nodes.length; i++) {
    const nodeData = nodes[i];
    graph.nodes.push(new Graph.Node(graph, nodeData));
}

// Generate add node menu items
function addTreeViewBranch(parent: HTMLUListElement, label: string) {
    const branchElement: HTMLLIElement = document.createElement("li");
    branchElement.classList.add("branch");
    branchElement.addEventListener("click", () => branchElement.classList.toggle("expanded"));
    
    const rowElement: HTMLDivElement = document.createElement("div");
    const arrowElement: HTMLSpanElement = document.createElement("span");
    arrowElement.classList.add("material-symbols-rounded");
    rowElement.appendChild(arrowElement);
    const labelElement: HTMLSpanElement = document.createElement("span");
    labelElement.textContent = label;
    rowElement.appendChild(labelElement);
    branchElement.appendChild(rowElement);
    
    const childList: HTMLUListElement = document.createElement("ul");
    branchElement.appendChild(childList);
    
    parent.appendChild(branchElement);
    return childList;
}

function addTreeViewListItem(parent: HTMLUListElement, label: string) {
    const itemElement: HTMLLIElement = document.createElement("li");
    itemElement.classList.add("branch");
    
    const rowElement: HTMLDivElement = document.createElement("div");
    const labelElement: HTMLSpanElement = document.createElement("span");
    labelElement.textContent = label;
    rowElement.appendChild(labelElement);
    itemElement.appendChild(rowElement);
    
    parent.appendChild(itemElement);
}

const nodeTreeView: HTMLUListElement = <HTMLUListElement>document.getElementById("node-tree-view");
const categoryLists = {};

for (let key in nodeDefinitions) {
    const definition = nodeDefinitions[key];
    if(!(definition.category in categoryLists))
        categoryLists[definition.category] = addTreeViewBranch(nodeTreeView, definition.category);
    
    addTreeViewListItem(categoryLists[definition.category], definition.name);
}
