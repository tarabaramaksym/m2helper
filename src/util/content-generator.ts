import * as vscode from 'vscode';
import * as fs from 'fs';
import { BASE_CONSTRUCTOR, DI, MODULE, PARAM_DOC_BLOCK, PHP_INTRO, PREFERENCE, REGISTRATION, SEQUENCE, XML_INTRO } from 'constant/content';
import { InheritedClassChoiceArguments, PathArguments } from 'type/paths.type';
import { CREATE_INHERITED_CLASS } from 'constant/choice';
import { lastIndexOf } from './string';
import { CLASS_PROPERTIES } from 'constant/classes';

function prepareIntro(intro: string, packageName: string) {
    return intro.replace('<Package>', packageName);
}

function getPhpIntro(packageName: string) {
    return prepareIntro(PHP_INTRO, packageName);
}

function getXmlIntro(packageName: string) {
    return prepareIntro(XML_INTRO, packageName);
}

export async function generateClassPHP({ className, namespace, packageName, classPseudonym, parentClass }: PathArguments & Partial<InheritedClassChoiceArguments>, choice: string): Promise<string | undefined> {
    let phpClassContent = getPhpIntro(packageName);
    phpClassContent += `\nnamespace ${namespace};\n`;

    if (choice === CREATE_INHERITED_CLASS) {
        phpClassContent += `\nuse ${parentClass} as ${classPseudonym};\n`;
        phpClassContent += `\nclass ${className} extends ${classPseudonym}`;
    } else {
        phpClassContent += `\nclass ${className}`;
    }

    phpClassContent += `\n{\n    // Your code here\n}\n`;

    return phpClassContent;
}

export function generateModuleXML(packageName: string, parentPackage?: string): string {
    let moduleXml = MODULE;
    vscode.window.showErrorMessage(`${parentPackage} for ${packageName}`);

    if (parentPackage) {
        moduleXml = moduleXml.replace('<ParentPackage>', parentPackage.replace('\\', '_'));
    } else {
        moduleXml = moduleXml.replace(SEQUENCE, '');
    }

    return `${getXmlIntro(packageName)}${moduleXml.replace('<Package>', packageName.replace('\\', '_'))}`;
}

export function generateDiXML(packageName: string, diXmlPath: string, classWithNamespace: string, parentClassWithNamespace: string) {
    let diXmlContent = '';

    if (!fs.existsSync(diXmlPath)) {
        return `${getXmlIntro(packageName)}${DI.replace('<ParentClass>', parentClassWithNamespace).replace('<Class>', classWithNamespace)}`;
    }

    diXmlContent = fs.readFileSync(diXmlPath).toString();

    const newPreference = PREFERENCE.replace('<ParentClass>', parentClassWithNamespace).replace('<Class>', classWithNamespace);
    const lastPreferenceMatch = lastIndexOf(diXmlContent, /<preference[\s\S]*?\/>|<preference[\s\S]*?<\/preference>/g);

    if (lastPreferenceMatch) {
        const insertionPoint = lastPreferenceMatch.index + lastPreferenceMatch[0].length;
        diXmlContent = diXmlContent.slice(0, insertionPoint) + '\n    ' + newPreference + diXmlContent.slice(insertionPoint);
    } else {
        const closingConfigIndex = diXmlContent.lastIndexOf('</config>');
        diXmlContent = diXmlContent.slice(0, closingConfigIndex) + '\n    ' + newPreference + '\n' + diXmlContent.slice(closingConfigIndex);
    }

    return diXmlContent;
}

export function generateRegistrationPHP(packageName: string): string {
    return `${getPhpIntro(packageName)}\n${REGISTRATION.replace('<Package>', packageName.replace('\\', '_'))}`;
}

// TODO! Refactor this shit
export function generateProperty(filePath: string, choice: string): string {
    let fileContents = fs.readFileSync(filePath).toString();
    const indexOfLastUse = lastIndexOf(fileContents, /use\s+.*?;\s*/g);
    const lastUseMatch = indexOfLastUse ?? lastIndexOf(fileContents, /namespace\s+.*?;\s*/g);
    const { namespace, className } = CLASS_PROPERTIES[choice];

    if (!lastUseMatch) {
        return fileContents;
    }

    const insertionPoint = lastUseMatch.index + lastUseMatch[0].length - 1;
    fileContents = fileContents.slice(0, insertionPoint) + `${indexOfLastUse ? '' : '\n'}use ${namespace};\n` + fileContents.slice(insertionPoint);

    const constructorPattern = /(?:\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s*)?public function __construct/g;;
    const match = fileContents.match(constructorPattern);
    const property = `${className[0].toLowerCase()}${className.slice(1)}`.replace('Interface', '');
    const newProperty = `protected ${className} $${property};\n`;

    if (match) {
        const insertPosition = fileContents.lastIndexOf(match[0]);

        if (insertPosition === -1) {
            return fileContents;
        }

        const beforeConstructor = fileContents.slice(0, insertPosition);
        const afterConstructor = fileContents.slice(insertPosition);

        fileContents = beforeConstructor + newProperty + '\n    ' + afterConstructor;

        const parameter = `${className} $${property},\n`;
        const propertyInit = `    $this->${property} = $${property};`;

        const constructorParamsPattern = /public\s+function\s+__construct\s*\(([\s\S]*?)\)/;
        const constructorParamsMatch = fileContents.match(constructorParamsPattern);

        const constructorBodyPattern = /public\s+function\s+__construct\s*\([\s\S]*?\)\s*\{([\s\S]*?)\}/;
        const constructorBodyMatch = fileContents.match(constructorBodyPattern);

        if (constructorParamsMatch && constructorBodyMatch) {
            const newParams = `    ${constructorParamsMatch[1]}    ${parameter}`;
            const newBody = `    ${constructorBodyMatch[1].trim()}\n    ${propertyInit}`;

            fileContents = fileContents.replace(constructorBodyPattern, `public function __construct(${newParams}    ) {\n    ${newBody}\n    }`);

            const docBlockPattern = /\/\*\*[\s\S]*?\*\/\n\s*public\s+function\s+__construct/;
            const docBlockMatch = fileContents.match(docBlockPattern);

            if (docBlockMatch) {
                const lastParamIndex = docBlockMatch[0].lastIndexOf('@param');
                const afterLastParamIndex = docBlockMatch[0].indexOf('\n', lastParamIndex) + 1;
                const beforeParam = docBlockMatch[0].slice(0, afterLastParamIndex);
                const afterParam = docBlockMatch[0].slice(afterLastParamIndex);

                const newDocBlock = beforeParam + `     * @param ${className} $${property}\n` + afterParam;
                fileContents = fileContents.replace(docBlockMatch[0], newDocBlock);
            } else {
                const constructorIndex = fileContents.indexOf('public function __construct');
                const newDocBlock = `/**\n    * @param ${className} $${property}\n    */\n    `;
                fileContents = fileContents.slice(0, constructorIndex) + newDocBlock + fileContents.slice(constructorIndex);
            }
        }
    } else {
        const classOpeningPattern = /class\s+\w+(\s+extends\s+\w+)?(\s+implements\s+\w+(,\s*\w+)*)?\s*\{/g;
        const match = fileContents.match(classOpeningPattern);

        if (!match) {
            vscode.window.showErrorMessage('Wrong path');
            return fileContents;
        }

        const insertPosition = fileContents.indexOf(match[0]) + match[0].length;

        if (!insertPosition) {
            vscode.window.showErrorMessage(`${insertPosition}`);
            return fileContents;
        }

        if (insertPosition !== -1) {
            const beforeOpening = fileContents.slice(0, insertPosition);
            const afterOpening = fileContents.slice(insertPosition);
            const constructor = `\n    ${newProperty}${BASE_CONSTRUCTOR.replace(/<Property>/g, property).replace(/<Class>/g, className)}`;

            fileContents = beforeOpening + constructor + afterOpening;
        }
    }

    return fileContents;
}
