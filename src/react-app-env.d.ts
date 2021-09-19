/// <reference types="react-scripts" />

type Optional<T> = T | undefined;
type ObjectType<T = any> = Record<string, T>;
type GroupFn<T> = (d: T) => any;
type Keyof<T> = keyof T;
type int = number;
type bool = boolean;

type PrimitiveTypesCtor =
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | BigIntConstructor;
type PrimitivesTypesStr = "string" | "number" | "boolean" | "bigint";
type PrimitivesTypes = number | string | boolean | bigint;

interface ModelEntry<T extends ObjectType> {
    name: keyof T
    data: Iterable<T>;
    children: Map<PrimitivesTypes, ModelEntry<T> | null>;
}
interface RModelEntry<T extends ObjectType> {
    name: keyof T | "root";
    data: T[];
    attributes?: {
        value: bool | int | string;
    };
    children: RModelEntry<T>[];
}

type EntryDataType = ObjectType | string;
interface EntryData<T extends ObjectType> {
    id: string;
    index: number;
    text: string;
    check: bool;
    readonly data: T;
}

interface QueryEnumData {
    column: string;
    value: ObjectType<[string, bool] | bool>;
}

type HtmlProps<T extends Element = HTMLElement, E extends Element = T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, E>;
type RootHtmlProps = HtmlProps & { root?: bool }

namespace JSX {
    interface IntrinsicElements {
        "node-el": RootHtmlProps;
        "path-el": HtmlProps;
    }
}