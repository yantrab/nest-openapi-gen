export function getOpenapiPath(basePath?: string, methodPath?: string) {
  const path = basePath + (basePath ? "/" : "") + methodPath;
  return path
    .replace(/(\/?:[a-z]+)(\/)?/gi, ($1) => `{${$1.replace(/[:/]/g, "")}}`)
    .replace(/{/g, "/{")
    .replace(/}/g, "}/")
    .replace(/\/+/g, "/")
    .replace(/\/$/g, "")
    .replace("?", "");
}
