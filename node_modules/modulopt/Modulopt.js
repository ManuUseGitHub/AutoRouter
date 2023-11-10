"use strict";
exports.__esModule = true;
exports.Modulopt = void 0;
var MaskBuilder_1 = require("./MaskBuilder");
var mb = MaskBuilder_1.MaskBuilder.getInstance();
var Modulopt = /** @class */ (function () {
    function Modulopt() {
    }
    Modulopt.getInstance = function () {
        if (!Modulopt.instance) {
            Modulopt.instance = new Modulopt();
        }
        return Modulopt.instance;
    };
    Modulopt.prototype.populateOptionsObjects = function (modulopt, definitions) {
        var _this = this;
        var maskKeys = Object.keys(modulopt.masks);
        var defKeys = Object.keys(definitions);
        defKeys.map(function (key) {
            modulopt.defaults[key] = definitions[key]["default"];
            if (definitions[key].mask) {
                _this.treatObjectWithMask(modulopt, definitions, key);
            }
            else if (!definitions[key].mask && !maskKeys.includes(key)) {
                _this.treatObjectWithoutMask(modulopt, definitions, key);
            }
        });
    };
    Modulopt.prototype.buildDefinition = function (modulopt, totalOffset, buildDef) {
        var _this = this;
        buildDef.optionVector.map(function (row) {
            if (row[2] !== undefined || typeof row[1] === "boolean") {
                _this.treatDefinitionsWithIntervals(modulopt, row, totalOffset, buildDef);
                // filter options without intervals or those that cannot have a binary representation
            }
            else if (1 <= row.length &&
                row.length <= 2 &&
                typeof row[1] !== "boolean") {
                _this.treatDefinitionsWithoutInterval(row, buildDef);
            }
        });
    };
    Modulopt.prototype.treatObjectWithMask = function (modulopt, definitions, key) {
        // add a mask to the IUseOption object
        var mask = definitions[key].mask;
        modulopt.masks[mask] = key;
        // add an entry to defaults
        modulopt.defaults[key] = definitions[key]["default"];
    };
    Modulopt.prototype.treatObjectWithoutMask = function (modulopt, definitions, key) {
        // add an entry to free options.
        modulopt.free[key] = { type: typeof definitions[key]["default"] };
    };
    Modulopt.prototype.treatDefinitionsWithIntervals = function (modulopt, row, totalOffset, buildDef) {
        var definitions = buildDef.definitions;
        // the option name is contained in the first cell
        var option = row[0];
        // if the second ceil contain a default that is a boolean, we asume that the offset is 1,
        // therefore the postion is cpt or the interval of cpt + offset
        var interval = mb.defineInterval(row, buildDef.cpt);
        // define the default and masks (just simple arrays either with just 1 or an interval)
        var maskDef = { "default": row[1] };
        // will write the masks property with good formated masks
        if (row.length === 2 && typeof row[1] === "boolean") {
            mb.assignMasks(maskDef, totalOffset, buildDef.cpt);
        }
        // will write the multiOptMasks property with good formated masks
        mb.assignValuePerBit(modulopt, row, buildDef.cpt, totalOffset);
        definitions[option] = maskDef;
        buildDef.cpt = interval[interval.length - 1] + 1; // the last element of the interval +1
    };
    /**
     * Help to build the definitions about available straight forward options and their defaults
     * @param row
     * @param buildDef parameter object that holds definitions and optionVector
     */
    Modulopt.prototype.treatDefinitionsWithoutInterval = function (row, buildDef) {
        var definitions = buildDef.definitions;
        // store the name of the option
        var option = row[0];
        // the default of the option is either the element 1 of the record or null if ther is no element 1
        var _default = typeof row[1] !== "undefined" ? row[1] : null;
        // create a new entry on the definitions object
        definitions[option] = { "default": _default };
    };
    return Modulopt;
}());
exports.Modulopt = Modulopt;
