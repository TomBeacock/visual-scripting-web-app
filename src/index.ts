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

import { Graph } from "./graph";
import { Node } from "./node";
import { nodeDefinitions } from "./nodedefinitions";
import { Point, getTopLeft } from "./util";

// Generate graph
const graph: Graph = new Graph();

for (let i = 0; i < nodes.length; i++) {
    const nodeData = nodes[i];
    graph.nodes.push(new Node(graph, nodeData.type, new Point(nodeData.posX, nodeData.posY)));
}

// Generate add node menu items
function addTreeViewBranch(parent: HTMLUListElement, label: string): HTMLUListElement {
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

function addTreeViewListItem(parent: HTMLUListElement, label: string): HTMLLIElement {
    const itemElement: HTMLLIElement = document.createElement("li");
    itemElement.classList.add("branch");
    
    const rowElement: HTMLDivElement = document.createElement("div");
    const labelElement: HTMLSpanElement = document.createElement("span");
    labelElement.textContent = label;
    rowElement.appendChild(labelElement);
    itemElement.appendChild(rowElement);
    
    parent.appendChild(itemElement);
    return itemElement;
}

const nodeMenu: HTMLElement = document.getElementById("node-menu");
nodeMenu.addEventListener("mousedown", event => {
    if(event.button == 0)
        event.stopPropagation();
});
const nodeTreeView: HTMLUListElement = <HTMLUListElement>document.getElementById("node-tree-view");
const categoryLists = {};

for (let key in nodeDefinitions) {
    const definition = nodeDefinitions[key];
    if(!(definition.category in categoryLists))
        categoryLists[definition.category] = addTreeViewBranch(nodeTreeView, definition.category);
    
    const listItem: HTMLLIElement = addTreeViewListItem(categoryLists[definition.category], definition.name);
    listItem.addEventListener("click", event => {
        if(event.button == 0) {
            event.stopPropagation();
            const nodePosition = graph.viewportToAreaPoint(getTopLeft(nodeMenu));
            graph.nodes.push(new Node(graph, key, nodePosition));
            nodeMenu.classList.remove("visible");
        }
    });
}