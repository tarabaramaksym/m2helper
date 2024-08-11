
export function assertEqual(actual: any, expected: any, message: string) {
    if (actual !== expected) {
        console.error(`❌ ${message} - Expected: ${expected}, but got: ${actual}`);
        return false;
    }
    console.log(`✅ ${message}`);
    return true;
}
