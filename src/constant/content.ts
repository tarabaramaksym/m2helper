export const DOC = `/**
 * @category    Byggmax
 * @package     <Package>
 * @author      Maksym Tarabara <info@scandiweb.com>
 * @copyright   Copyright (c) ${new Date().getFullYear()} Scandiweb, Inc (https://scandiweb.com)
 * @license     http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */`;

export const PHP_INTRO = `<?php
${DOC}

declare(strict_types=1);
`;

export const REGISTRATION = `use Magento\\Framework\\Component\\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    '<Package>',
    __DIR__
);
`;

export const XML_INTRO = `<?xml version="1.0"?>
<!--
${DOC}
-->
`;

export const MODULE = `<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="<Package>">
    </module>
</config>
`;
