import { generate } from "../../../src";
import { OpenAPIV3 } from "openapi-types";
import { readFileSync } from "fs";
import { resolve } from "path";
describe("options", () => {
  it("should generate file in path", () => {
    generate({ filePath: "./a.json" });
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("./a.json", { encoding: "utf8" }));
    expect(openapiDoc).toBeTruthy();
  });

  it("tsConfigFilePath option", () => {
    generate({ tsConfigFilePath: resolve(__dirname, "./tsconfig.gen.json"), filePath: "a.json" });
    const openapiDoc: OpenAPIV3.Document = JSON.parse(readFileSync("./a.json", { encoding: "utf8" }));
    expect(Object.keys(openapiDoc.paths).length).toBe(1);
  });
});
