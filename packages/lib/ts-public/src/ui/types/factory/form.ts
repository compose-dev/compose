import * as BaseGeneric from "../baseGeneric";
import * as InputComponentTypes from "../../inputComponentTypes";
import * as OutputOmittedComponents from "../../outputOmittedComponents";
import * as SelectOption from "../selectOption";
import { type DivideUsingHalfMap } from "./halfMap";

type FirstArg<T> = T extends (arg1: infer A, ...args: any[]) => any ? A : never;
type EmptyList = never[];

type FormValue<T extends OutputOmittedComponents.AllWithInputInteraction> =
  T["type"] extends InputComponentTypes.SelectTypeWithOptionsList
    ? T["model"]["properties"] extends { options: infer TOpts }
      ? TOpts extends SelectOption.List
        ? T["type"] extends InputComponentTypes.MultiSelectType
          ? SelectOption.ExtractOptionValue<TOpts[number]>[]
          : T["model"]["required"] extends true
            ? SelectOption.ExtractOptionValue<TOpts[number]>
            : SelectOption.ExtractOptionValue<TOpts[number]> | null
        : never
      : never
    : FirstArg<T["hooks"]["validate"]>;

type FormKeyValue<
  T extends OutputOmittedComponents.AllWithInputInteraction,
  MaybeUndefined extends boolean,
> = MaybeUndefined extends true
  ? {
      [K in T["model"]["id"]]?: FormValue<T>;
    }
  : {
      [K in T["model"]["id"]]: FormValue<T>;
    };

export type FormData<
  T extends BaseGeneric.Children,
  ParentMaybeUndefined extends boolean = false,
> = Prettify<FormDataRecursive<T, ParentMaybeUndefined>>;

type FormDataRecursive<
  T extends BaseGeneric.Children,
  ParentMaybeUndefined extends boolean = false,
> = T extends EmptyList
  ? {}
  : T extends readonly OutputOmittedComponents.All[]
    ? MergeUnionBalanced<Flatten<T[number], ParentMaybeUndefined>>
    : T extends OutputOmittedComponents.All
      ? Flatten<T, ParentMaybeUndefined>
      : never;

type Flatten<
  T,
  ParentMaybeUndefined extends boolean = false,
> = T extends OutputOmittedComponents.AllWithInputInteraction
  ? FormKeyValue<
      T,
      T extends { maybeUndefined: true } ? true : ParentMaybeUndefined
    >
  : T extends OutputOmittedComponents.AllWithLayoutInteraction<
        BaseGeneric.Id,
        BaseGeneric.Required,
        infer UChildren
      >
    ? FormDataRecursive<
        UChildren,
        T extends { maybeUndefined: true } ? true : ParentMaybeUndefined
      >
    : {};

// ── Helpers for Basic Merging and Prettifying ─────────────────────────────

// MergeTwo<T, U>
// Merges two object types so that each key is given the union of types from T and U.
// (A missing key contributes “never”, which when unioned has no effect.)
type MergeTwo<T, U> = {
  [K in keyof T | keyof U]:
    | (K extends keyof T ? T[K] : never)
    | (K extends keyof U ? U[K] : never);
};

// Prettify<T>
// Forces TypeScript to expand an intersection into a “flat” object.
type Prettify<T> = { [K in keyof T]: T[K] } extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

// SplitAt<T, N>
// Splits tuple T into two parts, where the left part has length N.
type SplitAt<
  T extends any[],
  N extends number,
  L extends any[] = [],
> = L["length"] extends N
  ? [L, T]
  : T extends [infer F, ...infer R]
    ? SplitAt<R, N, [...L, F]>
    : [L, T];

// ── Balanced Merge: Divide-and-Conquer Reduction of a Tuple ────────────────

type MergeUnionBalancedTuple<T extends any[]> = T["length"] extends 0
  ? {}
  : T["length"] extends 1
    ? T[0]
    : // Otherwise, split the tuple in half and merge each half recursively.
      SplitAt<T, DivideUsingHalfMap<T["length"]>> extends [infer L, infer R]
      ? L extends any[]
        ? R extends any[]
          ? MergeTwo<MergeUnionBalancedTuple<L>, MergeUnionBalancedTuple<R>>
          : never
        : never
      : never;

// ── Convert a Union to a Tuple (Order Not Guaranteed) ───────────────────

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type LastOf<T> =
  UnionToIntersection<T extends any ? (x: T) => void : never> extends (
    x: infer Last
  ) => void
    ? Last
    : never;

type Push<T extends any[], V> = [...T, V];

type UnionToTuple<U, R extends any[] = []> = [U] extends [never]
  ? R
  : UnionToTuple<Exclude<U, LastOf<U>>, Push<R, LastOf<U>>>;

// ── The Final Utility: MergeUnionBalanced<T> ───────────────────────────────

/**
 * MergeUnionBalanced<T>
 *
 * Given a union T of object types, produces a single object type whose keys
 * are the union of all keys from T and whose property types are the union of
 * the property types from T.
 *
 * This version uses a balanced (divide‐and‐conquer) merge so that the recursion
 * depth grows on the order of log₂(n) instead of n. (It therefore scales better
 * for large unions.)
 *
 * Example:
 * ```ts
 * type MyUnion =
 *   | { name: string; address: string }
 *   | { name: boolean }
 *   | { email: string }
 *   | { number?: string | undefined }
 *   | { number: boolean };
 *
 * // MergeUnionBalanced<MyUnion> resolves to (roughly):
 * // {
 * //   name: string | boolean;
 * //   address: string;
 * //   email: string;
 * //   number: string | boolean | undefined;
 * // }
 * ```
 *
 * (Note: The treatment of optional properties here is “merged” by including undefined
 * in the union of property types. More advanced logic for marking properties with “?”
 * can be layered on, but it makes the solution even more complex.)
 */
export type MergeUnionBalanced<T> = MergeUnionBalancedTuple<UnionToTuple<T>>;
