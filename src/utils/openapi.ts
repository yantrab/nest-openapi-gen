import { EnumMember, ParameterDeclaration, PropertyDeclaration, PropertySignature, StringLiteral, SymbolFlags, Type } from "ts-morph";
import { isPrimitive } from "./typescript";
import { OpenAPIV3 } from "openapi-types";
import { last, merge } from "lodash";
import { getCustomValidation } from "./decorators";

export const definitions = {};

export function getResponseObject(responseType?: Type): OpenAPIV3.ResponseObject {
  if (!responseType) return { description: "ok" };
  if (responseType.getText().includes("Promise")) responseType = responseType?.getTypeArguments()[0];

  const responseObject = {};
  const contentType = getContentType(responseType);
  responseObject[contentType] = { schema: getParamSchema(responseType) };
  return { content: responseObject, description: "ok" };
}

export function getMethodParameters(parameters: ParameterDeclaration[]) {
  const result: { requestBody?: OpenAPIV3.RequestBodyObject; parameters: OpenAPIV3.ParameterObject[] } = {
    requestBody: undefined,
    parameters: [],
  };
  parameters.forEach((parameter) => {
    parameter
      .getDecorators()
      .filter((d) => ["Body", "Param", "Query", "Headers"].includes(d.getName()))
      .forEach((decorator) => {
        const decoratorName = decorator.getName();
        const decoratorArgs = decorator.getArguments();
        const inputPath = (decoratorArgs[0] as StringLiteral)?.getLiteralValue();
        switch (decoratorName) {
          case "Body": {
            const contentType = getContentType(parameter.getType());
            if (inputPath) {
              result.requestBody = result.requestBody || { content: { "application/json": { schema: { type: "object" } } } };
              const propSchema = getParamSchema(parameter);
              const schema = result.requestBody.content["application/json"].schema as OpenAPIV3.SchemaObject;
              schema.properties = schema.properties || {};
              if (propSchema) schema.properties[inputPath] = propSchema as OpenAPIV3.SchemaObject;
              if (!(propSchema as any)?.optional) schema.required = (schema.required || []).concat(inputPath);
            } else {
              result.requestBody = { content: {} };
              result.requestBody.content[contentType] = { schema: getParamSchema(parameter) };
            }
            break;
          }
          case "Param": {
            if (inputPath) {
              const paramSchema = getParamSchema(parameter) as OpenAPIV3.SchemaObject & { optional?: boolean };
              result.parameters.push({
                in: "path",
                name: inputPath,
                required: !(paramSchema as any).optional,
                schema: paramSchema,
              } as OpenAPIV3.ParameterObject);
            } else {
              const objectSchema = getParamSchema(parameter, false) as OpenAPIV3.SchemaObject & { optional?: boolean };
              Object.keys(objectSchema.properties || {}).forEach((prop) => {
                const propSchema = objectSchema.properties?.[prop];
                result.parameters.push({
                  in: "path",
                  name: prop,
                  required: !(propSchema as any).optional,
                  schema: propSchema,
                } as OpenAPIV3.ParameterObject);
              });
            }
            break;
          }
          case "Query": {
            if (inputPath) {
              const paramSchema = getParamSchema(parameter) as OpenAPIV3.SchemaObject & { optional?: boolean };
              result.parameters.push({
                in: "query",
                name: inputPath,
                required: !(paramSchema as any).optional,
                schema: paramSchema,
              } as OpenAPIV3.ParameterObject);
            } else {
              const paramSchema = getParamSchema(parameter, false) as OpenAPIV3.SchemaObject & { optional?: boolean };
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
              const paramSchema = getParamSchema(parameter) as OpenAPIV3.SchemaObject & { optional?: boolean };
              result.parameters.push({
                in: "header",
                name: inputPath,
                required: !(paramSchema as any).optional,
                schema: paramSchema,
              } as OpenAPIV3.ParameterObject);
            } else {
              const paramSchema = getParamSchema(parameter, false) as OpenAPIV3.SchemaObject & { optional?: boolean };
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
  const schema: OpenAPIV3.NonArraySchemaObject & { optional?: boolean } = { type: "object", properties: {}, required: [] };
  type.getProperties().forEach((prop) => {
    const isGetter = prop.hasFlags(SymbolFlags.GetAccessor);
    if (isGetter) return;
    const valueDeclaration = prop.getValueDeclarationOrThrow() as PropertyDeclaration;
    const schemaProperties = schema!.properties!;
    const key = prop.getName();
    schemaProperties[key] = getParamSchema(valueDeclaration) || {};
    if (!schemaProperties[key]) {
      schemaProperties[key] = { type: "object" };
    }
    if (!(schemaProperties[key] as any).optional) {
      schema?.required!.push(key);
    }
  });
  if (!schema.required?.length) delete schema.required;
  return schema;
};
const getTypeString = (type: Type, useRef: boolean) => {
  const typeText = type.getText();
  if (type.isArray()) return "array";
  if (type.getText() === "Date") return "date";
  if (isPrimitive(type)) return typeText.replace(" | undefined", "");
  if (type.isClass() || type.isInterface()) return useRef ? "ref" : "object";
  if (type.isObject()) return "object";
  if (type.isEnumLiteral()) return "enumLiteral";
  if (type.isEnum()) return "enum";
};

const getParamSchema = (
  typeOrProperty: Type | PropertyDeclaration | ParameterDeclaration | PropertySignature,
  useRef = true
): OpenAPIV3.ReferenceObject | (OpenAPIV3.SchemaObject & { optional?: boolean }) | undefined => {
  const type = typeOrProperty instanceof Type ? typeOrProperty : typeOrProperty.getType();
  const prop = typeOrProperty instanceof Type ? undefined : typeOrProperty;
  const typeText = type.getText();
  const nonNullableType = type.getNonNullableType();
  const typeString = getTypeString(nonNullableType, useRef);
  let schema = { optional: nonNullableType.getText() !== typeText || !!prop?.hasQuestionToken() };
  if (prop instanceof PropertyDeclaration || prop instanceof ParameterDeclaration) {
    prop.getDecorators().forEach((decorator) => {
      schema = merge(schema, getCustomValidation(decorator, typeString));
    });
  }

  switch (typeString) {
    case "array":
      return {
        ...schema,
        type: "array",
        items: getParamSchema(nonNullableType.getArrayElementTypeOrThrow()) || {},
      };
    case "date":
      return { ...schema, type: "string", format: "date-time" };
    case "boolean":
    case "number":
    case "string":
      return { type: typeString, ...schema };
    case "ref": {
      const name = nonNullableType.getText().split(").")[1] || nonNullableType.getText();
      if (!definitions[name]) definitions[name] = merge(getObjectSchema(nonNullableType), schema);
      return { $ref: "#/components/schemas/" + name } as OpenAPIV3.ReferenceObject;
    }
    case "object":
      return merge(getObjectSchema(nonNullableType), schema);
    case "enumLiteral": {
      const name = prop!.getName();
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
      return { $ref: "#/components/schemas/" + name, ...schema };
    }
    case "enum": {
      const name = last(nonNullableType.getText().split("."))!;
      const enumSchema: any = {};
      enumSchema.enum = nonNullableType.getUnionTypes().map((t) => t.getLiteralValueOrThrow());
      enumSchema["x-enumNames"] = nonNullableType.getUnionTypes().map((t) => last(t.getText().split(".")) as string);
      enumSchema.type = typeof enumSchema.enum[0];
      definitions[name] = enumSchema;
      return { $ref: "#/components/schemas/" + name, ...schema };
    }
  }

  const unionTypes = type.getUnionTypes().filter((t) => !t.isUndefined());
  if (unionTypes.length > 1) {
    const schema: any = {};
    schema.oneOf = unionTypes.map((t) => getParamSchema(t));
    if (!schema.oneOf[0]) {
      delete schema.oneOf;
      schema.enum = unionTypes.map((t) => t.getText().slice(1, -1));
      schema["x-enumNames"] = unionTypes.map((t) => t.getText().slice(1, -1));
      schema.type = typeof schema.enum[0];
    }
    return schema;
  }
};
