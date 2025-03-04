type NonSymbolKeys<T> = keyof {
  [P in keyof T & (string | number)]: T[P];
};

type StringOnlyKeys<T> = keyof {
  [P in keyof T & string]: T[P];
};

export type { NonSymbolKeys, StringOnlyKeys };
