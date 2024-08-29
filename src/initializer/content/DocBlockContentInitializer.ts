import { ConfigurationManager } from 'State/ConfigurationManager';
import { BaseContentInitializer } from './BaseContentInitializer';
import * as vscode from 'vscode';

type MarkupWithArrowExclamationComment = 'xml' | 'html' | {};

export interface DocBlockInitializerOptions {
    fileFormat: MarkupWithArrowExclamationComment;
}

export class DocBlockContentInitializer extends BaseContentInitializer<DocBlockInitializerOptions> {
    baseDoc!: string;
    editedDoc!: string;
    fileFormat!: MarkupWithArrowExclamationComment;

    constructor(options: DocBlockInitializerOptions) {
        super(options);
    }

    initializeContent(): string {
        const editedContent = this.getDocBlockTemplate();
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

    getDocBlockTemplate(): string {
        if (!this.editedDoc) {
            const { vendor, module } = ConfigurationManager.getInstance();

            this.editedDoc = this.baseDoc.replace('@year', new Date().getFullYear().toString()).replace('@vendor', vendor).replace('@module', module);
        }

        return this.editedDoc;
    }

    setFileFormat(fileFormat: MarkupWithArrowExclamationComment): void {
        this.fileFormat = fileFormat;
    }

    protected initializeOptions(options: DocBlockInitializerOptions): void {
        const { fileFormat } = options;
        const { baseDoc } = ConfigurationManager.getInstance();

        this.fileFormat = fileFormat;
        this.baseDoc = baseDoc;
    }
}
