import { BaseProcessor } from './BaseProcessor';

interface PhpClassContentStatusProperties {
}

export class XmlDiProcessor extends BaseProcessor {
    validateContent(): boolean {
        if (this.filePath.indexOf('.xml') === -1) {
            throw new Error('This is not a XML file');
        }

        if (!this.content) {
            throw new Error('File is empty');
        }

        return true;
    }
}
