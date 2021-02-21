// Passing types through Expand<T> makes TS expand them instead of lazily
// evaluating the type. This also has the benefit that intersections are merged
// to show as one object.
type Primitive = string | number | boolean | bigint | symbol | null | undefined;
export type Expand<T> = T extends Primitive ? T : { [K in keyof T]: T[K] };

type OptionalKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
}[keyof T];

type RequiredKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T] &
    keyof T;

type RequiredMergeKeys<T, U> = RequiredKeys<T> & RequiredKeys<U>;

type OptionalMergeKeys<T, U> =
    | OptionalKeys<T>
    | OptionalKeys<U>
    | Exclude<RequiredKeys<T>, RequiredKeys<U>>
    | Exclude<RequiredKeys<U>, RequiredKeys<T>>;

type MergeNonUnionObjects<T, U> = Expand<
    {
        [K in RequiredMergeKeys<T, U>]: Expand<Merge<T[K], U[K]>>;
    } & {
        [K in OptionalMergeKeys<T, U>]?: K extends keyof T
            ? K extends keyof U
                ? Expand<Merge<
                    Exclude<T[K], undefined>,
                    Exclude<U[K], undefined>
                >>
                : T[K]
            : K extends keyof U
            ? U[K]
            : never;
    }
>;

type MergeObjects<T, U> = [T] extends [never]
    ? U extends any
        ? MergeNonUnionObjects<T, U>
        : never
    : [U] extends [never]
    ? T extends any
        ? MergeNonUnionObjects<T, U>
        : never
    : T extends any
    ? U extends any
        ? MergeNonUnionObjects<T, U>
        : never
    : never;

export type Merge<T, U> =
    | Extract<T | U, Primitive>
    | MergeObjects<Exclude<T, Primitive>, Exclude<U, Primitive>>;