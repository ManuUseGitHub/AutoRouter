"use strict";
exports.__esModule = true;
exports.checkValidCall = exports.hintDefinitions = void 0;
var moptConstants_1 = require("./moptConstants");
var dateNTime = require("date-and-time");
var hintDefinitions = function (object, hint) {
    if (hint) {
        var stringify = require("json-stringify-pretty-compact");
        var colorizeJson = require("json-colorizer");
        console.log("modulopt configuration for the instance of \"" + object.constructor.name + "\" (class) :\n", colorizeJson(stringify(object.modulopt)));
    }
    return object;
};
exports.hintDefinitions = hintDefinitions;
var getNowString = function (date, format) {
    if (format === void 0) { format = "hh:mm A [GMT]Z"; }
    return dateNTime.format(date, format);
};
var checkValidCall = function (check) {
    var data = check.data, kind = check.kind;
    var config = data.modulopt.config !== undefined
        ? data.modulopt.config
        : moptConstants_1.DEFAULT_MOPT_CONFIG;
    var moduloptConfig = config.options;
    var verb = "UNKNOWN";
    switch (kind) {
        case "options":
            verb = moduloptConfig.mismatch;
            break;
        case "propositions":
            verb = moduloptConfig.misspelled;
            break;
        case "free":
            verb = moduloptConfig.mysterious;
            break;
        default:
            throw "MODULOPT EXCEPTION c400. Unknown interraction kind. Specify either options, propositions or free";
    }
    var message = constructMessage(check, verb);
    interactOnVerb(check, verb, message);
};
exports.checkValidCall = checkValidCall;
var interactOnVerb = function (check, verb, message) {
    if (verb === "throw") {
        throw message;
    }
    else if (verb !== "ignore" && verb !== "report") {
        console[moptConstants_1.VMI[verb].interaction](message);
    }
    else if (verb === "report") {
        onShouldReport(check, message);
    }
};
var constructMessage = function (check, verb) {
    var data = check.data, key = check.key, kind = check.kind, value = check.value;
    var messageParts = ["MODULOPT UKNOWN"];
    var singularKind = kind.replace(/s$/g, "");
    messageParts.push(kind == "options"
        ? "c" + moptConstants_1.NOT_FOUND_CODE + ". Non existing " + singularKind + " [" + key + "] on"
        : kind == "propositions"
            ? "c" + moptConstants_1.BAD_REQUEST + ". Invalid " + singularKind + " [" + value + "] for [" + key + "] option on"
            : "c" + moptConstants_1.BAD_REQUEST + ". Invalid " + singularKind + " value [" + value + "] for the " + singularKind + " [" + key + "] option on");
    messageParts.push("[" + data.constructor.name + "] object");
    if (verb === "throw") {
        messageParts[0] = "MODULOPT EXCEPTION";
    }
    else if (verb !== "ignore" && verb !== "report") {
        messageParts[0] = "MODULOPT " + moptConstants_1.VMI[verb].type;
    }
    else if (verb === "report") {
        messageParts[0] = "MODULOPT REPORT MISMATCH";
        messageParts = ["[" + getNowString(new Date()) + "]"].concat(messageParts);
    }
    return messageParts.join(" ");
};
var onShouldReport = function (check, message) {
    var time = new Date();
    var log = {
        timestamp: time.getTime(),
        message: message,
        // so you can get the stacktrace
        exception: new Error(message),
        // the code is get from the message. It is formated la this (with a dot at the end) : cXXX.
        code: parseInt(/c([\d]+)\./.exec(message)[1]),
        // can help figuring the error out
        changes: [
            "These changes lead to the orror:",
            check.data.options[check.key],
            ">>>>>",
            check.value,
        ]
    };
    check.data.modulopt.logs.push(log);
};
