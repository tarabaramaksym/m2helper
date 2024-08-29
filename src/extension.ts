import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ADD_PROPERTY_TO_CLASS, CREATE_INHERITED_CLASS, CREATE_NEW_CLASS, CREATE_PLUGIN_CLASS, INPUT_CUSTOM_PROPERTY_NAMESPACE } from "constant/choice";
import { ConfigurationManager } from 'State/ConfigurationManager';
import { CLASS_PROPERTIES } from 'constant/classes';
import { PhpClassBuilder } from 'Builder/PhpClassBuilder';
import { PhpClassInitializer } from 'InitializerFile/PhpClassInitializer';
import { PhpClassHighlighter } from './highlighter/PhpClassHighlighter';

export function activate(context: vscode.ExtensionContext) {
    let createPHPClassDisposable = vscode.commands.registerCommand('extension.createPHPClass', handleCreatePHPClassCommand());
    let highlightPhpClassDisposable = vscode.commands.registerCommand('extension.highlightPhpClass', handleHighlightPhpClassCommand());

    context.subscriptions.push(createPHPClassDisposable, highlightPhpClassDisposable);
}

function handleCreatePHPClassCommand(): (...args: any[]) => any {
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

        const parentPath = await handleInheritedChoice(choice);
        const pluginName = await handlePluginChoice(choice);

        const coreFolder = vscode.workspace.getConfiguration().get('m2helper.coreFolder', 'app/code');
        const baseVsCodePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
        const rootPath = path.join(baseVsCodePath, coreFolder);

        const configurationManager = ConfigurationManager.getInstance();
        configurationManager.baseDoc = vscode.workspace.getConfiguration().get('m2helper.docBlockTemplate', '/**\n * @year\n */');

        try {
            const phpClassInitializer = new PhpClassInitializer(rootPath, inputPath, { parentPath, diType: choice === CREATE_PLUGIN_CLASS ? 'plugin' : 'preference', pluginName });
            phpClassInitializer.initializeFiles();
        } catch (error: any) {
            vscode.window.showErrorMessage(error);
        }
    };
}

function handleHighlightPhpClassCommand(): (...args: any[]) => any {
    return () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'php') {
            vscode.window.showErrorMessage('This is not a PHP file');
            return;
        }

        const filePath = document.uri.fsPath;
        const highlighter = new PhpClassHighlighter(filePath);

        try {
            const highlightedLines = highlighter.highlightCode();
            const content = highlightedLines.join('\n');

            // Create a new untitled document with the highlighted content
            vscode.workspace.openTextDocument({ content, language: 'html' }).then(doc => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
            });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to highlight PHP class: ${error.message}`);
        }
    };
}

async function handleAddPropertyChoice() {
    const choice = await vscode.window.showQuickPick([INPUT_CUSTOM_PROPERTY_NAMESPACE, ...Object.keys(CLASS_PROPERTIES)], {
        placeHolder: 'Choose an option'
    });

    if (!choice) {
        vscode.window.showErrorMessage('Property was not selected');
        return;
    }

    let choiceData = null;

    if (choice === INPUT_CUSTOM_PROPERTY_NAMESPACE) {
        choiceData = await vscode.window.showInputBox({ prompt: 'Enter class with the namespace (you can write "as Pseudonym" at the end)' });

        if (!choiceData) {
            vscode.window.showErrorMessage('Namespace was not inputted');
            return;
        }

        choiceData = choiceData.trim();
    } else {
        choiceData = CLASS_PROPERTIES[choice];
    }

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const filePath = editor.document.uri.fsPath;

    if (!filePath) {
        vscode.window.showErrorMessage('File is not opened');
        return;
    }

    const builder = new PhpClassBuilder(filePath);
    builder.addProperty(choiceData);

    fs.writeFileSync(filePath, builder.toString());
}

async function showChoice(): Promise<string | undefined> {
    return vscode.window.showQuickPick([CREATE_NEW_CLASS, CREATE_INHERITED_CLASS, CREATE_PLUGIN_CLASS, ADD_PROPERTY_TO_CLASS], {
        placeHolder: 'Choose an option'
    });
}

async function getInputPath(): Promise<string | undefined> {
    const inputPath = await vscode.window.showInputBox({ prompt: 'Enter the class with namespace' });

    if (!inputPath) {
        vscode.window.showErrorMessage('Path cannot be empty.');
    }

    return inputPath;
}

async function handleInheritedChoice(choice: string): Promise<string | null> {
    if (choice !== CREATE_INHERITED_CLASS && choice !== CREATE_PLUGIN_CLASS) {
        return null;
    }

    const parentClass = await vscode.window.showInputBox({ prompt: 'Enter the parent class with namespace' });

    if (!parentClass) {
        throw new Error('Parent class cannot be empty.');
    }

    return parentClass;
}

async function handlePluginChoice(choice: string): Promise<string | null> {
    if (choice !== CREATE_PLUGIN_CLASS) {
        return null;
    }

    const pluginName = await vscode.window.showInputBox({ prompt: 'Enter the plugin name' });

    if (!pluginName) {
        throw new Error('Plugin name cannot be empty.');
    }

    return pluginName;
}

export function deactivate() { }
