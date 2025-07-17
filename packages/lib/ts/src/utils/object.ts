type ValueMapper<T, U, K> = (value: T, key: K) => U;

function mapValues<T, U, K extends string>(
  obj: Record<K, T>,
  mapper: ValueMapper<T, U, K>
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = mapper(obj[key], key);
    }
  }
  return result;
}

type FilterValues<T, V> = {
  [P in keyof T as T[P] extends V ? P : never]: T[P];
};

function filterValuesWithKnownKeys<T extends object, V extends T[keyof T]>(
  obj: T,
  predicate: (value: T[keyof T]) => value is V
): FilterValues<T, V> {
  const result = {} as FilterValues<T, V>;

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (predicate(value)) {
        (result as T)[key] = value;
      }
    }
  }
  return result as FilterValues<T, V>;
}

function filterValuesWithGenericKeys<T extends object, V extends T[keyof T]>(
  obj: T,
  predicate: (value: T[keyof T]) => value is V
): Record<keyof T, V> {
  const result = {} as Record<keyof T, V>;

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (predicate(value)) {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Filters out null and undefined values from an object. Does not work on nested
 * fields.
 * @param obj The object to filter.
 * @returns The filtered object.
 */
function removeNullAndUndefined<T extends Record<string, any>>(
  obj: T
): { [K in keyof T]: Exclude<T[K], null | undefined> } {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value != null && value !== undefined
    )
  ) as any;
}

/**
 * Filters out undefined values from an object. Will not filter out null values.
 * @param obj The object to filter.
 * @returns The filtered object.
 */
function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as any;
}

function hasValue<T extends object>(obj: T, value: any): boolean {
  return Object.values(obj).includes(value);
}

function hasKey<T extends object>(obj: T, value: any): boolean {
  return Object.keys(obj).includes(value);
}

export {
  mapValues,
  filterValuesWithKnownKeys,
  filterValuesWithGenericKeys,
  removeNullAndUndefined,
  removeUndefined,
  hasValue,
  hasKey,
};
