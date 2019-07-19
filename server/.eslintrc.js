const parentConfig = require('../eslint-rules');

module.exports = {
    "extends": "airbnb-base",
    "rules": parentConfig.rules,
    "globals": {
        "window": false,
        "document": false,
    },
};
