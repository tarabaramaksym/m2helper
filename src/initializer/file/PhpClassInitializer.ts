import { BaseFilesInitializer } from './BaseFilesInitializer';
import { ModuleInitializer } from './ModuleInitializer';
import { PhpClassContentInitializer } from 'InitializerContent/PhpClassContentInitializer';
import * as vscode from 'vscode';
import * as path from 'path';

export interface PhpClassInitializerOptions {
    parentPath: string | null
}

export class PhpClassInitializer extends BaseFilesInitializer<PhpClassInitializerOptions> {
    namespace!: string;
    className!: string;
    parentClass!: string | null;
    parentUseNamespace!: string | null;

    initializeFiles(): void {
        const moduleInitializer = new ModuleInitializer(this.rootPath, this.filePath, {});
        moduleInitializer.initializeFiles();

        const phpClassContent = new PhpClassContentInitializer({
            namespace: this.namespace,
            className: this.className,
            parentClass: this.parentClass,
            parentUseNamespace: this.parentUseNamespace
        });

        this.createFile(
            phpClassContent.initializeContent(),
            path.join(this.rootPath, ...this.namespace.split('\\'), `${this.className}.php`)
        );
    }

    protected initializeOptions(options: PhpClassInitializerOptions): void {
        const { parentPath } = options;

        if (parentPath) {
            const { className: parentClassName, fullPath: fullPath } = this.initializeNamespaceAndClass(parentPath);

            this.parentClass = parentClassName;
            this.parentUseNamespace = fullPath;
        }

        const { className, namespace } = this.initializeNamespaceAndClass(this.filePath);

        this.className = className;
        this.namespace = namespace;
    }

    private initializeNamespaceAndClass(filePath: string): { className: string, namespace: string, fullPath: string } {
        let parsedPath = filePath.trim().replace(/\//g, '\\');
        parsedPath = parsedPath.replace(/\.php$/, '');
        const splitBySpace = parsedPath.split(' ');
        const parts = splitBySpace[0].split('\\');
        let className = '';

        if (splitBySpace.length > 1) {
            className = splitBySpace[2];
        } else {
            className = parts.pop() || '';
        }

        return { className, namespace: parts.join('\\'), fullPath: parsedPath };
    }
}
