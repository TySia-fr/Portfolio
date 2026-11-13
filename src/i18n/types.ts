/**
 * The French content modules are `as const`, so their types are literal
 * strings. An English module must have the same structure, not the same words:
 * Widen keeps the shape (keys, nesting, nullability) and turns every literal
 * into its base type. A missing or misspelt key in English fails type-checking.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null | undefined
        ? T
        : T extends readonly (infer U)[]
          ? readonly Widen<U>[]
          : { readonly [K in keyof T]: Widen<T[K]> };
