export function lastIndexOf(string: string, search: RegExp) {
    let lastIndex;
    let match;

    while ((match = search.exec(string)) !== null) {
        lastIndex = match;
    }

    return lastIndex;
}
