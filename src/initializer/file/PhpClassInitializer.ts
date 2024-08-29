import { BaseFilesInitializer } from './BaseFilesInitializer';
import { ModuleInitializer } from './ModuleInitializer';
import { PhpClassContentInitializer } from 'InitializerContent/PhpClassContentInitializer';
import * as path from 'path';
import { ConfigurationManager } from 'State/ConfigurationManager';
import { XmlDiBuilder } from 'Builder/XmlDiBuilder';
import * as fs from 'fs';

export interface PhpClassInitializerOptions {
    parentPath: string | null
    diType: 'preference' | 'plugin' | null;
    pluginName: string | null;
}

export class PhpClassInitializer extends BaseFilesInitializer<PhpClassInitializerOptions> {
    initializeFiles(): void {
        const { baseModulePath, parentClass, diType } = ConfigurationManager.getInstance();

        const diPath = path.join(this.rootPath, baseModulePath, 'etc', 'di.xml');
        const isDiFileExists = fs.existsSync(diPath);

        const moduleInitializer = new ModuleInitializer(this.rootPath, this.filePath, {});
        moduleInitializer.initializeFiles();

        const phpClassContent = new PhpClassContentInitializer({});

        const { namespace, className } = ConfigurationManager.getInstance();

        this.createFile(
            phpClassContent.initializeContent(),
            path.join(this.rootPath, ...namespace.split('\\'), `${className}.php`)
        );

        if (isDiFileExists && parentClass) {
            this.updateDiXml(diPath, diType);
        }
    }

    private updateDiXml(diPath: string, diType: 'preference' | 'plugin' | null): void {
        const xmlDiBuilder = new XmlDiBuilder();

        switch (diType) {
            case 'preference':
                xmlDiBuilder.addPreference();
                break;
            case 'plugin':
                xmlDiBuilder.addPlugin();
                break;
        }

        this.createFile(
            xmlDiBuilder.toString(),
            diPath
        );
    }

    protected initializeOptions(options: PhpClassInitializerOptions): void {
        const { parentPath, diType, pluginName } = options;
        const configurationManager = ConfigurationManager.getInstance();

        configurationManager.initializeOptionsByFilePath(this.filePath, parentPath);
        configurationManager.diType = diType;
        configurationManager.pluginName = pluginName;
    }
}
