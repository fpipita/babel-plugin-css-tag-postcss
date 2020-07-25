import babel from "@babel/core";
import postcss from "postcss";
import postcssrc from "postcss-load-config";
import { v4 as uuidv4 } from "uuid";

const placeholder = uuidv4();

const { plugins } = postcssrc.sync();
const processor = postcss(plugins);

/**
 * @returns {import("@babel/core").PluginObj<import("./types").BabelPluginLitCssTagPluginPass>}
 */
export const plugin = () => {
  return {
    name: "babel-plugin-lit-css-tag",
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (!path.get("tag").isIdentifier({ name: state.opts.tag ?? "css" })) {
          return;
        }
        /**
         * @type {string[]}
         */
        const flattened = [];
        for (let i = 0; i < path.node.quasi.expressions.length; i++) {
          flattened.push(path.node.quasi.quasis[i].value.raw, placeholder);
        }
        flattened.push(
          path.node.quasi.quasis[path.node.quasi.expressions.length].value.raw
        );
        const css = processor.process(flattened.join("")).css;
        const quasi = babel.types.templateLiteral(
          css.split(placeholder).map((css) =>
            babel.types.templateElement({
              raw: css,
              cooked: css,
            })
          ),
          path.node.quasi.expressions
        );
        path.get("quasi").replaceWith(quasi);
      },
    },
  };
};
