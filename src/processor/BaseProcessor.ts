import * as fs from 'fs';

export abstract class BaseProcessor {
    content: string;
    contentLines: Array<string>;
    filePath: string;

    constructor(filePath: string) {
        this.content = '';
        this.contentLines = [];
        this.filePath = filePath;

        this.initializeContent();
        this.validateContent();
    }

    setContent(content: string) {
        this.content = content;
        this.contentLines = this.content.split('\n');
    }

    private initializeContent() {
        this.setContent(fs.readFileSync(this.filePath).toString());
    };

    /**
     * Validates file info, should throw exception if validation fails
     */
    abstract validateContent(): void;
}
