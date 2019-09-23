const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": ["airbnb", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "emotion", "react-hooks"],
    "rules": {
        "indent": ["error", 4],
        "import/prefer-default-export": 0,
        "object-curly-spacing": [2, "never"],
        "arrow-parens":["error", "always"],
        "prefer-destructuring": 0,
        "max-len": ["error", { "code": 120}],
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never"
        }],

        // React
        "jsx-a11y/click-events-have-key-events": 0,
        "react-hooks/rules-of-hooks": ["error"],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-filename-extension": [1, {extensions: [".jsx", ".tsx"]}],
        "jsx-quotes":["error", "prefer-single"],
        "react/prop-types": 0,

        // Typescript
        "@typescript-eslint/indent": [["error", 4], {SwitchCase: 0}],
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
