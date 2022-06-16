import { readFileSync } from "fs";
import { resolve } from "path";

export function getPackageInfo() {
  const { name, version, description } = JSON.parse(readFileSync(resolve("./package.json"), { encoding: "utf-8" }));
  return { title: name, version, description };
}
