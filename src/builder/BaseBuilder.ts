import { BaseProcessor } from "Processor/BaseProcessor";

export abstract class BaseBuilder {
    abstract toString(): string;

    abstract initProcessor(filePath: string): BaseProcessor;
}
