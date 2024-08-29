export const PRODUCT_COLLECTION_NAMESPACE = 'Magento\\Catalog\\Model\\ResourceModel\\Product\\CollectionFactory as ProductCollectionFactory';
export const PRODUCT_REPOSITORY_NAMESPACE = 'Magento\\Catalog\\Api\\ProductRepositoryInterface';
export const CATEGORY_COLLECTION_NAMESPACE = 'Magento\\Catalog\\Model\\ResourceModel\\Category\\CollectionFactory as CategoryCollectionFactory';
export const CATEGORY_REPOSITORY_NAMESPACE = 'Magento\\Catalog\\Api\\CategoryRepositoryInterface';
export const ORDER_COLLECTION_NAMESPACE = 'Magento\\Sales\\Model\\ResourceModel\\Order\\CollectionFactory as OrderCollectionFactory';
export const ORDER_REPOSITORY_NAMESPACE = 'Magento\\Sales\\Api\\OrderRepositoryInterface';
export const CART_COLLECTION_NAMESPACE = 'Magento\\Quote\\Model\\ResourceModel\\Quote\\CollectionFactory as CartCollectionFactory';
export const CART_REPOSITORY_NAMESPACE = 'Magento\\Quote\\Api\\CartRepositoryInterface';
export const STORE_MANAGER_NAMESPACE = 'Magento\\Store\\Model\\StoreManagerInterface';
export const CONFIG_READER_NAMESPACE = 'Magento\\Framework\\App\\Config\\ScopeConfigInterface';

export const CLASS_PROPERTIES: { [key: string]: string } = {
    'Product Collection': PRODUCT_COLLECTION_NAMESPACE,
    'Product Repository': PRODUCT_REPOSITORY_NAMESPACE,
    'Category Collection': CATEGORY_COLLECTION_NAMESPACE,
    'Category Repository': CATEGORY_REPOSITORY_NAMESPACE,
    'Order Collection': ORDER_COLLECTION_NAMESPACE,
    'Order Repository': ORDER_REPOSITORY_NAMESPACE,
    'Cart Collection': CART_COLLECTION_NAMESPACE,
    'Cart Repository': CART_REPOSITORY_NAMESPACE,
    'Store Manager': STORE_MANAGER_NAMESPACE,
    'Scope Config': CONFIG_READER_NAMESPACE
};
