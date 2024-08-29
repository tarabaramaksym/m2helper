import * as fs from 'fs';
import * as path from 'path';

export abstract class BaseFilesInitializer<T> {
    filePath: string;
    rootPath: string;

    constructor(rootPath: string, filePath: string, options: T) {
        this.filePath = filePath;
        this.rootPath = rootPath;

        this.initializeOptions(options);
    }

    createFile(content: string, filePath: string): void {
        if (fs.existsSync(filePath)) {
            return;
        }

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    }

    abstract initializeFiles(): void;

    protected abstract initializeOptions(options: T): void;
}
