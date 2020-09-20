# babel-plugin-css-tag-postcss ![Travis build](https://travis-ci.org/fpipita/babel-plugin-css-tag-postcss.svg?branch=master)

If you build production apps and make use of the `css` tag function to style your `LitElement`-like webcomponents, this simple `Babel` plugin will come very handy as it will let you transform your css tagged templates by doing things like **adding vendor prefixes**, **minification** and all of the other stuff that can be achieved through `PostCSS` plugins.

For example, given the following:

```js
// input.js
import { LitElement, css, html } from "lit-element";

const sm_min = 600;

export class MyFoo extends LitElement {
  static get styles() {
    return css`
      @media (min-width: ${sm_min}px) {
        ::placeholder {
          color: red;
        }
      }
    `;
  }

  render() {
    return html`<input type="text" placeholder="Write something" />`;
  }
}
```

and assuming your `.postcssrc.json` (or any of the other config formats supported by the `postcss-load-config` package) contains:

```json
{
  "plugins": {
    "autoprefixer": {
      "overrideBrowserslist": ["edge 17, firefox 19, chrome 56"]
    }
  }
}
```

the plugin will output:

```js
// output.js
import { LitElement, css, html } from "lit-element";

const sm_min = 600;

export class MyFoo extends LitElement {
  static get styles() {
    return css`
      @media (min-width: ${sm_min}px) {
        ::-webkit-input-placeholder {
          color: gray;
        }
        ::-moz-placeholder {
          color: gray;
        }
        ::-ms-input-placeholder {
          color: gray;
        }
        ::placeholder {
          color: gray;
        }
      }
    `;
  }

  render() {
    return html`<input type="text" placeholder="Write something" />`;
  }
}
```

## Installation

```bash
$ npm install --save-dev @fpipita/babel-plugin-css-tag-postcss
```

You also need to have `@babel/core` and `postcss` packages installed and properly configured for your build process.

## Usage

In your babel configuration, simply add:

```json
{
  "plugins": [
    [
      "@fpipita/babel-plugin-css-tag-postcss",
      {
        "tag": "css"
      }
    ]
  ]
}
```

You can **optionally** specify the `tag` option, which is basically the name of the css tag function you use to define the css tagged templates in your code. It defaults to `css` so in most cases you can just forget about it.

The plugin will read and reuse your existing `PostCSS` configuration which can be expressed in any of the formats supported by the [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config#readme) package.

## Template literals with embedded expressions

Despite it is best to **avoid embedded expressions** and make use of `css custom variables` to make styles that can be configured at runtime ([read here why](https://lit-element.polymer-project.org/guide/styles#dynamic-classes-and-styles)), there are cases where you can't use css custom variables just because the css cascading model doesn't apply, like within the media query list part of a `@media` CSS at-rule.

When the plugin encounters an embedded expression, it keeps it in place:

```js
// input.js
css`
  @media (min-width: ${sm_min}px) {
    ::placeholder {
      color: gray;
    }
  }
`;

// output.js
css`
  @media (min-width: ${sm_min}px) {
    ::-webkit-input-placeholder {
      color: gray;
    }
    ::-moz-placeholder {
      color: gray;
    }
    ::-ms-input-placeholder {
      color: gray;
    }
    ::placeholder {
      color: gray;
    }
  }
`;
```

The next example is only shown with the purpose of explaining how the plugin behaves when an expression is encountered within a css rule which is expanded by PostCSS:

```js
// input.js
css`
  @media (min-width: 600px) {
    ::placeholder {
      // don't do this, use css custom variables e.g. color: var(--my-foo-placeholder-color)
      color: ${gray};
    }
  }
`;

// output.js
css`
  @media (min-width: 600px) {
    ::-webkit-input-placeholder {
      color: ${gray};
    }
    ::-moz-placeholder {
      color: ${gray};
    }
    ::-ms-input-placeholder {
      color: ${gray};
    }
    ::placeholder {
      color: ${gray};
    }
  }
`;
```

## Known limitations

Due to the sync nature of Babel plugins, only **sync** PostCSS plugins are supported.
