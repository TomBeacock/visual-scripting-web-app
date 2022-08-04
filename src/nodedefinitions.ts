export const nodeDefinitions = {
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