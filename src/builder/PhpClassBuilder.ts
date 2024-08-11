import { PhpClassProcessor } from "Processor/PhpClassProcessor";
import { BaseBuilder } from "./BaseBuilder";

export class PhpClassBuilder extends BaseBuilder {
    processor: PhpClassProcessor;

    constructor(filePath = '') {
        super();

        this.processor = this.initProcessor(filePath);
    }

    initProcessor(filePath: string): PhpClassProcessor {
        return new PhpClassProcessor(filePath);
    }

    addProperty(namespace: string) {
        const splitNamespace = namespace.trim().split(' ');
        const propertyClass = splitNamespace.length > 1 ? splitNamespace[2] : namespace.substring(namespace.lastIndexOf('\\') + 1);
        const propertyName = `${propertyClass[0].toLowerCase()}${propertyClass.substring(1).replace('Interface', '')}`;

        const { classProperties, useNamespaces } = this.processor;

        classProperties.push(`protected ${propertyClass} $${propertyName};`);
        useNamespaces.push(`use ${namespace};`);

        this.addPropertyToConstructor(propertyClass, propertyName);
    }

    private addPropertyToConstructor(propertyClass: string, propertyName: string) {

    }

    toString(): string {
        const {
            contentLines,
            classProperties,
            useNamespaces,
            classContentStatusProperties: {
                useNamespaceStart,
                useNamespaceEnd,
                namespace,
                classStart,
                constructorStart,
                constructorDocStart,
            }
        } = this.processor;

        const contentBeforeUseNamespaces = contentLines.slice(0, useNamespaceStart !== -1 ? useNamespaceStart : namespace + 1);

        const hasConstructor = constructorStart !== -1;
        const constructorStartIndex = hasConstructor ? constructorDocStart || constructorStart : classStart + 2;

        const contentAfterUseNamespacesStart = (useNamespaceEnd === -1 ? namespace : useNamespaceEnd) + 1;
        const contentAfterUseNamespaces = contentLines.slice(contentAfterUseNamespacesStart, classStart + 2);
        // change vv
        const contentAfterProperties = contentLines.slice(constructorStartIndex);

        return [
            ...contentBeforeUseNamespaces,
            ...useNamespaces,
            ...contentAfterUseNamespaces,
            ...classProperties,
            ...contentAfterProperties
        ].join('\n');
    }
}
