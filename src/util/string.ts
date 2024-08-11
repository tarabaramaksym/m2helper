export function lastIndexOf(string: string, search: RegExp) {
    let lastIndex;
    let match;

    while ((match = search.exec(string)) !== null) {
        lastIndex = match;
    }

    return lastIndex;
}

export function findIndexOfStrInArray(arr: Array<string>, str: string, start = 0): number | undefined {
    for (let i = start; i < arr.length; i++) {
        const index = arr[i].indexOf(str);

        if (index !== -1) {
            return i;
        }
    }
}

export function findLastIndexOfStrInArray(arr: Array<string>, str: string): number | undefined {
    for (let i = arr.length - 1; i >= 0; i--) {
        const index = arr[i].indexOf(str);

        if (index !== -1) {
            return i;
        }
    }
}
