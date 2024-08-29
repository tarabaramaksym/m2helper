import { PhpClassProcessor } from '../processor/PhpClassProcessor';

enum HighlightColor {
    ConstructDocArg = '#8B0000',  // Dark Red
    ConstructArg = '#006400',     // Dark Green
    ConstructBody = '#00008B',    // Dark Blue
    ClassProperty = '#4B0082',    // Indigo
    UseNamespace = '#8B4513',     // Saddle Brown
    Default = '',                 // White
}

export class PhpClassHighlighter {
    private processor: PhpClassProcessor;

    constructor(filePath: string) {
        this.processor = new PhpClassProcessor(filePath);
    }

    highlightCode(): string[] {
        const { contentLines } = this.processor;
        const highlightedLines: string[] = [];

        for (let i = 0; i < contentLines.length; i++) {
            const color = this.getHighlightColor(i);
            highlightedLines.push(this.wrapLineWithColor(contentLines[i], color));
        }

        return ['<pre>', ...highlightedLines, '</pre>'];
    }

    private getHighlightColor(lineIndex: number): HighlightColor {
        const {
            constructDocArgProperties,
            constructArgProperties,
            constructBodyProperties,
            classProperties,
            useNamespaces,
            classContentStatusProperties,
        } = this.processor;

        if (this.isLineInRange(lineIndex, classContentStatusProperties.constructorDocStart, classContentStatusProperties.constructorDocEnd)) {
            return HighlightColor.ConstructDocArg;
        }

        if (this.isLineInRange(lineIndex, classContentStatusProperties.constructorStart, classContentStatusProperties.constructorEnd - 1)) {
            return HighlightColor.ConstructBody;
        }

        if (this.isLineInRange(lineIndex, classContentStatusProperties.classStart + 2, classContentStatusProperties.constructorDocStart - 1)) {
            return HighlightColor.ClassProperty;
        }

        if (this.isLineInRange(lineIndex, classContentStatusProperties.useNamespaceStart, classContentStatusProperties.useNamespaceEnd)) {
            return HighlightColor.UseNamespace;
        }

        return HighlightColor.Default;
    }

    private isLineInRange(lineIndex: number, start: number, end: number): boolean {
        return lineIndex >= start && lineIndex <= end;
    }

    private wrapLineWithColor(line: string, color: HighlightColor): string {
        if (!color) {
            return `<span>${line}</span>`;
        }
        return `<span style="background-color: ${color}">${line}</span>`;
    }
}
