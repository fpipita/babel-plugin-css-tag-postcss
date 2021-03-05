const babel = require("@babel/core");
const postcss = require("postcss");
const postcssrc = require("postcss-load-config");

const { plugins } = postcssrc.sync();
// @ts-ignore
const processor = postcss(plugins);

/**
 * @param {Map<string, import("@babel/core").types.Expression | import("@babel/core").types.TSType>} expressionsById
 * @returns {string}
 */
function generateExpressionId(expressionsById) {
  const id = `postcss-${Math.random().toString(16).slice(2)}`;
  if (expressionsById.has(id)) {
    return generateExpressionId(expressionsById);
  }
  return id;
}

/**
 * @returns {import("@babel/core").PluginObj<import("../types").BabelPluginCssTagPostcssPluginPass>}
 */
const plugin = () => {
  return {
    name: "babel-plugin-css-tag-postcss",
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (!path.get("tag").isIdentifier({ name: state.opts.tag ?? "css" })) {
          return;
        }
        /**
         * @type {string[]}
         */
        const flattened = [];
        /**
         * @type {Map<string, import("@babel/core").types.Expression | import("@babel/core").types.TSType>}
         */
        const expressionsById = new Map();
        for (let i = 0; i < path.node.quasi.expressions.length; i++) {
          const id = generateExpressionId(expressionsById);
          flattened.push(path.node.quasi.quasis[i].value.raw, id);
          expressionsById.set(id, path.node.quasi.expressions[i]);
        }
        flattened.push(
          path.node.quasi.quasis[path.node.quasi.expressions.length].value.raw
        );
        const css = processor.process(flattened.join("")).css;
        /**
         * @type {string[]}
         */
        const quasis = [];
        /**
         * @type {(import("@babel/core").types.Expression | import("@babel/core").types.TSType)[]}
         */
        const expressions = [];
        let iterator = css;
        for (const [id, expr] of expressionsById.entries()) {
          for (
            let i = iterator.indexOf(id);
            i !== -1;
            iterator = iterator.substring(i + id.length),
              i = iterator.indexOf(id)
          ) {
            const quasi = iterator.substring(0, i);
            quasis.push(quasi);
            expressions.push(expr);
          }
        }
        quasis.push(iterator);
        const quasi = babel.types.templateLiteral(
          quasis.map((quasi) =>
            babel.types.templateElement({
              raw: quasi,
              cooked: quasi,
            })
          ),
          expressions
        );
        path.get("quasi").replaceWith(quasi);
      },
    },
  };
};

module.exports = plugin;
