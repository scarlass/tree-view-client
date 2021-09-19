import { isBool, isDefined, isStr } from "@jk/utils";

export type ClassNameParam = Optional<string | Record<string, boolean | undefined>>;
export function ClassName(...args: ClassNameParam[]) {
    return args.map(arg => {
        if(!isDefined(arg)) return void 0;
        return isStr(arg) ? arg : Object.keys(arg).map( function (key) {
            return isBool(arg[key]) && arg[key] ? key : void 0;
        }).filter(isDefined).join(" ");
    }).filter(isDefined).join(" ");
}