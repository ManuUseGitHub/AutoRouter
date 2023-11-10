"use strict";
exports.__esModule = true;
exports.VMI = exports.DEFAULT_MOPT_CONFIG = exports.MOPT_2_USER_ATTENTIONS = exports.MOPT_SORT = exports.BAD_REQUEST = exports.NOT_FOUND_CODE = void 0;
exports.NOT_FOUND_CODE = 404;
exports.BAD_REQUEST = 400;
exports.MOPT_SORT = ["sort", "no", ["asc", "dsc"]];
exports.MOPT_2_USER_ATTENTIONS = ["throw", "yell", "inform", "warn", "debug", "report"];
exports.DEFAULT_MOPT_CONFIG = {
    options: {
        misspelled: "ignore",
        mismatch: "ignore",
        mysterious: "ignore",
        mysteriousAffect: false
    }
};
// verbs methods interactions
exports.VMI = {
    inform: { interaction: "info", type: "INFO" },
    yell: { interaction: "error", type: "ERROR" },
    warn: { interaction: "warn", type: "WARNING" },
    debug: { interaction: "log", type: "DEBUG" }
};
