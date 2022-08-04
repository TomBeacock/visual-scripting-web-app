export class CheckBox {
    private checked: boolean;

    element: HTMLDivElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("checkbox");
        const tick: HTMLSpanElement = document.createElement("span");
        tick.classList.add("material-symbols-rounded");
        tick.innerHTML = "check";
        this.element.appendChild(tick);
        this.element.addEventListener("click", () => this.setChecked(!this.checked));
    }

    setChecked(checked: boolean) {
        this.checked = checked;
        this.element.setAttribute("checked", `${this.checked}`);
    }
}