import { BaseFilesInitializer } from './BaseFilesInitializer';
import * as fs from 'fs';
import * as path from 'path';
import { XmlModuleContentInitializer } from 'InitializerContent/XmlModuleContentInitializer';
import { PhpRegistrationContentInitializer } from 'InitializerContent/PhpRegistrationContentInitializer';
import { ConfigurationManager } from 'State/ConfigurationManager';
import { XmlDiContentInitializer } from 'Initializer/content/XmlDiContentInitializer';

export interface ModuleInitializerOptions {
}

export class ModuleInitializer extends BaseFilesInitializer<ModuleInitializerOptions> {
    initializeFiles(): void {
        const { isModuleExists, baseModulePath, baseModuleName } = ConfigurationManager.getInstance();

        if (isModuleExists) {
            this.createDiXmlIfNeeded();

            return;
        }

        this.createFile(
            new XmlModuleContentInitializer({ baseModuleName }).initializeContent(),
            path.join(this.rootPath, baseModulePath, 'etc', 'module.xml')
        );

        this.createFile(
            new PhpRegistrationContentInitializer({ baseModuleName }).initializeContent(),
            path.join(this.rootPath, baseModulePath, 'registration.php')
        );

        this.createDiXmlIfNeeded();
    }

    private createDiXmlIfNeeded(): void {
        const { parentUseNamespace, diType, baseModulePath } = ConfigurationManager.getInstance();
        const diPath = path.join(this.rootPath, baseModulePath, 'etc', 'di.xml');

        if (!parentUseNamespace || fs.existsSync(diPath)) {
            return;
        }

        this.createFile(
            new XmlDiContentInitializer({ type: diType || 'preference' }).initializeContent(),
            diPath
        );
    }

    protected initializeOptions(options: ModuleInitializerOptions): void {
    }
}
