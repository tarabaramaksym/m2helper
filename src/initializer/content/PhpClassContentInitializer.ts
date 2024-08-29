import { ConfigurationManager } from 'State/ConfigurationManager';
import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';

export interface DocBlockInitializerOptions {
}

export class PhpClassContentInitializer extends BaseContentInitializer<DocBlockInitializerOptions> {
    initializeContent(): string {
        const doc = new DocBlockContentInitializer({ fileFormat: 'php' }).initializeContent();

        const { namespace, className, parentClass, parentUseNamespace, diType } = ConfigurationManager.getInstance();

        let parentsVendor = '';
        const isInheritance = parentClass !== '' && diType === 'preference';

        if (isInheritance) {
            parentsVendor = parentUseNamespace?.trim().replace('/', '\\') || '';
            parentsVendor = parentsVendor.split('\\')[0];
        }

        const contentLines = [
            '<?php',
            ...doc.split('\n'),
            '',
            'declare(strict_types=1);',
            '',
            `namespace ${namespace};`,
            ...(isInheritance ? [
                '',
                `use ${parentUseNamespace} as ${parentsVendor}${parentClass};`
            ] : []),
            '',
            `class ${className}${isInheritance ? ` extends ${parentsVendor}${parentClass}` : ''}`,
            '{',
            '}',
            ''
        ];

        return contentLines.join('\n');
    }

    protected initializeOptions(options: DocBlockInitializerOptions): void {
    }
}
