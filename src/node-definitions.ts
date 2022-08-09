export const nodeDefinitions = {
    // Flow
    start: {
        name: "Start",
        category: "Flow",
        inputs: [],
        outputs: [{name: "", type: "Flow"}]
    },
    if: {
        name: "If",
        category: "Flow",
        inputs: [{ name: "", type: "Flow"}, { name: "Condition", type: "Bool"}],
        outputs: [{ name: "True", type: "Flow"}, { name: "False", type: "Flow"}]
    },
    while: {
        name: "While",
        category: "Flow",
        inputs: [{ name: "", type: "Flow"}, { name: "Condition", type: "Bool"}],
        outputs: [{ name: "Exit", type: "Flow"}, { name: "Body", type: "Flow"}]
    },
    for: {
        name: "For",
        category: "Flow",
        inputs: [{ name: "", type: "Flow"}, { name: "First", type: "Int"}, { name: "Last", type: "Int"}, { name: "Step", type: "Int"}],
        outputs: [{ name: "Exit", type: "Flow"}, { name: "Body", type: "Flow"}]
    },

    // Math
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

    // Logic
    and: {
        name: "And",
        category: "Logic",
        inputs: [{name: "A", type: "Bool"}, {name: "B", type: "Bool"}],
        outputs: [{name: "", type: "Bool"}]
    },
    or: {
        name: "Or",
        category: "Logic",
        inputs: [{name: "A", type: "Bool"}, {name: "B", type: "Bool"}],
        outputs: [{name: "", type: "Bool"}]
    },
    not: {
        name: "Not",
        category: "Logic",
        inputs: [{name: "", type: "Bool"}],
        outputs: [{name: "", type: "Bool"}]
    },
    equal: {
        name: "Equal",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    },
    notEqual: {
        name: "Not Equal",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    },
    less: {
        name: "Less",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    },
    lessOrEqual: {
        name: "Less Or Equal",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    },
    greater: {
        name: "Greater",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    },
    greaterOrEqual: {
        name: "Greater Or Equal",
        category: "Logic",
        inputs: [{name: "A", type: "Int"}, {name: "B", type: "Int"}],
        outputs: [{name: "", type: "Bool"}]
    }
};