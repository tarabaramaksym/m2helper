import { PhpClassProcessor } from "Processor/PhpClassProcessor";
import { BaseBuilder } from "./BaseBuilder";
import { XmlDiProcessor } from "Processor/XmlDiProcessor";
import { ConfigurationManager } from "State/ConfigurationManager";
import { t4, t8 } from "Util/string";

export class XmlDiBuilder extends BaseBuilder {
    processor: XmlDiProcessor;

    constructor(filePath = '') {
        super();

        this.processor = this.initProcessor(filePath);
    }

    initProcessor(filePath: string): XmlDiProcessor {
        return new XmlDiProcessor(filePath);
    }

    addPreference() {
        const { className, namespace, parentUseNamespace } = ConfigurationManager.getInstance();
        const newPreference = t4(`<preference for="${parentUseNamespace}" type="${namespace}\\${className}" />`);

        const lastPreferenceIndex = this.findLastIndex(this.processor.contentLines, '<preference');

        if (lastPreferenceIndex !== -1) {
            this.processor.contentLines.splice(lastPreferenceIndex + 1, 0, newPreference);
        } else {
            this.addBeforeConfigOrEnd(newPreference);
        }
    }

    addPlugin() {
        const { className, namespace, pluginName, parentUseNamespace } = ConfigurationManager.getInstance();

        const newPlugin = [
            t4(`<type name="${parentUseNamespace}">`),
            t8(`<plugin name="${pluginName}" type="${namespace}\\${className}" />`),
            t4('</type>')
        ].join('\n');

        const lastPluginIndex = this.findLastIndex(this.processor.contentLines, '<plugin');

        if (lastPluginIndex !== -1) {
            this.processor.contentLines.splice(lastPluginIndex + 1, 0, newPlugin);
        } else {
            this.addBeforeConfigOrEnd(newPlugin);
        }
    }

    private addBeforeConfigOrEnd(content: string) {
        const { contentLines } = this.processor;

        if (contentLines[contentLines.length - 1].trim() === '') {
            // If the last line is empty, add before the last two elements
            contentLines.splice(contentLines.length - 2, 0, content);
        } else {
            // If the last line is not empty (assuming it's </config>), add before the last element
            contentLines.splice(contentLines.length - 1, 0, content);
        }
    }

    private findLastIndex(array: string[], searchString: string): number {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i].includes(searchString)) {
                if (array[i + 1] && array[i + 1].includes('/>')) {
                    return i + 1;
                }

                return i;
            }
        }

        return -1;
    }

    toString(): string {
        const {
            contentLines,
        } = this.processor;

        return contentLines.join('\n');
    }
}
