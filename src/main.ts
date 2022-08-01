const nodeDefinitions = {
    start: {
        name: "Start",
        inputs: [],
        outputs: [{name: "", type: "Flow"}]
    },
    add: {
        name: "Add",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Int"}]
    },
    if: {
        name: "If",
        inputs: [{ name: "", type: "Flow"}, { name: "Condition", type: "Boolean"}],
        outputs: [{ name: "True", type: "Flow"}, { name: "False", type: "Flow"}]
    },
    test: {
        name: "Test",
        inputs: [
            { name: "Int", type: "Int" },
            { name: "Float", type: "Float" },
            { name: "String", type: "String" },
            { name: "Bool", type: "Boolean" }
        ],
        outputs: [
            { name: "Int", type: "Int" },
            { name: "Float", type: "Float" },
            { name: "String", type: "String" },
            { name: "Bool", type: "Boolean" }
        ]
    }
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

const graph: Graph.Graph = new Graph.Graph();

for (let i = 0; i < nodes.length; i++) {
    const nodeData = nodes[i];
    graph.nodes.push(new Graph.Node(graph, nodeData));
}

const treeViewBranches: HTMLCollectionOf<Element> = document.getElementsByClassName("branch");
for (let i = 0; i < treeViewBranches.length; i++) {
    const branch = treeViewBranches[i];
    branch.addEventListener("click", () => branch.classList.toggle("expanded"));
}
