interface IMinMaxKeyword {
  (count: number): any;
}
interface IPatternKeyword {
  (pattern: RegExp | string): any;
}

export const Min: IMinMaxKeyword = (count) => () => {};
export const Max: IMinMaxKeyword = (count) => () => {};
export const Pattern: IPatternKeyword = (count) => () => {};
export const Date: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Time: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const DateTime: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Duration: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Uri: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const UriReference: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const UriTemplate: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Email: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Hostname: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Ipv4: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Ipv6: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Regex: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const Uuid: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const JsonPointer: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const RelativeJsonPointer: PropertyDecorator & ParameterDecorator = (count) => () => {};
export const NumberString: PropertyDecorator & ParameterDecorator = (count) => () => {};
