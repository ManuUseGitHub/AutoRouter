"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.reset = exports.stick = exports.optionize = void 0;
var prepare_1 = require("./prepare");
var apply_1 = require("./apply");
var optionize = function (object, optionVector, hint) {
    if (hint === void 0) { hint = false; }
    var result = (0, prepare_1.optionized)(object, (0, prepare_1.beforeOptionize)(object, optionVector), hint);
    return result;
};
exports.optionize = optionize;
var stick = function (object) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    return apply_1.stickOptions.apply(void 0, __spreadArray([object], options, false));
};
exports.stick = stick;
var reset = function (object) {
    object.modulopt.logs = [];
};
exports.reset = reset;
