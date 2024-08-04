export const PRODUCT_COLLECTION_CLASSNAME = 'ProductCollectionFactory';
export const PRODUCT_COLLECTION_NAMESPACE = `Magento\\Catalog\\Model\\ResourceModel\\Product\\CollectionFactory as ${PRODUCT_COLLECTION_CLASSNAME}`;

export const PRODUCT_REPOSITORY_CLASSNAME = 'ProductRepositoryInterface';
export const PRODUCT_REPOSITORY_NAMESPACE = 'Magento\\Catalog\\Api\\ProductRepositoryInterface';

export const CATEGORY_COLLECTION_CLASSNAME = 'CategoryCollectionFactory';
export const CATEGORY_COLLECTION_NAMESPACE = `Magento\\Catalog\\Model\\ResourceModel\\Category\\CollectionFactory as ${CATEGORY_COLLECTION_CLASSNAME}`;

export const CATEGORY_REPOSITORY_CLASSNAME = 'CategoryRepositoryInterface';
export const CATEGORY_REPOSITORY_NAMESPACE = 'Magento\\Catalog\\Api\\CategoryRepositoryInterface';

export const ORDER_COLLECTION_CLASSNAME = 'OrderCollectionFactory';
export const ORDER_COLLECTION_NAMESPACE = `Magento\\Sales\\Model\\ResourceModel\\Order\\CollectionFactory as ${ORDER_COLLECTION_CLASSNAME}`;

export const ORDER_REPOSITORY_CLASSNAME = 'OrderRepositoryInterface';
export const ORDER_REPOSITORY_NAMESPACE = 'Magento\\Sales\\Api\\OrderRepositoryInterface';

export const CART_COLLECTION_CLASSNAME = 'CartCollectionFactory';
export const CART_COLLECTION_NAMESPACE = `Magento\\Quote\\Model\\ResourceModel\\Quote\\CollectionFactory as ${CART_COLLECTION_CLASSNAME}`;

export const CART_REPOSITORY_CLASSNAME = 'CartRepositoryInterface';
export const CART_REPOSITORY_NAMESPACE = 'Magento\\Quote\\Api\\CartRepositoryInterface';

export const STORE_MANAGER_CLASSNAME = 'StoreManagerInterface';
export const STORE_MANAGER_NAMESPACE = 'Magento\\Store\\Model\\StoreManagerInterface';

export const CONFIG_READER_CLASSNAME = 'ScopeConfigInterface';
export const CONFIG_READER_NAMESPACE = 'Magento\\Framework\\App\\Config\\ScopeConfigInterface';


export const CLASS_PROPERTIES: { [key: string]: { className: string, namespace: string } } = {
    'Product Collection': {
        className: PRODUCT_COLLECTION_CLASSNAME,
        namespace: PRODUCT_COLLECTION_NAMESPACE
    },
    'Product Repository': {
        className: PRODUCT_REPOSITORY_CLASSNAME,
        namespace: PRODUCT_REPOSITORY_NAMESPACE
    },
    'Category Collection': {
        className: CATEGORY_COLLECTION_CLASSNAME,
        namespace: CATEGORY_COLLECTION_NAMESPACE
    },
    'Category Repository': {
        className: CATEGORY_REPOSITORY_CLASSNAME,
        namespace: CATEGORY_REPOSITORY_NAMESPACE
    },
    'Order Collection': {
        className: ORDER_COLLECTION_CLASSNAME,
        namespace: ORDER_COLLECTION_NAMESPACE
    },
    'Order Repository': {
        className: ORDER_REPOSITORY_CLASSNAME,
        namespace: ORDER_REPOSITORY_NAMESPACE
    },
    'Cart Collection': {
        className: CART_COLLECTION_CLASSNAME,
        namespace: CART_COLLECTION_NAMESPACE
    },
    'Cart Repository': {
        className: CART_REPOSITORY_CLASSNAME,
        namespace: CART_REPOSITORY_NAMESPACE
    },
    'Store Manager': {
        className: STORE_MANAGER_CLASSNAME,
        namespace: STORE_MANAGER_NAMESPACE
    },
    'Scope Config': {
        className: CONFIG_READER_CLASSNAME,
        namespace: CONFIG_READER_NAMESPACE
    }
};

