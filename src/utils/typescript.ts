import { ClassDeclaration, MethodDeclaration, Project, StringLiteral, Type } from "ts-morph";
export const isPrimitive = (type: Type) => type.isBoolean() || type.isNumber() || type.isString();

export function getControllers() {
  const project = new Project({ tsConfigFilePath: process.cwd() + "/tsconfig.json" });
  const sourceFiles = project.getSourceFiles();
  const controllers: ClassDeclaration[] = [];
  sourceFiles.forEach((s) => {
    s.getClasses().forEach((c) => {
      if (c.getName()?.endsWith("Controller")) controllers.push(c);
    });
  });
  return controllers;
}

export function getMethodDetails(method: MethodDeclaration) {
  const validRequestTypes = ["Post", "Get", "Delete", "Put", "Path", "Options", "Head"];
  const methodTypeDecorator = method.getDecorators().find((decorator) => validRequestTypes.includes(decorator.getName()));
  if (!methodTypeDecorator) return;
  const path = (methodTypeDecorator.getArguments()[0] as StringLiteral)?.getLiteralValue() || "";
  const httpMethodType = methodTypeDecorator.getName().toLowerCase();
  const description = method?.getJsDocs()[0]?.getDescription();
  let responseType = method?.getReturnType();
  if (responseType?.getTypeArguments()[0]) responseType = responseType?.getTypeArguments()[0];
  const parameters = method.getParameters();
  return { path, httpMethodType, description, responseType, parameters };
}
