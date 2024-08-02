import * as vscode from 'vscode';
import * as path from 'path';
import { InheritedClassChoiceArguments, PathArguments } from 'type/paths.type';

export function parsePath(inputPath: string, inheritedChoice: InheritedClassChoiceArguments | null): PathArguments & Partial<InheritedClassChoiceArguments> {
    const appCodePath = path.join(vscode.workspace.rootPath || '', 'app', 'code', inputPath);
    const parts = inputPath.split('\\');
    const className = parts[parts.length - 1];
    const namespace = parts.slice(0, -1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('\\');
    const packageSplit = namespace.split('\\');
    const packageName = `${packageSplit[0]}\\${packageSplit[1]}`;

    return Object.assign({ className, namespace, appCodePath, packageName }, inheritedChoice || {});
}
