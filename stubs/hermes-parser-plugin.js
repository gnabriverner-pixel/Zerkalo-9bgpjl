// Stub for babel-plugin-syntax-hermes-parser
// Required when the native Hermes binary is not available in the Metro worker environment.
// Must export a valid Babel plugin factory — not an empty object.
'use strict';

module.exports = function hermesParserPluginStub() {
  return {
    parserOverride: function (code, opts, parse) {
      return parse(code, opts);
    },
  };
};
