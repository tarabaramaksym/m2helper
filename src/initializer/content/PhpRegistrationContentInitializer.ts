import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';
import { t4 } from 'Util/string';

export interface DocBlockInitializerOptions {
    baseModuleName: string;
}

export class PhpRegistrationContentInitializer extends BaseContentInitializer<DocBlockInitializerOptions> {
    baseDoc!: string;
    baseModuleName!: string;

    initializeContent(): string {
        const doc = new DocBlockContentInitializer({ fileFormat: 'php' }).initializeContent();

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

    protected initializeOptions(options: DocBlockInitializerOptions): void {
        const { baseModuleName } = options;

        this.baseModuleName = baseModuleName;
    }
}
