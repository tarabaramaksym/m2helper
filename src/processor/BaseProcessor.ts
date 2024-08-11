import * as vscode from 'vscode';
import * as fs from 'fs';

export abstract class BaseProcessor {
    content: string;
    contentLines: Array<string>;
    filePath: string;

    constructor(filePath = '') {
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
        if (!this.filePath) {
            const {
                document: {
                    uri: {
                        fsPath = ''
                    } = {}
                } = {}
            } = vscode.window.activeTextEditor || {};

            if (!fsPath) {
                throw new Error('Open file first');
            }

            this.filePath = fsPath;
        }

        this.setContent(fs.readFileSync(this.filePath).toString());
    };

    /**
     * Validates file info, should throw exception if validation fails
     */
    abstract validateContent(): void;
}
