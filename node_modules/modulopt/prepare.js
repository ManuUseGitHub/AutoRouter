"use strict";
exports.__esModule = true;
exports.optionized = exports.beforeOptionize = exports.prepareOptionObject = exports.sortEntries = void 0;
var apply_1 = require("./apply");
var dialog_1 = require("./dialog");
var MaskBuilder_1 = require("./MaskBuilder");
var Modulopt_1 = require("./Modulopt");
var moptConstants_1 = require("./moptConstants");
var mopt = Modulopt_1.Modulopt.getInstance();
var mb = MaskBuilder_1.MaskBuilder.getInstance();
var optionized = function (object, beforeOptionizeObject, hint) {
    if (hint === void 0) { hint = false; }
    var definitions = {};
    var optionVector = beforeOptionizeObject.optionVector, totalOffset = beforeOptionizeObject.totalOffset;
    var buildDef = { cpt: 0, optionVector: optionVector, definitions: definitions };
    mopt.buildDefinition(object.modulopt, totalOffset, buildDef);
    mopt.populateOptionsObjects(object.modulopt, definitions);
    object.options = Object.assign({}, object.modulopt.defaults);
    (0, dialog_1.hintDefinitions)(object, hint);
    return object;
};
exports.optionized = optionized;
var fetchModuloptConfig = function () {
    var onMissingDo = [
        "ignore", moptConstants_1.MOPT_2_USER_ATTENTIONS,
    ];
    return [
        ["mismatch"].concat(onMissingDo),
        ["misspelled"].concat(onMissingDo),
        ["mysterious"].concat(onMissingDo),
        ["mysteriousAffect", false],
        moptConstants_1.MOPT_SORT
    ];
};
var fixModuloptConfig = function (object, optionVector) {
    var foundConfigIndex = -1;
    optionVector.forEach(function (e, i) {
        if (e[0] === "modulopt") {
            foundConfigIndex = i;
            return;
        }
    });
    if (foundConfigIndex !== -1) {
        (0, apply_1.stickOptions)(object, optionVector[foundConfigIndex][1]);
        optionVector.splice(foundConfigIndex, 1);
    }
};
var addModuloptConfig = function (object) {
    // set a vector containing only modulopt config;
    var moduloptVector = fetchModuloptConfig();
    object.modulopt.config = {};
    var isConfig = true;
    var configured = beforeOptionize(object.modulopt.config, moduloptVector, isConfig);
    optionized(object.modulopt.config, configured);
};
var beforeOptionize = function (object, optionVector, isConfig) {
    if (isConfig === void 0) { isConfig = false; }
    object.modulopt = {};
    if (!isConfig) {
        addModuloptConfig(object);
        object.modulopt.logs = [];
        fixModuloptConfig(object.modulopt.config, optionVector);
    }
    var sortedVector = sortEntries(object.modulopt.config, optionVector);
    // used to define the size of masks
    var totalOffset = mb.computeOffset(sortedVector);
    object.modulopt.optionsOffset = totalOffset;
    // initialize the different object to attach to the IUseOption object
    object.modulopt.masks = {};
    object.modulopt.free = {};
    object.modulopt.defaults = {};
    return { optionVector: sortedVector, totalOffset: totalOffset };
};
exports.beforeOptionize = beforeOptionize;
var prepareOptionObject = function (object) {
    if (!object.options) {
        object.options = Object.assign({}, object.modulopt.defaults);
    }
    else {
        // use the copy of the current state of the options
        object.options = Object.assign({}, object.options);
    }
};
exports.prepareOptionObject = prepareOptionObject;
var sortEntries = function (config, optionVector) {
    var sortFunction = function (a, b) {
        var result = a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
        return result;
    };
    if (config && config.options.sort !== "no") {
        if (config.options.sort === "asc") {
            return optionVector.sort(sortFunction);
        }
        else if (config.options.sort === "dsc") {
            return optionVector.sort(sortFunction).reverse();
        }
    }
    return optionVector;
};
exports.sortEntries = sortEntries;
