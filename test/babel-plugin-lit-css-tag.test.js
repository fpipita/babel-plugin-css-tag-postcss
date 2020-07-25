import pluginTester from "babel-plugin-tester";
import path from "path";
import { plugin } from "../src/babel-plugin-lit-css-tag.js";

pluginTester.default({
  plugin: plugin,
  fixtures: path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "__fixtures__"
  ),
});
