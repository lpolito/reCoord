const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": "airbnb",
    "plugins": ["emotion", "react-hooks"],
    "rules": {
        ...parentConfig.rules,
        "jsx-a11y/click-events-have-key-events": 0,
        "react-hooks/rules-of-hooks": ["error"],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-one-expression-per-line": 0,
        "jsx-quotes":["error", "prefer-single"],
    },
    "globals": {
        "window": true,
        "document": true,
    },
};
