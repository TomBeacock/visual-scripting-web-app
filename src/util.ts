function roundMultiple(value: number, multiple: number): number {
    return Math.round(value / multiple) * multiple;
}

function ceilMultiple(value: number, multiple: number): number {
    return Math.ceil(value / multiple) * multiple;
}