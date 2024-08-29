import { t4, t8, t12} from 'Util/string';
import { BaseContentInitializer } from './BaseContentInitializer';
import { DocBlockContentInitializer } from './DocBlockContentInitializer';
import { ConfigurationManager } from 'State/ConfigurationManager';

export interface XmlModuleInitializerOptions {
    baseModuleName: string;
}

export class XmlModuleContentInitializer extends BaseContentInitializer<XmlModuleInitializerOptions> {
    baseModuleName!: string;
    docBlockContentInitializer!: DocBlockContentInitializer | null;

    constructor(options: XmlModuleInitializerOptions, docBlockContentInitializer: DocBlockContentInitializer | null = null) {
        super(options);

        this.docBlockContentInitializer = docBlockContentInitializer;
    }

    initializeContent(): string {
        if (this.docBlockContentInitializer) {
            this.docBlockContentInitializer.setFileFormat('xml');
        }

        const doc = (this.docBlockContentInitializer || new DocBlockContentInitializer({ fileFormat: 'xml' })).initializeContent();
        const { parentUseNamespace } = ConfigurationManager.getInstance();
        const parentsModuleName = parentUseNamespace?.split('\\').slice(0, 2).join('_');

        const contentLines = [
            '<?xml version="1.0"?>',
            ...doc.split('\n'),
            '<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">',
            t4(`<module name="${this.baseModuleName}">`),
            ...(parentUseNamespace ? [
                t8('<sequence>'),
                t12(`<module name="${parentsModuleName}" />`),
                t8('</sequence>'),
            ] : []),
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
