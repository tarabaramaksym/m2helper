import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';
import { t4 } from 'Util/string';

export interface PhpRegistrationInitializerOptions {
    baseModuleName: string;
}

export class PhpRegistrationContentInitializer extends BaseContentInitializer<PhpRegistrationInitializerOptions> {
    baseModuleName!: string;
    docBlockContentInitializer!: DocBlockContentInitializer | null;

    constructor(options: PhpRegistrationInitializerOptions, docBlockContentInitializer: DocBlockContentInitializer | null = null) {
        super(options);

        this.docBlockContentInitializer = docBlockContentInitializer;
    }

    initializeContent(): string {
        if (this.docBlockContentInitializer) {
            this.docBlockContentInitializer.setFileFormat('php');
        }

        const doc = (this.docBlockContentInitializer || new DocBlockContentInitializer({ fileFormat: 'php' })).initializeContent();

        const contentLines = [
            '<?php',
            ...doc.split('\n'),
            '',
            'declare(strict_types=1);',
            '',
            'use Magento\\Framework\\Component\\ComponentRegistrar;',
            '',
            'ComponentRegistrar::register(',
            t4('ComponentRegistrar::MODULE,'),
            t4(`'${this.baseModuleName}',`),
            t4('__DIR__'),
            ');',
            '',
        ];

        return contentLines.join('\n');
    }

    protected initializeOptions(options: PhpRegistrationInitializerOptions): void {
        const { baseModuleName } = options;

        this.baseModuleName = baseModuleName;
    }
}
