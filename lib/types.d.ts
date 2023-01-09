export interface POJO {
    [propName: string]: POJO | any;
}
export type TransformFn = (value: any, propName?: string, input?: POJO | any, output?: POJO | any) => POJO | any;
export type TransformMap = string | TransformMapObject | TransformFn;
export interface TransformMapObject {
    [fromPropName: string]: TransformMap | TransformMap[];
}
export type ValidationRuleHasExpectedValueFn = (input: any) => boolean;
export type ValidationRuleTypeFn = (input: any) => boolean;
export interface ValidationData {
    [propName: string]: any;
}
export interface ValidationOptions {
    _depth?: number;
    debug?: boolean;
    negateMatch?: boolean;
    matchAll?: boolean;
    skipMissingProps?: boolean;
    caseSensitive?: boolean;
    data?: ValidationData;
}
export interface ValidationRuleRange {
    min: number;
    max: number;
}
export type ValidationRule = ValidationFn | ValidationRuleTypeFn | ValidationRuleRange | POJO;
export interface ValidationRulesObject {
    [ruleName: string]: ValidationRule;
}
export type ValidationRules = ValidationRule | ValidationRulesObject;
export interface ValidationRuleTypeFns {
    [typeName: string]: ValidationRuleTypeFn;
}
export type ValidationFn = (input: any, rules?: ValidationRules | any, options?: ValidationOptions) => boolean;
export interface ValidationMatchedRule {
    ruleName: string;
    ruleValue: any;
    input: any;
    options: ValidationOptions;
    isValid: boolean;
}
