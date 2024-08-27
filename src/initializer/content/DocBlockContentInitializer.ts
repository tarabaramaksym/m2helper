import { BaseContentInitializer } from './BaseContentInitializer';
import * as vscode from 'vscode';

type MarkupWithArrowExclamationComment = 'xml' | 'html' | {};

export interface DocBlockInitializerOptions {
    fileFormat: MarkupWithArrowExclamationComment;
}

export class DocBlockContentInitializer extends BaseContentInitializer<DocBlockInitializerOptions> {
    baseDoc!: string;
    fileFormat!: MarkupWithArrowExclamationComment;

    constructor(options: DocBlockInitializerOptions) {
        super(options);
    }

    initializeContent(): string {
        const editedContent = this.baseDoc.replace('@year', new Date().getFullYear().toString());
        let content = '';

        switch (this.fileFormat) {
            case 'xml':
            case 'html':
                content = `<!--\n${editedContent}\n-->`;
                break;
            default:
                content = editedContent;
        }

        return content;
    }

    protected initializeOptions(options: DocBlockInitializerOptions): void {
        const { fileFormat } = options;

        this.fileFormat = fileFormat;
        this.baseDoc = vscode.workspace.getConfiguration().get('m2helper.docBlockTemplate', '/**\n * @year\n */');
    }
}
