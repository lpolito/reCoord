const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": "airbnb",
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "emotion", "react-hooks"],
    "rules": {
        ...parentConfig.rules,
        "jsx-a11y/click-events-have-key-events": 0,
        "react-hooks/rules-of-hooks": ["error"],
        "react/jsx-indent": parentConfig.rules.indent,
        "react/jsx-indent-props": parentConfig.rules.indent,
        "react/jsx-one-expression-per-line": 0,
        "jsx-quotes":["error", "prefer-single"],
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
