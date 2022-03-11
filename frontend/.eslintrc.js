module.exports = {
  env: {
    "browser": true,
    "node": true,
    "es6": true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    "ecmaFeatures": {
      "jsx": true
  }
  },
  globals: {
    "cy": "readonly",
    "describe": "readonly",
    "it": "readonly",
    "expect": "readonly",
    "jest": "readonly"
  },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended"
  ],
  plugins: [
    "react",
    "react-hooks"
  ],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "no-shadow": ["warn", { "builtinGlobals": false, "hoist": "functions", "allow": ["resolve", "reject", "done"] }],
    "block-scoped-var": "warn",
    "consistent-return": "warn",
    "react/forbid-component-props": "warn",
    "react/forbid-dom-props": "warn",
    "react/no-access-state-in-setstate": "warn",
    "react/no-array-index-key": "warn",
    "react/jsx-no-bind": "warn",
    "no-inner-declarations": "off",
    "no-unused-vars": ["error", { "ignoreRestSiblings": true }]
  }
}