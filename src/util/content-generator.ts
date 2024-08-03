import * as vscode from 'vscode';
import * as fs from 'fs';
import { DI, MODULE, PHP_INTRO, PREFERENCE, REGISTRATION, SEQUENCE, XML_INTRO } from 'constant/content';
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

export function generateProperty(filePath: string, choice: string): string {
    let fileContents = fs.readFileSync(filePath).toString();
    const lastUseMatch = lastIndexOf(fileContents, /use\s+.*?;\s*/g);
    const { namespace, className } = CLASS_PROPERTIES[choice];

    if (!lastUseMatch) {
        return fileContents;
    }

    const insertionPoint = lastUseMatch.index + lastUseMatch[0].length - 1;
    fileContents = fileContents.slice(0, insertionPoint) + `use ${namespace};\n` + fileContents.slice(insertionPoint);

    const constructorPattern = /\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s+public function __construct/g;
    const match = fileContents.match(constructorPattern);

    if (match) {
        const insertPosition = fileContents.lastIndexOf(match[0]);
        if (insertPosition !== -1) {
            const beforeConstructor = fileContents.slice(0, insertPosition);
            const afterConstructor = fileContents.slice(insertPosition);

            const newProperty = `protected ${className} $${className[0].toLowerCase()}${className.slice(1)};\n\n    `;
            fileContents = beforeConstructor + newProperty + afterConstructor;
        }
    }

    return fileContents;
}
