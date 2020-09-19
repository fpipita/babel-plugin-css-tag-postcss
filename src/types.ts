import { PluginPass } from "@babel/core";

export interface BabelPluginCssTagPostcssOptions {
  /**
   * Name of the css tag function, defaults to `css`.
   */
  tag?: string;
}

export interface BabelPluginCssTagPostcssPluginPass extends PluginPass {
  opts: BabelPluginCssTagPostcssOptions;
};
