interface IMinMaxKeyword {
  (count: number): any;
}
interface IPatternKeyword {
  (pattern: RegExp | string): any;
}

declare class OpenAPIKeyword {
  readonly Min: IMinMaxKeyword;
  readonly Max: IMinMaxKeyword;
  readonly Pattern: IPatternKeyword;
  readonly Date: PropertyDecorator & ParameterDecorator;
  readonly Time: PropertyDecorator & ParameterDecorator;
  readonly DateTime: PropertyDecorator & ParameterDecorator;
  readonly Duration: PropertyDecorator & ParameterDecorator;
  readonly Uri: PropertyDecorator & ParameterDecorator;
  readonly UriReference: PropertyDecorator & ParameterDecorator;
  readonly UriTemplate: PropertyDecorator & ParameterDecorator;
  readonly Email: PropertyDecorator & ParameterDecorator;
  readonly Hostname: PropertyDecorator & ParameterDecorator;
  readonly Ipv4: PropertyDecorator & ParameterDecorator;
  readonly Ipv6: PropertyDecorator & ParameterDecorator;
  readonly Regex: PropertyDecorator & ParameterDecorator;
  readonly Uuid: PropertyDecorator & ParameterDecorator;
  readonly JsonPointer: PropertyDecorator & ParameterDecorator;
  readonly RelativeJsonPointer: PropertyDecorator & ParameterDecorator;
  readonly NumberString: PropertyDecorator & ParameterDecorator;
  constructor();
}
declare const Keyword: OpenAPIKeyword;
export = Keyword;
