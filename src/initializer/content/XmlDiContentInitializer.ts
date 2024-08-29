import { t4, t8 } from 'Util/string';
import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';
import { ConfigurationManager } from 'State/ConfigurationManager';

export interface XmlDiInitializerOptions {
}

export class XmlDiContentInitializer extends BaseContentInitializer<XmlDiInitializerOptions> {
    docBlockContentInitializer!: DocBlockContentInitializer | null;

    constructor(options: XmlDiInitializerOptions, docBlockContentInitializer: DocBlockContentInitializer | null = null) {
        super(options);

        this.docBlockContentInitializer = docBlockContentInitializer;
    }

    initializeContent(): string {
        if (this.docBlockContentInitializer) {
            this.docBlockContentInitializer.setFileFormat('xml');
        }

        const doc = (this.docBlockContentInitializer || new DocBlockContentInitializer({ fileFormat: 'xml' })).initializeContent();

        const contentByType = this.getContentByType();
        const contentLines = [
            '<?xml version="1.0"?>',
            ...doc.split('\n'),
            '<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">',
            ...contentByType,
            '</config>',
            ''
        ];

        return contentLines.join('\n');
    }

    private getContentByType(): Array<string> {
        const { className, namespace, parentUseNamespace, pluginName, diType } = ConfigurationManager.getInstance();

        if (diType === null) {
            throw new Error('Invalid DI type');
        }

        switch (diType) {
            case 'preference':
                return [
                    t4(`<preference for="${parentUseNamespace}" type="${namespace}\\${className}" />`),
                ];
            case 'plugin':
                return [
                    t4(`<type name="${parentUseNamespace}">`),
                    t8(`<plugin name="${pluginName}" type="${namespace}\\${className}" />`),
                    t4('</type>'),
                ];
        }
    }

    protected initializeOptions(options: XmlDiInitializerOptions): void {
    }
}
