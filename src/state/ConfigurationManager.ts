import * as fs from 'fs';
import * as path from 'path';

export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private _vendor: string = '';
    private _module: string = '';
    private _className: string = '';
    private _namespace: string = '';
    private _parentClass: string | null = null;
    private _parentUseNamespace: string | null = null;
    private _diType: 'preference' | 'plugin' | null = null;
    private _pluginName: string | null = null;
    private _baseModuleName: string = '';
    private _baseModulePath: string = '';
    private _isModuleExists: boolean = false;
    private _baseDoc: string = '';

    private constructor() {}

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    public get vendor(): string {
        return this._vendor;
    }

    public set vendor(value: string) {
        this._vendor = value;
    }

    public get module(): string {
        return this._module;
    }

    public set module(value: string) {
        this._module = value;
    }

    public get className(): string {
        return this._className;
    }

    public set className(value: string) {
        this._className = value;
    }

    public get namespace(): string {
        return this._namespace;
    }

    public set namespace(value: string) {
        this._namespace = value;
    }

    public get parentClass(): string | null {
        return this._parentClass;
    }

    public set parentClass(value: string | null) {
        this._parentClass = value;
    }

    public get parentUseNamespace(): string | null {
        return this._parentUseNamespace;
    }

    public set parentUseNamespace(value: string | null) {
        this._parentUseNamespace = value;
    }

    public get diType(): 'preference' | 'plugin' | null {
        return this._diType;
    }

    public set diType(value: 'preference' | 'plugin' | null) {
        this._diType = value;
    }

    public get pluginName(): string | null {
        return this._pluginName;
    }

    public set pluginName(value: string | null) {
        this._pluginName = value;
    }

    public get baseModuleName(): string {
        return this._baseModuleName;
    }

    public set baseModuleName(value: string) {
        this._baseModuleName = value;
    }

    public get baseModulePath(): string {
        return this._baseModulePath;
    }

    public set baseModulePath(value: string) {
        this._baseModulePath = value;
    }

    public get isModuleExists(): boolean {
        return this._isModuleExists;
    }

    public set isModuleExists(value: boolean) {
        this._isModuleExists = value;
    }

    public get baseDoc(): string {
        return this._baseDoc;
    }

    public set baseDoc(value: string) {
        this._baseDoc = value;
    }

    public initializeOptionsByFilePath(filePath: string, parentPath: string | null = null): void {
        if (parentPath) {
            const { className: parentClassName, fullPath: fullPath } = this.initializeNamespaceAndClass(parentPath);

            this.parentClass = parentClassName;
            this.parentUseNamespace = fullPath;
        }

        const { className, namespace, vendor, module } = this.initializeNamespaceAndClass(filePath);

        this.className = className;
        this.namespace = namespace;
        this.vendor = vendor;
        this.module = module;

        const extractedPath = this.extractBaseModulePath(filePath);

        this.baseModuleName = extractedPath.join('_');
        this.baseModulePath = extractedPath.join('/');
        this.isModuleExists = fs.existsSync(path.join(...extractedPath));
    }

    private initializeNamespaceAndClass(filePath: string): { className: string, namespace: string, fullPath: string, vendor: string, module: string } {
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

        return { className, namespace: parts.join('\\'), fullPath: parsedPath, vendor: parts[0], module: `${parts[0]}\\${parts[1]}` };
    }

    private extractBaseModulePath(filePath: string): Array<string> {
        let splitPath = filePath.split('/');

        if (!splitPath.length || splitPath.length < 2) {
            splitPath = filePath.split('\\');
        }

        if (!splitPath.length) {
            throw new Error('Invalid file path');
        }

        return splitPath.slice(0, 2);
    }
}
