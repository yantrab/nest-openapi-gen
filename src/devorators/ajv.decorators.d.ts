interface IMinMaxKeyword {
  (count: number): any;
}
interface IPatternKeyword {
  (pattern: RegExp | string): any;
}

declare class OpenAPIKeyword {
  readonly min: IMinMaxKeyword;
  readonly max: IMinMaxKeyword;
  readonly pattern: IPatternKeyword;
  readonly date: PropertyDecorator & ParameterDecorator;
  readonly time: PropertyDecorator & ParameterDecorator;
  readonly dateTime: PropertyDecorator & ParameterDecorator;
  readonly duration: PropertyDecorator & ParameterDecorator;
  readonly uri: PropertyDecorator & ParameterDecorator;
  readonly uriReference: PropertyDecorator & ParameterDecorator;
  readonly uriTemplate: PropertyDecorator & ParameterDecorator;
  readonly email: PropertyDecorator & ParameterDecorator;
  readonly hostname: PropertyDecorator & ParameterDecorator;
  readonly ipv4: PropertyDecorator & ParameterDecorator;
  readonly ipv6: PropertyDecorator & ParameterDecorator;
  readonly regex: PropertyDecorator & ParameterDecorator;
  readonly uuid: PropertyDecorator & ParameterDecorator;
  readonly jsonPointer: PropertyDecorator & ParameterDecorator;
  readonly relativeJsonPointer: PropertyDecorator & ParameterDecorator;
  readonly numberString: PropertyDecorator & ParameterDecorator;
  constructor();
}
declare const Keyword: OpenAPIKeyword;
export = Keyword;
