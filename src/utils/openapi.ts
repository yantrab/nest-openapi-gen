import { EnumMember, ParameterDeclaration, StringLiteral, Symbol as tsSymbol, SymbolFlags, Type } from "ts-morph";
import { isPrimitive } from "./typescript";
import { OpenAPIV3 } from "openapi-types";
import { last } from "lodash";

export const definitions = {};

export function getResponseObject(responseType?: Type): OpenAPIV3.ResponseObject {
  if (!responseType) return { description: "ok" };
  if (responseType?.getTypeArguments()[0]) responseType = responseType?.getTypeArguments()[0];

  const responseObject = {};
  const contentType = getContentType(responseType);
  responseObject[contentType] = { schema: getParamSchema(responseType) };
  return { content: responseObject, description: "ok" };
}

export function getMethodParameters(parameters: ParameterDeclaration[]) {
  const result: any = { requestBody: undefined, parameters: [] };
  parameters.forEach((parameter) => {
    parameter.getDecorators().forEach((decorator) => {
      const decoratorName = decorator.getName();
      const decoratorArgs = decorator.getArguments();
      const inputPath = (decoratorArgs[0] as StringLiteral)?.getLiteralValue();
      const parameterType = parameter.getType();
      const isOptional = parameter.hasQuestionToken();
      switch (decoratorName) {
        case "Body": {
          const contentType = getContentType(parameterType);
          if (inputPath) {
            result.requestBody = result.requestBody || { content: { "application/json": { schema: { type: "object" } } } };
            const propSchema = getParamSchema(parameterType);
            const schema = result.requestBody.content["application/json"].schema;
            schema.properties = schema.properties || {};
            schema.properties[inputPath] = propSchema;
            if ((propSchema as any).optional !== true && !isOptional) schema.required = (schema.required || []).concat(inputPath);
          } else {
            result.requestBody = { content: {} };
            result.requestBody.content[contentType] = { schema: getParamSchema(parameterType) };
          }
          break;
        }
        case "Param": {
          if (inputPath) {
            result.parameters.push({
              in: "path",
              name: inputPath,
              required: true,
              schema: getParamSchema(parameter.getType()),
            } as OpenAPIV3.ParameterObject);
          } else {
            const objectSchema = getObjectSchema(parameter.getType());
            Object.keys(objectSchema.properties || {}).forEach((prop) => {
              const propSchema = objectSchema.properties?.[prop];
              result.parameters.push({
                in: "path",
                name: prop,
                required: true,
                schema: propSchema,
              } as OpenAPIV3.ParameterObject);
            });
          }
          break;
        }
        case "Query": {
          if (inputPath) {
            const paramSchema = getParamSchema(parameterType) as OpenAPIV3.SchemaObject & { optional?: boolean };
            result.parameters.push({
              in: "query",
              name: inputPath,
              required: !((paramSchema as any).optional || isOptional),
              schema: paramSchema,
            } as OpenAPIV3.ParameterObject);
          } else {
            const paramSchema = getObjectSchema(parameterType) as OpenAPIV3.SchemaObject & { optional?: boolean };
            Object.keys(paramSchema.properties || {}).forEach((prop) => {
              const propSchema = paramSchema.properties?.[prop];
              result.parameters.push({
                in: "query",
                name: prop,
                required: !(propSchema as any).optional,
                schema: propSchema,
              } as OpenAPIV3.ParameterObject);
            });
          }
          break;
        }
        case "Headers": {
          if (inputPath) {
            const paramSchema = getParamSchema(parameterType) as OpenAPIV3.SchemaObject & { optional?: boolean };
            result.parameters.push({
              in: "header",
              name: inputPath,
              required: !((paramSchema as any).optional || isOptional),
              schema: paramSchema,
            } as OpenAPIV3.ParameterObject);
          } else {
            const paramSchema = getObjectSchema(parameterType) as OpenAPIV3.SchemaObject & { optional?: boolean };
            Object.keys(paramSchema.properties || {}).forEach((prop) => {
              const propSchema = paramSchema.properties?.[prop];
              result.parameters.push({
                in: "header",
                name: prop,
                required: !(propSchema as any).optional,
                schema: propSchema,
              } as OpenAPIV3.ParameterObject);
            });
          }
          break;
        }
      }
    });
  });
  return result;
}

export function getContentType(type: Type) {
  if (isPrimitive(type)) return "text/plain";
  return "application/json";
}

const getObjectSchema = (type: Type): OpenAPIV3.NonArraySchemaObject & { optional?: boolean } => {
  const nonNullableType = type.getNonNullableType();
  const nonNullableTypeText = nonNullableType.getText();
  const optional = nonNullableTypeText !== type.getText();

  const schema: OpenAPIV3.NonArraySchemaObject & { optional?: boolean } = { type: "object", properties: {}, required: [], optional };
  type
    .getNonNullableType()
    .getProperties()
    .forEach((prop) => {
      const isGetter = prop.hasFlags(SymbolFlags.GetAccessor);
      if (isGetter) return;
      const valueDeclaration = prop.getValueDeclarationOrThrow();
      const schemaProperties = schema.properties!;
      const key = prop.getName();

      schemaProperties[key] = getParamSchema(valueDeclaration.getType(), prop) || {};
      if (!schemaProperties[key]) {
        schemaProperties[key] = { type: "object" };
      }
      if ((schemaProperties[key] as any).optional !== true) {
        schema.required!.push(key);
      }
    });
  return schema;
};

const getParamSchema = (
  type: Type,
  prop?: tsSymbol
): OpenAPIV3.ReferenceObject | (OpenAPIV3.SchemaObject & { optional?: boolean }) | undefined => {
  const typeText = type.getText();
  const nonNullableType = type.getNonNullableType();
  const optional = nonNullableType.getText() !== typeText || !!prop?.hasFlags(SymbolFlags.Optional);
  if (nonNullableType.isArray()) {
    return {
      optional,
      type: "array",
      items: getParamSchema(nonNullableType.getArrayElementTypeOrThrow(), prop) || {},
    };
  }

  if (nonNullableType.getText() === "Date") {
    return { type: "string", format: "date-time", optional };
  }

  if (isPrimitive(nonNullableType)) {
    const type = typeText.replace(" | undefined", "");
    return { type, optional } as OpenAPIV3.SchemaObject;
  }

  if (nonNullableType.isClass() || nonNullableType.isInterface()) {
    const name = nonNullableType.getText().split(").")[1] || nonNullableType.getText();
    if (!definitions[name]) definitions[name] = getObjectSchema(type);
    return { $ref: "#/components/schemas/" + name } as OpenAPIV3.ReferenceObject;
  }

  if (nonNullableType.isObject()) {
    return getObjectSchema(type);
  }

  // enum --------------------------------------
  if (nonNullableType.isEnumLiteral() && prop) {
    const name = prop.getName();
    const enumMembers = (prop as any)
      .getValueDeclarationOrThrow()
      .getSourceFile()
      .getEnum((e: { getName: () => string }) => e.getName() === nonNullableType.getText())
      .getMembers();
    const enumSchema: any = {};
    enumSchema.enum = enumMembers.map((m: EnumMember) => m.getName());
    enumSchema["x-enumNames"] = enumMembers.map((m: EnumMember) => m.getValue());
    enumSchema.type = typeof enumSchema.enum[0];
    definitions[name] = enumSchema;
    return { $ref: "#/components/schemas/" + name, optional } as OpenAPIV3.ReferenceObject;
  }

  if (nonNullableType.isEnum()) {
    const name = last(nonNullableType.getText().split("."))!;
    const enumSchema: any = {};
    enumSchema.enum = nonNullableType.getUnionTypes().map((t) => t.getLiteralValueOrThrow());
    enumSchema["x-enumNames"] = nonNullableType.getUnionTypes().map((t) => last(t.getText().split(".")) as string);
    enumSchema.type = typeof enumSchema.enum[0];
    definitions[name] = enumSchema;
    return { $ref: "#/components/schemas/" + name, optional } as OpenAPIV3.ReferenceObject;
  }

  const unionTypes = type.getUnionTypes().filter((t) => !t.isUndefined());
  if (unionTypes.length > 1) {
    const schema: any = {};
    schema.oneOf = unionTypes.map((t) => getParamSchema(t, prop));
    if (!schema.oneOf[0]) {
      delete schema.oneOf;
      schema.enum = unionTypes.map((t) => t.getText().slice(1, -1));
      schema["x-enumNames"] = unionTypes.map((t) => t.getText().slice(1, -1));
      schema.type = typeof schema.enum[0];
    }
    return schema;
  }
};
