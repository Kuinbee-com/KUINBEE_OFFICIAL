type DotNestedKeys<T, Prefix extends string = ""> = {
    [K in keyof T & string]: NonNullable<T[K]> extends object
    ? NonNullable<T[K]> extends Array<any>
    ? `${Prefix}${K}`
    : `${Prefix}${K}` | DotNestedKeys<NonNullable<T[K]>, `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

type ProjectionArray<T> = readonly DotNestedKeys<T>[];

type DeepSelect = {
    [key: string]: true | DeepSelect;
};

function convertProjectionArrayToSelect(paths: string[]): DeepSelect {
    const select: DeepSelect = {};

    for (const path of paths) {
        const keys = path.split(".");
        let current = select;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isLast = i === keys.length - 1;

            if (isLast) {
                current[key] = true;
            } else {
                // If not already wrapped, wrap in `select`
                if (!current[key]) {
                    current[key] = { select: {} };
                } else if (typeof current[key] === "object" && current[key] !== null && !("select" in current[key]!)) {
                    current[key] = { select: current[key] };
                }

                current = (current[key] as { select: DeepSelect }).select;
            }
        }
    }

    return select;
}

export const applyBigIntJsonSerializer = () => {
    if (!(BigInt.prototype as any).toJSON) {
        (BigInt.prototype as any).toJSON = function () {
            return this.toString();
        };
    }
};

export const createProjectionSelect = <T>() => <A extends readonly string[]>(array: A & ProjectionArray<T>): DeepSelect => convertProjectionArrayToSelect(array as unknown as string[]);

