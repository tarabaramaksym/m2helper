import { assertEqual } from "../util";
import * as path from 'path';
import * as fs from 'fs';
import { PhpClassBuilder } from '../../builder/PhpClassBuilder';

let allTestsPassed = true;

// Test 1: SimpleClass.php - Check classContentStatusProperties
{
    const filePath = path.join(__dirname, '..', 'test-cases', 'php', 'BuilderClass.php');
    const processor = new PhpClassBuilder(filePath);

    processor.addProperty(`Byggmax\\Category\\Collector\\Provider`);
    processor.addProperty(`Byggmax\\Category\\Helper\\Processor`);

    const outputFile = path.join(__dirname, '..', 'test-cases-output', 'php', 'BuilderClass.php');
    fs.writeFileSync(outputFile, processor.toString());

    console.log('\n\nRunning Test: SimpleClass.php - Check classContentStatusProperties');
}

// Summary of test results
if (allTestsPassed) {
    console.log('All tests passed!');
} else {
    console.error('Some tests failed. Please check the output above.');
}
