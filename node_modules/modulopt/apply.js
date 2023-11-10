"use strict";
/* eslint-disable no-prototype-builtins */
exports.__esModule = true;
exports.fixOptions = exports.stickOptions = void 0;
var dialog_1 = require("./dialog");
var MaskBuilder_1 = require("./MaskBuilder");
var prepare_1 = require("./prepare");
var mb = MaskBuilder_1.MaskBuilder.getInstance();
var isSubObject = function (object1, object2) {
    for (var key in object2) {
        // stop if the key exists in the subobject but not in the main object
        if (object2.hasOwnProperty(key) && !object1.hasOwnProperty(key)) {
            if (typeof object2.key !== "function") {
                return false;
            }
        }
    }
    return true;
};
var fixOptions = function (object, options) {
    (0, prepare_1.prepareOptionObject)(object);
    if (object.modulopt) {
        Object.keys(options).map(function (key) {
            var value = options[key];
            if (object.options[key] === undefined) {
                (0, dialog_1.checkValidCall)({ data: object, key: key, kind: "options", value: value });
            }
            var handled = isMultiChoiceOptionsHandled(object, key, options);
            if (!handled) {
                // handle free options (default is null)
                if (object.modulopt.defaults[key] === null) {
                    // affect a value options[ key ] except if it is undefinied : fallbacks to null;
                    object.options[key] =
                        options[key] === undefined ? null : options[key];
                }
                else if (typeof object.modulopt.defaults[key] === typeof options[key]) {
                    object.options[key] = options[key];
                }
                else {
                    if (object.modulopt.config.options.mysterious !== "ignore") {
                        var refererObj = object.options[key];
                        var subObj = options[key];
                        if (!isSubObject(refererObj, subObj)) {
                            (0, dialog_1.checkValidCall)({ data: object, key: key, kind: "free", value: value });
                        }
                    }
                    if (object.modulopt.config.options.mysteriousAffect) {
                        object.options[key] = options[key];
                    }
                }
            }
        });
    }
};
exports.fixOptions = fixOptions;
var isMultiChoiceOptionsHandled = function (object, key, options) {
    var multiChoices = object.modulopt.masks[key];
    var value = options[key];
    if (multiChoices) {
        // if the value is one of the multiple choice options
        if (Object.values(multiChoices).includes(value)) {
            object.options[key] = options[key];
        }
        else {
            (0, dialog_1.checkValidCall)({ data: object, key: key, kind: "propositions", value: value });
        }
        return true;
    }
    return false;
};
var stickOptions = function (object) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    options
        .sort(function (a, b) { return (typeof a < typeof b ? 1 : -1); })
        .forEach(function (optSet) {
        if (typeof optSet === "string") {
            object.options = mb.getOptionsFromMask(object.modulopt, optSet);
        }
        else if (typeof optSet === "object") {
            fixOptions(object, optSet);
        }
    });
    return object;
};
exports.stickOptions = stickOptions;
