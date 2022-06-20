import { generate } from "../../src";
import { OpenAPIV3 } from "openapi-types";
import { readFileSync } from "fs";
import OpenAPISchemaValidator from "openapi-schema-validator";
generate();
const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("./openapi.schema.json", { encoding: "utf8" }));

describe("openapi", () => {
  it("should convert path", () => {
    expect(openapiDoc.paths["/{projectName}/event-timeline/{storeId}"]);
  });

  it("should return valid open api document", () => {
    const validator = new OpenAPISchemaValidator({ version: 3 });
    const validationResults = validator.validate(openapiDoc);
    expect(validationResults.errors.length).toBe(0);
  });

  describe("info", () => {
    it("should take the info from package json file", () => {
      expect(openapiDoc.info).toEqual({
        description: "This is the description of this api service",
        title: "test",
        version: "0.0.1",
      });
    });

    it("should take tag info from controller jsdoc", () => {
      expect(openapiDoc.tags[0]).toEqual({
        description: "Controller description\nthis is second line",
        name: "App",
      });
    });
  });

  describe("response", () => {
    it("response string", () => {
      expect(openapiDoc.paths["/response-string"]?.get.responses[200]).toEqual({
        content: {
          "text/plain": {
            schema: {
              type: "string",
            },
          },
        },
        description: "ok",
      });
    });

    it("response object with explicit return type", () => {
      expect(openapiDoc.paths["/response-object1"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              properties: {
                a: {
                  type: "string",
                },
                b: {
                  type: "number",
                },
              },
              required: ["a"],
              type: "object",
            },
          },
        },
        description: "ok",
      });
    });

    it("response object without explicit return type", () => {
      expect(openapiDoc.paths["/response-object2"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              properties: {
                a: {
                  type: "string",
                },
              },
              required: ["a"],
              type: "object",
            },
          },
        },
        description: "ok",
      });
    });

    it("response class", () => {
      expect(openapiDoc.paths["/response-class"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeClass",
            },
          },
        },
        description: "ok",
      });
      expect(openapiDoc.components.schemas.SomeClass).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });

    it("response interface", () => {
      expect(openapiDoc.paths["/response-interface"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeInterface",
            },
          },
        },
        description: "ok",
      });
      expect(openapiDoc.components.schemas.SomeInterface).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });
    it("response array of string", () => {
      expect(openapiDoc.paths["/response-array-of-string"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              items: {
                type: "string",
              },
              type: "array",
            },
          },
        },
        description: "ok",
      });
      expect(openapiDoc.components.schemas.SomeInterface).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });
    it("response promise", () => {
      expect(openapiDoc.paths["/response-promise"]?.get.responses[200]).toEqual({
        content: {
          "application/json": {
            schema: {
              items: {
                type: "string",
              },
              type: "array",
            },
          },
        },
        description: "ok",
      });
      expect(openapiDoc.components.schemas.SomeInterface).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });
  });

  describe("request body", () => {
    it("body is string", () => {
      expect(openapiDoc.paths["/body-string"]?.post.requestBody).toEqual({
        content: {
          "text/plain": {
            schema: {
              type: "string",
            },
          },
        },
      });
    });

    it("body is object", () => {
      expect(openapiDoc.paths["/body-object"]?.post.requestBody).toEqual({
        content: {
          "application/json": {
            schema: {
              properties: {
                b: {
                  type: "number",
                },
              },
              required: ["b"],
              type: "object",
            },
          },
        },
      });
    });

    it("body is class", () => {
      expect(openapiDoc.paths["/body-class"]?.post.requestBody).toEqual({
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeOtherClass",
            },
          },
        },
      });
      expect(openapiDoc.components.schemas.SomeOtherClass).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });

    it("body is interface", () => {
      expect(openapiDoc.paths["/body-interface"]?.post.requestBody).toEqual({
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeOtherInterface",
            },
          },
        },
      });
      expect(openapiDoc.components.schemas.SomeOtherInterface).toEqual({
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "string",
          },
        },
        required: ["a"],
        type: "object",
      });
    });

    it("body is object with path", () => {
      expect(openapiDoc.paths["/body-object-path"]?.post.requestBody).toEqual({
        content: {
          "application/json": {
            schema: {
              properties: {
                a: {
                  type: "string",
                },
                b: {
                  type: "number",
                },
              },
              required: ["a"],
              type: "object",
            },
          },
        },
      });
    });
  });

  describe("query", () => {
    it("query is object", () => {
      expect(openapiDoc.paths["/query-object"]?.post.parameters).toEqual([
        { in: "query", name: "b", required: true, schema: { type: "number" } },
      ]);
    });

    it("query is class", () => {
      expect(openapiDoc.paths["/query-class"]?.post.parameters).toEqual([
        {
          in: "query",
          name: "a",
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "b",
          required: false,
          schema: {
            type: "string",
          },
        },
      ]);
    });

    it("query is interface", () => {
      expect(openapiDoc.paths["/query-interface"]?.post.parameters).toEqual([
        {
          in: "query",
          name: "a",
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "b",
          required: false,
          schema: {
            type: "string",
          },
        },
      ]);
    });

    it("query is object with path", () => {
      expect(openapiDoc.paths["/query-object-path"]?.post.parameters).toEqual([
        {
          in: "query",
          name: "a",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "b",
          required: false,
          schema: {
            type: "number",
          },
        },
      ]);
    });
  });

  describe("path params", () => {
    // path = ":p/optional-params/:id?/:timestamp?"
    expect(openapiDoc.paths["/{p}/optional-params"]).toBeTruthy();
    expect(openapiDoc.paths["/{p}/optional-params/{id}"]).toBeTruthy();
    expect(openapiDoc.paths["/{p}/optional-params/{id}/{timestamp}"]).toBeTruthy();
  });
});
