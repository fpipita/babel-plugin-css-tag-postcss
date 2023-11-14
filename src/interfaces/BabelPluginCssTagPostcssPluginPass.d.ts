import { PluginPass } from "@babel/core";
import { BabelPluginCssTagPostcssOptions } from "./BabelPluginCssTagPostcssOptions.js";

export interface BabelPluginCssTagPostcssPluginPass extends PluginPass {
  opts: BabelPluginCssTagPostcssOptions;
}
