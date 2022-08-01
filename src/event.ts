interface ILiteEvent<T> {
    addListener(handler: { (data?: T): void }) : void;
    removeListener(handler: { (data?: T): void }) : void;
}

class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public addListener(handler: { (data?: T): void }): void {
        this.handlers.push(handler);
    }

    public removeListener(handler: { (data?: T): void }): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public dispatch(data?: T): void {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose() : ILiteEvent<T> {
        return this;
    }
}