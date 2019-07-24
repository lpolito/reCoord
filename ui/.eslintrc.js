const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": ["airbnb", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "emotion", "react-hooks"],
    "rules": {
        ...parentConfig.rules,

        // React
        "jsx-a11y/click-events-have-key-events": 0,
        "react-hooks/rules-of-hooks": ["error"],
        "react/jsx-indent": parentConfig.rules.indent,
        "react/jsx-indent-props": parentConfig.rules.indent,
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-filename-extension": [1, {extensions: [".jsx", ".tsx"]}],
        "jsx-quotes":["error", "prefer-single"],
        "react/prop-types": 0,

        // Typescript
        "@typescript-eslint/indent": [...parentConfig.rules.indent, {SwitchCase: 0}],
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-object-literal-type-assertion": 0, // Try to get around this
    },
    "globals": {
        "window": true,
        "document": true,
    },
    settings: {
        'import/extensions': [".js",".jsx",".ts",".tsx"],
        'import/parsers': {
          '@typescript-eslint/parser': [".ts",".tsx"]
         },
         'import/resolver': {
             'node': {
                 'extensions': [".js",".jsx",".ts",".tsx"]
             }
         }
    }
};
