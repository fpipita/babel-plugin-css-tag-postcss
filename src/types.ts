import { PluginPass } from "@babel/core";

export interface BabelPluginLitCssTagOptions {
  /**
   * Name of the css tag function, defaults to `css`.
   */
  tag?: string;
}

export type BabelPluginLitCssTagPluginPass = PluginPass & {
  opts: BabelPluginLitCssTagOptions;
};
