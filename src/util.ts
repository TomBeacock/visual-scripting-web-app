class Point {
    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    add(x: number, y: number): Point {
        this.x += x;
        this.y += y;
        return this;
    }
}

function roundMultiple(value: number, multiple: number): number {
    return Math.round(value / multiple) * multiple;
}

function ceilMultiple(value: number, multiple: number): number {
    return Math.ceil(value / multiple) * multiple;
}

function getTranslation(element: HTMLElement): Point {
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
    return new Point(matrix.m41, matrix.m42);
}

function setTranslation(element: HTMLElement, translation: Point): void {
    element.style.transform = `translate(${translation.x}px, ${translation.y}px)`;
}