module.exports = {
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
        }]
    },
};
