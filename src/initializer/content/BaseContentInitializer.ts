export abstract class BaseContentInitializer<T> {
    constructor(options: T) {
        this.initializeOptions(options);
        this.initializeContent();
    }

    abstract initializeContent(): string;

    protected abstract initializeOptions(options: T): void;
}
