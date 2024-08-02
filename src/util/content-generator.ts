import * as vscode from 'vscode';
import { MODULE, PHP_INTRO, REGISTRATION, XML_INTRO } from 'constant/content';
import { PathArguments } from 'type/paths.type';
import { CREATE_INHERITED_CLASS } from 'constant/choice';

function prepareIntro(intro: string, packageName: string) {
    return intro.replace('<Package>', packageName);
}

function getPhpIntro(packageName: string) {
    return prepareIntro(PHP_INTRO, packageName);
}

function getXmlIntro(packageName: string) {
    return prepareIntro(XML_INTRO, packageName);
}

export async function generateClassPHP({ className, namespace, packageName }: PathArguments, choice: string): Promise<string | undefined> {
    let phpClassContent = getPhpIntro(packageName);
    phpClassContent += `\nnamespace ${namespace};\n`;

    if (choice === CREATE_INHERITED_CLASS) {
        const parentClass = await vscode.window.showInputBox({ prompt: 'Enter the parent class with namespace' });

        if (!parentClass) {
            vscode.window.showErrorMessage('Parent class cannot be empty.');
            return undefined;
        }

        const parts = parentClass.split('\\');
        const classPseudonym = `${parts[0]}${parts[parts.length - 1]}`;
        phpClassContent += `\nuse ${parentClass} as ${classPseudonym};\n`;
        phpClassContent += `\nclass ${className} extends ${classPseudonym}`;
    } else {
        phpClassContent += `\nclass ${className}`;
    }

    phpClassContent += ` {\n    // Your code here\n}`;

    return phpClassContent;
}

export function generateModuleXML(packageName: string) : string {
    return `${getXmlIntro(packageName)}${MODULE.replace('<Package>', packageName.replace('\\', '_'))}`;
}

export function generateRegistrationPHP(packageName: string) : string {
    return `${getPhpIntro(packageName)}\n${REGISTRATION.replace('<Package>', packageName.replace('\\', '_'))}`;
}

export function generateDiXML(modulePath: string, parentNamespace: string) {
    
}


