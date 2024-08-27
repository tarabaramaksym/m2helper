import { BaseFilesInitializer } from './BaseFilesInitializer';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { XmlModuleContentInitializer } from 'InitializerContent/XmlModuleContentInitializer';
import { PhpRegistrationContentInitializer } from 'InitializerContent/PhpRegistrationContentInitializer';

export interface ModuleInitializerOptions {
}

export class ModuleInitializer extends BaseFilesInitializer<ModuleInitializerOptions> {
    baseModulePath!: string;
    baseModuleName!: string;
    isModuleExists!: boolean;

    initializeFiles(): void {
        if (this.isModuleExists) {
            return;
        }

        this.createFile(
            new XmlModuleContentInitializer({ baseModuleName: this.baseModuleName }).initializeContent(),
            path.join(this.rootPath, this.baseModulePath, 'etc', 'module.xml')
        );

        this.createFile(
            new PhpRegistrationContentInitializer({ baseModuleName: this.baseModuleName }).initializeContent(),
            path.join(this.rootPath, this.baseModulePath, 'registration.php')
        );
    }

    protected initializeOptions(options: ModuleInitializerOptions): void {
        const extractedPath = this.extractBaseModulePath();
        this.baseModuleName = extractedPath.join('_');
        this.baseModulePath = extractedPath.join('/');

        this.isModuleExists = fs.existsSync(path.join(...extractedPath));
    }

    private extractBaseModulePath(): Array<string> {
        let splitPath = this.filePath.split('/');

        if (!splitPath.length || splitPath.length < 2) {
            splitPath = this.filePath.split('\\');
        }

        if (!splitPath.length) {
            throw new Error('Invalid file path');
        }

        return splitPath.slice(0, 2);
    }
}
