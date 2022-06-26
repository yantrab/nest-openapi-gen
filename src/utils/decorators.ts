import { Decorator } from "ts-morph";
import { camelCase, set, snakeCase } from "lodash";

const ajvMap = { number: "imum", string: "Length", array: "Items", object: "Properties" };
const getMinMaxValidation = (keyword, type, value) => set({}, keyword + ajvMap[typeMap[type]], +value);
const typeMap = {
  array: "string",
  date: "string",
  number: "number",
  string: "string",
  ref: "object",
  object: "object",
};
export function getCustomValidation(decorator: Decorator, type?: string) {
  const decoratorName = camelCase(decorator.getName());
  const decoratorParams = decorator.getArguments();
  switch (decoratorName) {
    case "time":
    case "date":
    case "dateTime":
    case "duration":
    case "uri":
    case "uriReference":
    case "uriTemplate":
    case "email":
    case "hostname":
    case "ipv4":
    case "ipv6":
    case "uuid":
    case "jsonPointer":
    case "relativeJsonPointer":
      return { format: snakeCase(decoratorName) };
    case "pattern":
      return { pattern: decorator.getArguments()[0] };
    case "numberString":
      return { pattern: "^[0-9]*$" };
    case "min":
    case "max":
      return getMinMaxValidation(decoratorName, type, decoratorParams[0].getText());
    case "schema":
      return JSON.parse(decoratorParams[0].getText().replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
  }
  return {};
}
