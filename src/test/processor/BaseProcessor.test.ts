import { assertEqual } from "../util";
import * as path from 'path';
import { PhpClassProcessor } from '../../processor/PhpClassProcessor';

let allTestsPassed = true;

// Test 1: SimpleClass.php - Check classContentStatusProperties
{
    const filePath = path.join(__dirname, '..', 'test-cases', 'php', 'SimpleClass.php');
    const processor = new PhpClassProcessor(filePath);

    const properties = processor.classContentStatusProperties;

    console.log('\n\nRunning Test: SimpleClass.php - Check classContentStatusProperties');
    allTestsPassed = assertEqual(properties.namespace, 2, 'Namespace') && allTestsPassed;
    allTestsPassed = assertEqual(properties.useNamespaceStart, 4, 'UseNamespaceStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorStart, 7, 'ConstructorStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorEnd, 9, 'ConstructorEnd') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocStart, -1, 'ConstructorDocStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocEnd, -1, 'ConstructorDocEnd') && allTestsPassed;
}

// Test 2: NoConstructor.php - Check classContentStatusProperties
{
    const filePath = path.join(__dirname, '..', 'test-cases', 'php', 'NoConstructor.php');

    console.log(filePath, 'test');
    const processor = new PhpClassProcessor(filePath);

    const properties = processor.classContentStatusProperties;

    console.log('\n\nRunning Test: NoConstructor.php - Check classContentStatusProperties');
    allTestsPassed = assertEqual(properties.namespace, 2, 'Namespace') && allTestsPassed;
    allTestsPassed = assertEqual(properties.useNamespaceStart, 4, 'UseNamespaceStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorStart, -1, 'ConstructorStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorEnd, -1, 'ConstructorEnd') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocStart, -1, 'ConstructorDocStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocEnd, -1, 'ConstructorDocEnd') && allTestsPassed;
}

// Test 3: ComplexClass.php - Check classContentStatusProperties
{
    const filePath = path.join(__dirname, '..', 'test-cases', 'php', 'ComplexClass.php');
    const processor = new PhpClassProcessor(filePath);

    const properties = processor.classContentStatusProperties;

    console.log('\n\nRunning Test: ComplexClass.php - Check classContentStatusProperties');
    allTestsPassed = assertEqual(properties.namespace, 2, 'Namespace') && allTestsPassed;
    allTestsPassed = assertEqual(properties.useNamespaceStart, 4, 'UseNamespaceStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorStart, 16, 'ConstructorStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorEnd, 19, 'ConstructorEnd') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocStart, 13, 'ConstructorDocStart') && allTestsPassed;
    allTestsPassed = assertEqual(properties.constructorDocEnd, 15, 'ConstructorDocEnd') && allTestsPassed;

    console.log(processor.useNamespaces);
    console.log(processor.classProperties);
}

// Summary of test results
if (allTestsPassed) {
    console.log('All tests passed!');
} else {
    console.error('Some tests failed. Please check the output above.');
}
