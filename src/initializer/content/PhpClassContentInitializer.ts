import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';

export interface DocBlockInitializerOptions {
    namespace: string;
    className: string;
    parentClass: string | null;
    parentUseNamespace: string | null;
}

export class PhpClassContentInitializer extends BaseContentInitializer<DocBlockInitializerOptions> {
    namespace!: string;
    className!: string;
    parentClass!: string | null;
    parentUseNamespace!: string | null;

    initializeContent(): string {
        const doc = new DocBlockContentInitializer({ fileFormat: 'php' }).initializeContent();

        const contentLines = [
            '<?php',
            ...doc.split('\n'),
            '',
            'declare(strict_types=1);',
            '',
            `namespace ${this.namespace};`,
            ...(this.parentUseNamespace ? [
                '',
                `use ${this.parentUseNamespace};`
            ] : []),
            '',
            `class ${this.className}${this.parentClass ? ` extends ${this.parentClass}` : ''} {`,
            '}',
            ''
        ];

        return contentLines.join('\n');
    }

    protected initializeOptions(options: DocBlockInitializerOptions): void {
        const { namespace, className, parentClass, parentUseNamespace } = options;

        this.namespace = namespace;
        this.className = className;
        this.parentClass = parentClass;
        this.parentUseNamespace = parentUseNamespace;
    }
}
