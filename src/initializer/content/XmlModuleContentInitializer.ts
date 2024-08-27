import { t4 } from 'Util/string';
import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';

export interface XmlModuleInitializerOptions {
    baseModuleName: string;
}

export class XmlModuleContentInitializer extends BaseContentInitializer<XmlModuleInitializerOptions> {
    baseModuleName!: string;

    initializeContent(): string {
        const doc = new DocBlockContentInitializer({ fileFormat: 'xml' }).initializeContent();

        const contentLines = [
            '<?xml version="1.0"?>',
            ...doc.split('\n'),
            '<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">',
            t4(`<module name="${this.baseModuleName}">`),
            t4('</module>'),
            '</config>',
            ''
        ];

        return contentLines.join('\n');
    }

    protected initializeOptions(options: XmlModuleInitializerOptions): void {
        const { baseModuleName } = options;

        this.baseModuleName = baseModuleName;
    }
}
