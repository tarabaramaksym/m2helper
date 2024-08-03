import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ADD_PROPERTY_TO_CLASS, CREATE_INHERITED_CLASS, CREATE_NEW_CLASS } from "constant/choice";
import { createFile } from 'util/file';
import { generateClassPHP, generateDiXML, generateModuleXML, generateProperty, generateRegistrationPHP } from 'util/content-generator';
import { parsePath } from 'util/parsers';
import { InheritedClassChoiceArguments } from 'type/paths.type';
import { CLASS_PROPERTIES } from 'constant/classes';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createPHPClass', handleCommand());

    context.subscriptions.push(disposable);
}

function handleCommand(): (...args: any[]) => any {
    return async () => {
        const choice = await showChoice();

        if (!choice) {
            return;
        }

        if (choice === ADD_PROPERTY_TO_CLASS) {
            await handleAddPropertyChoice();
            return;
        }

        const inputPath = await getInputPath();

        if (!inputPath) {
            return;
        }

        const inheritedChoice = await handleInheritedChoice(choice);
        const parsedPath = parsePath(inputPath, inheritedChoice);
        const { className, appCodePath, packageName, parentClass = '', parentPackage = '' } = parsedPath;
        const phpClassContent = await generateClassPHP(parsedPath, choice);

        if (!phpClassContent) {
            return;
        }

        const dirPath: string[] = appCodePath.split('\\');

        if (!dirPath || !dirPath.length || dirPath.length < 2) {
            return;
        }

        dirPath.pop();

        const modulePath = [dirPath[0], dirPath[1]].join('/');

        if (!fs.existsSync(modulePath)) {
            generateModule(modulePath, packageName, parentPackage);
        }

        if (choice === CREATE_INHERITED_CLASS) {
            generateDi(modulePath, packageName, inputPath, parentClass);
        }

        const filePath = path.join(dirPath.join('/'), `${className}.php`);

        createFile(filePath, phpClassContent);

        vscode.window.showInformationMessage(`PHP class ${className}.php created at ${filePath}`);
    };
}

async function handleAddPropertyChoice() {
    const choice = await vscode.window.showQuickPick(Object.keys(CLASS_PROPERTIES), {
        placeHolder: 'Choose an option'
    });

    if (!choice) {
        vscode.window.showErrorMessage('Property was not selected');
        return;
    }

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const document = editor.document;
    const filePath = document.uri.fsPath;

    if (!filePath) {
        vscode.window.showErrorMessage('File is not opened');
        return;
    }

    const contents = generateProperty(filePath, choice);

    fs.writeFileSync(filePath, contents);
}

async function showChoice(): Promise<string | undefined> {
    return vscode.window.showQuickPick([CREATE_NEW_CLASS, CREATE_INHERITED_CLASS, ADD_PROPERTY_TO_CLASS], {
        placeHolder: 'Choose an option'
    });
}

async function getInputPath(): Promise<string | undefined> {
    const inputPath = await vscode.window.showInputBox({ prompt: 'Enter the path (relative to app/code)' });

    if (!inputPath) {
        vscode.window.showErrorMessage('Path cannot be empty.');
    }

    return inputPath;
}

async function handleInheritedChoice(choice: string): Promise<InheritedClassChoiceArguments | null> {
    if (choice !== CREATE_INHERITED_CLASS) {
        return null;
    }

    const parentClass = await vscode.window.showInputBox({ prompt: 'Enter the parent class with namespace' });

    if (!parentClass) {
        vscode.window.showErrorMessage('Parent class cannot be empty.');
        return null;
    }

    const parts = parentClass.split('\\');
    const classPseudonym = `${parts[0]}${parts[parts.length - 1]}`;
    const parentPackage = `${parts[0]}\\${parts[1]}`;


    return {
        parentClass,
        classPseudonym,
        parentPackage
    };
}

function generateModule(modulePath: string, packageName: string, parentPackage: string = '') {
    const registration = generateRegistrationPHP(packageName);
    const module = generateModuleXML(packageName, parentPackage);

    createFile(`${modulePath}/registration.php`, registration);
    createFile(`${modulePath}/etc/module.xml`, module);
}

function generateDi(modulePath: string, packageName: string, classWithNamespace: string, parentClassWithNamespace: string) {
    const diXmlPath = path.join(modulePath, 'etc', 'di.xml');
    const diXml = generateDiXML(packageName, diXmlPath, classWithNamespace, parentClassWithNamespace);

    createFile(`${modulePath}/etc/di.xml`, diXml);
}

export function deactivate() { }
