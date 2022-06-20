import { OpenAPIV3 } from "openapi-types";
import { getPackageInfo } from "./utils/package";
import { writeFileSync } from "fs";
import { getControllers, getMethodDetails } from "./utils/typescript";
import { getControllerPath, getControllerTag } from "./utils/controller";
import { getOpenapiPath } from "./utils/util";
import { definitions, getMethodParameters, getResponseObject } from "./utils/openapi";
import { omitDeepBy } from "./utils/omit-by";
import { cloneDeep } from "lodash";

export function generate(options?: { prefix?: string; filePath?: string }) {
  const schema: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: getPackageInfo(),
    paths: {},
    components: {},
    tags: [],
  };
  getControllers().forEach((controller) => {
    const tag = getControllerTag(controller);
    schema.tags?.push(tag);
    const basePath = getControllerPath(controller, options?.prefix);
    controller.getMethods().forEach((method) => {
      const methodDetails = getMethodDetails(method);
      if (!methodDetails) return;
      const methodParameterSchemas = getMethodParameters(methodDetails.parameters);
      const path = getOpenapiPath(basePath, methodDetails.path);
      schema.paths[path] = schema.paths[path] || {};
      schema.paths[path]![methodDetails.httpMethodType] = {
        tags: [tag.name],
        responses: { 200: getResponseObject(methodDetails.responseType) },
        ...methodParameterSchemas,
      };
    });
  });
  schema.components!["schemas"] = definitions;
  const swaggerSchema = omitDeepBy(cloneDeep(schema), (x: any, y: any) => {
    return y === "optional";
  });
  writeFileSync(options?.filePath || "./openapi.schema.json", JSON.stringify(swaggerSchema));
}
