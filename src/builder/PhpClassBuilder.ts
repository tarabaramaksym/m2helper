import { PhpClassProcessor } from "Processor/PhpClassProcessor";
import { BaseBuilder } from "./BaseBuilder";
import { t4, t5, t8 } from "Util/string";

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
        // vv handle pseudonym
        const propertyClass = splitNamespace.length > 1 ? splitNamespace[2] : namespace.substring(namespace.lastIndexOf('\\') + 1);
        const propertyName = `${propertyClass[0].toLowerCase()}${propertyClass.substring(1).replace('Interface', '')}`;

        const { classProperties, useNamespaces } = this.processor;

        useNamespaces.push(`use ${namespace};`);

        let useDocBlockInsteadOfType = null;

        // vv check if any properties use doc block/it's mixed/no properties use it
        classProperties.some((cl, i) => {
            if (cl && cl.indexOf('*') !== -1) {
                useDocBlockInsteadOfType = false;
            }

            if (cl && cl.indexOf('*') === -1 && (!classProperties[i - 1] || classProperties[i - 1].indexOf('*') === -1)) {
                useDocBlockInsteadOfType = true;
                return true;
            }

            return false;
        });

        if (useDocBlockInsteadOfType === false) {
            classProperties.push(t4('/**'));
            classProperties.push(t5(`* @var ${propertyClass}`));
            classProperties.push(t5('*/'));
            classProperties.push(t4(`protected $${propertyName};`));
        } else {
            classProperties.push(t4(`protected ${propertyClass} $${propertyName};`));
        }

        this.addPropertyToConstructor(propertyClass, propertyName);
    }

    private addPropertyToConstructor(propertyClass: string, propertyName: string) {
        const {
            constructDocArgProperties,
            constructDocArgProperties: {
                length: docArgLength
            },
            constructArgProperties,
            constructArgProperties: {
                length: argLength
            },
            constructBodyProperties
        } = this.processor;
        const classAndProperty = `${propertyClass} $${propertyName}`;

        let argPosition = argLength;
        let docArgPosition = docArgLength;
        let firstDefaultProperty = '';

        // vv handle constructor arguments with default value, since we need to keep them at the end
        constructArgProperties.some((arg, i) => {
            if (arg.indexOf('=') !== -1) {
                argPosition = i;
                firstDefaultProperty = arg.trim().split(' ')[1];

                return true;
            }

            return false;
        });

        if (firstDefaultProperty) {
            constructDocArgProperties.some((arg, i) => {
                if (arg.indexOf(firstDefaultProperty) !== -1) {
                    docArgPosition = i;
                    return true;
                }

                return false;
            });
        }

        // vv add coma to the constrcutor argument
        if (argLength && argPosition === argLength && !constructArgProperties[argLength - 1].endsWith(',')) {
            constructArgProperties[argLength - 1] = `${constructArgProperties[argLength - 1]},`;
        }

        constructArgProperties.splice(argPosition, 0, t8(`${classAndProperty},`));
        constructDocArgProperties.splice(docArgPosition, 0, t5(`* @param ${classAndProperty}`));
        constructBodyProperties.push(t8(`$this->${propertyName} = $${propertyName};`));
    }

    toString(): string {
        const {
            contentLines,
            classProperties,
            constructDocArgProperties,
            constructArgProperties,
            constructBodyProperties,
            useNamespaces,
            classContentStatusProperties: {
                useNamespaceStart,
                useNamespaceEnd,
                namespace,
                classStart,
                constructorStart,
                constructorDocStart,
                constructorEnd
            }
        } = this.processor;

        const contentBeforeUseNamespaces = contentLines.slice(0, useNamespaceStart !== -1 ? useNamespaceStart : namespace + 1);

        const hasConstructor = constructorStart !== -1;
        const constructorStartIndex = hasConstructor ? constructorDocStart || constructorStart : classStart + 2;

        const contentAfterUseNamespacesStart = (useNamespaceEnd === -1 ? namespace : useNamespaceEnd) + 1;
        const contentAfterUseNamespaces = contentLines.slice(contentAfterUseNamespacesStart, classStart + 1);
        const contentAfterProperties = contentLines.slice(hasConstructor ? constructorEnd + 1 : constructorStartIndex);

        return [
            ...contentBeforeUseNamespaces,
            ...useNamespaces,
            ...contentAfterUseNamespaces,
            '{',
            ...classProperties,
            '',
            t4('/**'),
            ...constructDocArgProperties,
            t5('*/'),
            t4('public function __construct('),
            ...constructArgProperties,
            t4(') {'),
            ...constructBodyProperties,
            t4('}'),
            ...contentAfterProperties,
        ].join('\n');

    }
}
