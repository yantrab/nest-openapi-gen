import { generate } from "../../src";
import { OpenAPIV3 } from "openapi-types";
import { readFileSync } from "fs";
import OpenAPISchemaValidator from "openapi-schema-validator";

describe("options", () => {
  it("should generate file in path", () => {
    generate({ filePath: "./a.json" });
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("./a.json", { encoding: "utf8" }));
    expect(openapiDoc);
  });
});
