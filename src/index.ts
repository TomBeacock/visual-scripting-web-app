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
import { Point } from "./util";
import { initAddNodeMenu } from "./add-node-menu";

// Generate graph
const graph: Graph = new Graph();
initAddNodeMenu(graph);

// Load nodes
for (let i = 0; i < nodes.length; i++) {
    const nodeData = nodes[i];
    graph.nodes.push(new Node(graph, nodeData.type, new Point(nodeData.posX, nodeData.posY)));
}
