export function autobind(
    target: any,
    key: string,
    desc: TypedPropertyDescriptor<(...args: any[]) => any>
) {
    const { value: FN, ...rest } = desc;
    const newDesc: PropertyDescriptor = {
        get() {
            const binded = FN!.bind(this);
            Object.defineProperty(this, key, {
                enumerable: false,
                configurable: false,
                value: function (...args: any[]) {
                    return binded(...args);
                },
            });
            return binded;
        },
        enumerable: true,
        configurable: true
    }

    Object.defineProperty(target, key, newDesc);
    return desc;
}
