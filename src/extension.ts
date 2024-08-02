import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CREATE_INHERITED_CLASS, CREATE_NEW_CLASS } from "constant/choice";
import { createFile } from 'util/file';
import { generateClassPHP, generateModuleXML, generateRegistrationPHP } from 'util/content-generator';
import { parsePath } from 'util/parsers';

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

        const inputPath = await getInputPath();

        if (!inputPath) {
            return;
        }

        const parsedPath = parsePath(inputPath);
        const { className, appCodePath, packageName } = parsedPath;
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
            generateModule(modulePath, packageName);
        }

        const filePath = path.join(dirPath.join('/'), `${className}.php`);

        createFile(filePath, phpClassContent);

        vscode.window.showInformationMessage(`PHP class ${className}.php created at ${filePath}`);
    };
}

async function showChoice(): Promise<string | undefined> {
    return vscode.window.showQuickPick([CREATE_NEW_CLASS, CREATE_INHERITED_CLASS], {
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

function generateModule(modulePath: string, packageName: string) {
    const registration = generateRegistrationPHP(packageName);
    const module = generateModuleXML(packageName);

    createFile(`${modulePath}/registration.php`, registration);
    createFile(`${modulePath}/etc/module.xml`, module);
}

export function deactivate() { }
