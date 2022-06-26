import { generate } from "../../../src";
import { OpenAPIV3 } from "openapi-types";
import { readFileSync } from "fs";
describe("decorators", () => {
  generate({ filePath: "decorators.json", tsConfigFilePath: __dirname + "/tsconfig.gen.json" });
  it("format", () => {
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("decorators.json", { encoding: "utf8" }));
    expect(openapiDoc.paths["/format/{mail}"].post.parameters).toEqual([
      {
        in: "path",
        name: "mail",
        required: true,
        schema: {
          format: "email",
          type: "string",
        },
      },
      {
        in: "query",
        name: "uuid",
        required: true,
        schema: {
          format: "uuid",
          type: "string",
        },
      },
    ]);
    expect(openapiDoc.components.schemas["FormatClass"]).toEqual({
      properties: {
        uuid: {
          format: "uuid",
          type: "string",
        },
      },
      required: ["uuid"],
      type: "object",
    });
  });

  it("minmax", () => {
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("decorators.json", { encoding: "utf8" }));
    expect(openapiDoc.paths["/minmax/{mail}"].post.parameters).toEqual([
      {
        in: "path",
        name: "mail",
        required: true,
        schema: {
          format: "email",
          minLength: 5,
          type: "string",
        },
      },
      {
        in: "query",
        name: "from",
        required: true,
        schema: {
          minimum: 1,
          type: "number",
        },
      },
      {
        in: "query",
        name: "to",
        required: true,
        schema: {
          maximum: 5,
          type: "number",
        },
      },
      {
        in: "query",
        name: "array",
        required: false,
        schema: {
          items: {
            type: "string",
          },
          minLength: 1,
          type: "array",
        },
      },
      {
        in: "query",
        name: "object",
        required: true,
        schema: {
          minProperties: 1,
          properties: {
            a: {
              type: "number",
            },
          },
          required: ["a"],
          type: "object",
        },
      },
    ]);
    expect(openapiDoc.components.schemas["MinMaxClass"]).toEqual({
      properties: {
        array: {
          items: {
            type: "string",
          },
          minLength: 1,
          type: "array",
        },
        from: {
          minimum: 1,
          type: "number",
        },
        object: {
          minProperties: 1,
          properties: {
            a: {
              type: "number",
            },
          },
          required: ["a"],
          type: "object",
        },
        to: {
          maximum: 5,
          type: "number",
        },
      },
      required: ["from", "to", "array", "object"],
      type: "object",
    });
  });

  it("schema", () => {
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("decorators.json", { encoding: "utf8" }));
    expect(openapiDoc.paths["/schema/{mail}"].post.parameters).toEqual([
      {
        in: "path",
        name: "mail",
        required: true,
        schema: {
          description: "User email",
          format: "email",
          type: "string",
        },
      },
      {
        in: "query",
        name: "someInt",
        required: true,
        schema: {
          type: "integer",
        },
      },
      {
        in: "query",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
      },
    ]);
    expect(openapiDoc.components.schemas["SomeInterfaceWithInt"]).toEqual({
      properties: {
        id: {
          type: "string",
        },
        someInt: {
          type: "integer",
        },
      },
      required: ["someInt", "id"],
      type: "object",
    });
  });
});
