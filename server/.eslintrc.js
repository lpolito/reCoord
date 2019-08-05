const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": ["airbnb-base", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "rules": {
        ...parentConfig.rules,

        // Typescript
        "@typescript-eslint/indent": [...parentConfig.rules.indent, {SwitchCase: 0}],
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-object-literal-type-assertion": 0, // Try to get around this
    },
    "globals": {
        "window": false,
        "document": false,
    },
    settings: {
        'import/extensions': [".js", ".ts"],
        'import/parsers': {
          '@typescript-eslint/parser': [".ts"]
         },
         'import/resolver': {
             'node': {
                 'extensions': [".js", ".ts"]
             }
         }
    }
};
