"use strict";
exports.__esModule = true;
exports.MaskBuilder = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var defaultCall = function (key, previousKey, value) {
    return 0;
};
/**
 * Masks can be written following this format 11.1111.11 (with dots to avoid mistakes)
 * so it is necessary to strip all dots out of the masks so we can process them as real
 * masks
 * @param s
 * @returns
 */
var stripDots = function (s) { return s.replace(/[.]/g, ""); };
var substituteTwos = function (s) { return s.replace(/2/g, "1"); };
var MaskBuilder = /** @class */ (function () {
    function MaskBuilder() {
    }
    MaskBuilder.getInstance = function () {
        if (!MaskBuilder.instance) {
            MaskBuilder.instance = new MaskBuilder();
        }
        return MaskBuilder.instance;
    };
    /**
     * Gives a bit representation for every multiChoices option
     * @param object
     * @param row entry [optionName [,default][,multiChoices] ]
     * @param cpt counter
     * @param totalOffset totalizer of the offset
     */
    MaskBuilder.prototype.assignValuePerBit = function (modulopt, row, cpt, totalOffset) {
        if (row[2]) {
            // compute the current element offset by looking at the length of its 3rd collumn
            var offset = row[2].length;
            // the option name is in the first collumn
            var option = row[0];
            // initialisation on the object that will host the options
            modulopt.masks[option] = {};
            // for every option that is coded on multiple bit, we compute the range of bits that
            // it takes by using the incrementation
            for (var i = 0; i < offset; ++i) {
                // get the pow2 of the cpt value ==> to transform into binary representation
                var bit = Math.pow(2, cpt + i);
                // get the representation with dots every 4th digit
                var representation = this.formatedNumberRepresentation(bit, totalOffset);
                // undefined and function references cannot be added so we just tell what we were supposed to have
                if (typeof row[2][i] === "function" || row[2][i] === void 0) {
                    row[2][i] = (typeof row[2][i]).toUpperCase();
                }
                // assign the matching bit to the option coded on multiple bits
                modulopt.masks[option][representation] = row[2][i];
            }
        }
    };
    /**
     * Every option will occupied a certain amount of space as a bit reprensentation so to be sure nothing
     * overlaps, and mostly, have consistent zero-filled (padded) masks, we have to compute the total offset
     * @param optionVector
     * @returns
     */
    MaskBuilder.prototype.computeOffset = function (optionVector) {
        var offset = 0;
        optionVector
            .filter(function (row) { return (typeof row[1] === "boolean" && row.length === 2) || row[2]; })
            .map(function (row) {
            // sum an offset stored in a cell of an array (may not exist so fallback of 1)
            offset += row[2] ? row[2].length : 1;
        });
        // ceiled integer division multiplied by 4 so we have multiples of four. Perfect for bin reprsentation
        return Math.ceil(offset / 4) * 4;
    };
    /**
     * Transform a number into its sero filled dotted binary format. 1 => 0000.0000.0001
     *
     * @param optDef defines the default value for an option and its string masks
     * @param offset the offset teken by possible values of the mask in binary : 1 take , 0 leave
     * @param totalOffset indicate the whole space taken by all option mask + 0 fill included
     * @param cpt the general counter
     */
    MaskBuilder.prototype.assignMasks = function (optDef, totalOffset, cpt) {
        var representation = this.formatedNumberRepresentation(Math.pow(2, cpt), totalOffset);
        // (join every slices by a dot then push to the masks field)
        // [0000,0000,1000] => ["0000.0000.1000","0000.0001.0000"]
        if (representation !== "-1") {
            optDef.mask = representation;
        }
    };
    /**
     * Transforms a number value to its binary representation with 1 dot every 4th bit
     * @param value
     * @param totalOffset
     * @returns
     */
    MaskBuilder.prototype.formatedNumberRepresentation = function (value, totalOffset) {
        // transform the position on the iteration into a binary representation as it is a power of 2 bin
        // 2^(cpt+i) => 1, 2, 4, 8 =>  0 , 1 , 10 , 100 , 1000
        var binRep = this.dec2bin(value);
        // = for every 4 bit represented, add a dot so it is easier to manupulate as a human =
        // (division into array of strings) => 000000001000 => [0000,0000,1000]
        var sliceOfFour = this.pad(binRep, totalOffset).match(/.{1,4}/g);
        if (sliceOfFour) {
            return sliceOfFour.join(".");
        }
        return "-1";
    };
    MaskBuilder.prototype.defineInterval = function (row, cpt) {
        return typeof row[1] === "boolean" && row.length === 2
            ? [cpt]
            : row[2]
                ? [cpt, -1 + cpt + row[2].length]
                : [cpt];
    };
    MaskBuilder.prototype.getOptionsFromMask = function (modulopt, optionMask) {
        var _this = this;
        var options = {};
        var masks = this.masksMappedByName(modulopt.masks);
        Object.keys(masks).map(function (k) {
            options[k] = _this.chosenFromMask(modulopt, optionMask, k);
        });
        return options;
    };
    /**
     * Transforms decimal number into binary representation
     * @param dec
     * @returns
     */
    MaskBuilder.prototype.dec2bin = function (dec) {
        return (dec >>> 0).toString(2);
    };
    /**
     * Pads zero (zero fill a number). It provides a string since 0 before any number is not significant
     * @param num the number that has to gain the padding
     * @param size the offset of the resulting string
     * @returns
     */
    MaskBuilder.prototype.pad = function (num, size) {
        num = num.toString();
        while (num.length < size)
            num = "0" + num;
        return num;
    };
    MaskBuilder.prototype.masksMappedByName = function (masks, cb, previousKey) {
        if (cb === void 0) { cb = defaultCall; }
        if (previousKey === void 0) { previousKey = ""; }
        var mapped = {};
        for (var _i = 0, _a = Object.entries(masks); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value === "string" || previousKey) {
                mapped[value] = key;
                var result = cb(key, previousKey, value);
                if (result != 0) {
                    return result;
                }
            }
            else if (typeof value === "object") {
                mapped[key] = this.masksMappedByName(value, cb, key);
            }
        }
        return mapped;
    };
    MaskBuilder.prototype.applyMasks = function (masks, a, maskField) {
        var result = 0;
        var onAssociation = function (key, previousKey, value) {
            if (maskField === value || maskField === previousKey) {
                // the key is the actual mask
                var b = stripDots(key);
                // bitwise comparison on base 2
                result = parseInt(a, 2) & parseInt(b, 2);
                if (result != 0) {
                    return result;
                }
            }
            return 0;
        };
        // invert keys and values of the masks so we have option name as index of the object
        this.masksMappedByName(masks, onAssociation);
        return result;
    };
    /**
     * from a string mask containing 0 - 1 - 2, that produce an other mask;
     * "2" => "true":1 ... "1" => "false":0 ... "0" => default : "-"
     * @param setMask
     */
    MaskBuilder.prototype.guessMaskFromMask = function (setMask) {
        var result = [];
        var i = 0;
        setMask = stripDots(setMask);
        for (; i < setMask.length; ++i) {
            var c = setMask.charAt(i);
            result.push(c === "2" ? 1 : c === "1" ? 0 : "-");
        }
        return result.join("");
    };
    MaskBuilder.prototype.defineSortOption = function (modulopt, bit, maskField) {
        var offset = modulopt.optionsOffset;
        var representation = this.formatedNumberRepresentation(bit, offset);
        return modulopt.masks[maskField][representation];
    };
    MaskBuilder.prototype.defineBooleansOption = function (defaults, bit, option) {
        switch (bit) {
            case "1":
                return true;
            case "0":
                return false;
            default:
                return defaults[option];
        }
    };
    MaskBuilder.prototype.chosenFromMask = function (modulopt, setMask, maskField) {
        var a = substituteTwos(stripDots(setMask));
        var c = this.guessMaskFromMask(setMask);
        var result = this.applyMasks(modulopt.masks, a, maskField);
        if (result > 0) {
            var bitPosFromRight = Math.log2(result);
            var position = -1 + c.length - bitPosFromRight;
            var offset = modulopt.optionsOffset;
            var representation = this.formatedNumberRepresentation(result, offset);
            var booleanMask = modulopt.masks[representation];
            // does the result indicates a bit value that aims a boolean ?
            if (typeof booleanMask === "string") {
                var result_1 = this.defineBooleansOption(modulopt.defaults, c[position], booleanMask);
                return result_1;
            }
            else {
                // INFO: Treat non binar cases
                return this.defineSortOption(modulopt, result, maskField);
            }
        }
        var option = /[\d.]/g.test(maskField)
            ? modulopt.masks[maskField]
            : maskField;
        return modulopt.defaults[option];
    };
    return MaskBuilder;
}());
exports.MaskBuilder = MaskBuilder;
