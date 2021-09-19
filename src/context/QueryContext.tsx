import { createContext, useContext, useState } from "react";
import { GgnOpen } from "src/dummy";

export interface IQueryContext<T extends QueryEnumData> {
    setData(d: (data: EntryData<T>[]) => EntryData<T>[]): void;
    setEnum(id: string, key: string, value?: bool): void;
    setCheck(id: string, check?: bool): void;
    findIndex(id: string, inOrderList?: bool): number;
    find(id: string, inOrderList?: bool): EntryData<T> | undefined;
    readonly data: EntryData<T>[];
}
export interface CreateQueryContextOption<T extends QueryEnumData> {
    setData(d: (data: EntryData<T>[]) => EntryData<T>[]): void;
    setOrdered(
        d: (data: Optional<EntryData<T>>[]) => Optional<EntryData<T>>[]
    ): void;
}

const qcontext = createContext<IQueryContext<any>>(null as any);

export function createQueryOrder<T extends QueryEnumData>(
    dataList: EntryData<T>[]
): IQueryContext<T> {
    const [data, setData] = useState(dataList);

    const qctx: IQueryContext<T> = {
        setData,
        setEnum(id, key, check = false) {
            setData((e) => {
                const index = qctx.findIndex(id);
                e[index].data.value[key] = check;
                return [...e];
            });
        },
        setCheck(id, check = false) {
            setData((e) => {
                const index = qctx.findIndex(id);
                e[index].check = check;
                return [...e];
            });
        },
        findIndex(id, isChecked = false) {
            return data.findIndex((e) => {
                const result = e.id === id;
                if (isChecked) return result && e.check;
                return result;
            });
        },
        find(id, isChecked = false) {
            return data.find((e) => {
                const result = e.id === id;
                if (isChecked) return result && e.check;
                return result;
            });
        },
        data,
    };

    return qctx;
}
export function useQueryOrder<T extends QueryEnumData>() {
    return useContext(qcontext) as IQueryContext<T>;
}

export class QueryEnum implements QueryEnumData {
    constructor(
        private col: keyof GgnOpen,
        private enumData: ObjectType<[string, bool] | bool>
    ) {}

    get column() {
        return this.col;
    }
    get value() {
        return this.enumData;
    }
}

export { qcontext as QueryContext };
