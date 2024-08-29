import { BaseProcessor } from './BaseProcessor';

interface PhpClassContentStatusProperties {
    namespace: number,
    useNamespaceStart: number,
    useNamespaceEnd: number,
    constructorStart: number,
    constructorEnd: number,
    constructorDocStart: number,
    constructorDocEnd: number,
    constructorArgStart: number,
    classStart: number,
}

export class PhpClassProcessor extends BaseProcessor {
    classProperties!: Array<string>;
    useNamespaces!: Array<string>;
    constructDocArgProperties!: Array<string>;
    constructArgProperties!: Array<string>;
    constructBodyProperties!: Array<string>;
    classContentStatusProperties!: PhpClassContentStatusProperties;

    constructor(filePath = '') {
        super(filePath);

        this.initializeProperties();
    }

    initializeProperties() {
        this.classContentStatusProperties = this.initializeClassContentStatusProperties();
        this.classProperties = this.initializeClassProperties();
        this.constructDocArgProperties = this.initializeConstructDocArgProperties();
        this.constructArgProperties = this.initializeConstructArgProperties();
        this.constructBodyProperties = this.initializeConstructBodyProperties();
        this.useNamespaces = this.initializeUseNamespaces();
        this.savePropertiesToFile();   
    }

    savePropertiesToFile() {
        const properties = {
            classContentStatusProperties: this.classContentStatusProperties,
            classProperties: this.classProperties,
            useNamespaces: this.useNamespaces,
            constructDocArgProperties: this.constructDocArgProperties,
            constructArgProperties: this.constructArgProperties,
            constructBodyProperties: this.constructBodyProperties
        };
        const fs = require('fs');
        const vscode = require('vscode');
        const path = require('path');
        const outputPath = path.join(vscode.workspace.rootPath, 'processor_properties_beforechanges.json');
        fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2));
    }

    validateContent(): boolean {
        if (this.filePath.indexOf('.php') === -1) {
            throw new Error('This is not a PHP file');
        }

        if (!this.content) {
            throw new Error('File is empty');
        }

        if (this.content.indexOf('<?php') === -1 || this.content.indexOf('class') === -1) {
            throw new Error('Not a valid php class file');
        }

        return true;
    }

    private initializeClassContentStatusProperties() {
        const { contentLines } = this;

        let namespace = -1,
            useNamespaceStart = -1,
            useNamespaceEnd = -1,
            constructorStart = -1,
            constructorEnd = -1,
            constructorDocStart = -1,
            constructorDocEnd = -1,
            classStart = -1,
            constructorArgStart = -1;

        for (let i = 0; i < contentLines.length; i++) {
            const element = contentLines[i];

            if (namespace === -1 && element.indexOf('namespace') !== -1) {
                namespace = i;
                continue;
            }

            if (classStart === -1 && element.indexOf('use') !== -1) {
                if (useNamespaceStart === -1) {
                    useNamespaceStart = i;
                }

                useNamespaceEnd = i;
                continue;
            }

            if (classStart === -1 && element.indexOf('class') !== -1) {
                classStart = i;
                continue;
            }

            if (element.indexOf('__construct') !== -1) {
                if (contentLines[i - 1].indexOf('*') !== -1) {
                    constructorDocEnd = i - 1;
                    let j = i - 1;

                    while (contentLines[j].indexOf('*') !== -1) {
                        j--;
                    }

                    constructorDocStart = j + 1;
                }

                constructorStart = i;
                let j = i - 1;

                while (contentLines[j].indexOf('}') === -1) {
                    j++;
                }

                constructorEnd = j;
            }
        }

        if (classStart === -1 || namespace === -1) {
            throw Error('Incorrect file format');
        }

        return {
            namespace,
            useNamespaceStart,
            useNamespaceEnd,
            constructorStart,
            constructorEnd,
            constructorDocStart,
            constructorDocEnd,
            classStart,
            constructorArgStart
        };
    }

    private initializeClassProperties() {
        const {
            constructorStart,
            constructorDocStart,
            classStart
        } = this.classContentStatusProperties;
        const propertiesEnd = constructorDocStart === - 1 ? constructorStart : constructorDocStart;

        if (propertiesEnd === -1 || propertiesEnd === classStart + 2) {
            return [];
        }

        return this.contentLines.slice(classStart + 2, propertiesEnd);
    }

    private initializeConstructDocArgProperties() {
        const {
            constructorDocStart,
            constructorDocEnd
        } = this.classContentStatusProperties;

        if (constructorDocStart === -1 || constructorDocEnd === -1) {
            return [];
        }

        return this.contentLines.slice(constructorDocStart + 1, constructorDocEnd);
    }

    private initializeConstructArgProperties() {
        const {
            constructorStart,
        } = this.classContentStatusProperties;

        if (constructorStart === -1) {
            return [];
        }

        let constructorArgStart = constructorStart + 1;

        while (this.contentLines[constructorArgStart].indexOf(')') === -1) {
            constructorArgStart++;
        }

        return this.contentLines.slice(constructorStart + 1, constructorArgStart);
    }

    private initializeConstructBodyProperties() {
        const {
            constructorStart
        } = this.classContentStatusProperties;

        if (constructorStart === -1) {
            return [];
        }

        let constructBodyEnd = constructorStart;
        let constructBodyStart = constructorStart;

        while (this.contentLines[constructBodyEnd].indexOf('}') === -1) {
            if (this.contentLines[constructBodyEnd].indexOf('{') !== -1) {
                constructBodyStart = constructBodyEnd + 1;
            }

            constructBodyEnd++;
        }

        return this.contentLines.slice(constructBodyStart, constructBodyEnd);
    }

    private initializeUseNamespaces() {
        const {
            useNamespaceStart,
            useNamespaceEnd
        } = this.classContentStatusProperties;

        if (useNamespaceStart === -1) {
            return [];
        }

        return this.contentLines.slice(useNamespaceStart, useNamespaceEnd + 1);
    }
}
