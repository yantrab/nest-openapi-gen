import { ClassDeclaration, StringLiteral } from "ts-morph";
export function getControllerTag(controller: ClassDeclaration) {
  const tag: string = controller.getNameOrThrow().replace("Controller", "");
  let description = controller.getJsDocs()[0]?.getDescription();
  if (description) {
    description = description.replace(/^\n/g, "");
  }
  return { name: tag, description };
}

export function getControllerPath(controller: ClassDeclaration, prefix?: string) {
  return (prefix || "/") + ((controller.getDecorator("Controller")?.getArguments()[0] as StringLiteral)?.getLiteralValue() || "");
}
