import libTransform from "./lib/transform";
import libValidate from "./lib/validate";
export declare const get: (input: import("./lib/util").Input, prop: import("./lib/util").InputPath, defaultValue?: any) => any;
export declare const set: (input: import("./lib/util").Input, prop: import("./lib/util").InputPath, value: any) => void;
export declare const transform: typeof libTransform;
export declare const validate: typeof libValidate;
declare const _default: {
    get: (input: import("./lib/util").Input, prop: import("./lib/util").InputPath, defaultValue?: any) => any;
    set: (input: import("./lib/util").Input, prop: import("./lib/util").InputPath, value: any) => void;
    transform: typeof libTransform;
    validate: typeof libValidate;
};
export default _default;
