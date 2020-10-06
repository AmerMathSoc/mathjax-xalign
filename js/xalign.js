"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XalignConfiguration = exports.XalignArrayItem = void 0;
var BaseItems_1 = require("mathjax-full/js/input/tex/base/BaseItems");
var ParseUtil_1 = require("mathjax-full/js/input/tex/ParseUtil");
var ParseMethods_1 = require("mathjax-full/js/input/tex/ParseMethods");
var Configuration_1 = require("mathjax-full/js/input/tex/Configuration");
var TexError_1 = require("mathjax-full/js/input/tex/TexError");
var SymbolMap_1 = require("mathjax-full/js/input/tex/SymbolMap");
var XalignArrayItem = (function (_super) {
    __extends(XalignArrayItem, _super);
    function XalignArrayItem(factory, name, numbered, padded, center) {
        var _this = _super.call(this, factory) || this;
        _this.name = name;
        _this.numbered = numbered;
        _this.padded = padded;
        _this.center = center;
        _this.maxrow = 0;
        return _this;
    }
    Object.defineProperty(XalignArrayItem.prototype, "kind", {
        get: function () {
            return 'XalignArray';
        },
        enumerable: false,
        configurable: true
    });
    XalignArrayItem.prototype.EndRow = function () {
        var cell;
        var row = this.row;
        this.row = [];
        if (this.padded) {
            this.row.push(this.create('node', 'mtd'));
        }
        while ((cell = row.shift())) {
            this.row.push(cell);
            cell = row.shift();
            if (cell)
                this.row.push(cell);
            if (row.length || this.padded) {
                this.row.push(this.create('node', 'mtd'));
            }
        }
        if (this.row.length > this.maxrow)
            this.maxrow = this.row.length;
        _super.prototype.EndRow.call(this);
    };
    XalignArrayItem.prototype.EndTable = function () {
        _super.prototype.EndTable.call(this);
        if (this.center) {
            var def = this.arraydef;
            if (this.maxrow <= 2)
                delete def.width;
            def.columnalign = def.columnalign
                .split(/ /)
                .slice(0, this.maxrow)
                .join(' ');
            def.columnwidth = def.columnwidth
                .split(/ /)
                .slice(0, this.maxrow)
                .join(' ');
        }
    };
    return XalignArrayItem;
}(BaseItems_1.ArrayItem));
exports.XalignArrayItem = XalignArrayItem;
var XalignMethods = {};
XalignMethods.XalignAt = function (parser, begin, numbered, padded) {
    var arg = parser.GetArgument('\\begin{' + begin.getName() + '}');
    if (arg.match(/[^0-9]/)) {
        throw new TexError_1.default('PositiveIntegerArg', 'Argument to %1 must me a positive integer', '\\begin{' + begin.getName() + '}');
    }
    var n = parseInt(arg, 10);
    var align = [];
    var width = [];
    if (padded) {
        align.push('');
        width.push('');
    }
    while (n > 0) {
        align.push('rl');
        width.push('auto auto');
        n--;
    }
    if (padded) {
        align.push('');
        width.push('');
    }
    return XalignMethods.XalignArray(parser, begin, numbered, padded, false, align.join('c'), width.join(' fit '));
};
XalignMethods.XalignArray = function (parser, begin, numbered, padded, center, align, width) {
    parser.Push(begin);
    ParseUtil_1.default.checkEqnEnv(parser);
    align = align
        .split('')
        .join(' ')
        .replace(/r/g, 'right')
        .replace(/l/g, 'left')
        .replace(/c/g, 'center');
    var item = parser.itemFactory.create('XalignArray', begin.getName(), numbered, padded, center, parser.stack);
    item.arraydef = {
        width: '100%',
        displaystyle: true,
        columnalign: align,
        columnspacing: '0em',
        columnwidth: width,
        rowspacing: '3pt',
        side: parser.options['tagSide'],
        minlabelspacing: parser.options['tagIndent']
    };
    return item;
};
new SymbolMap_1.EnvironmentMap('Xalign-environment', ParseMethods_1.default.environment, {
    xalignat: ['XalignAt', null, true, true],
    'xalignat*': ['XalignAt', null, false, true],
    xxalignat: ['XalignAt', null, true, false],
    'xxalignat*': ['XalignAt', null, false, false],
    flalign: [
        'XalignArray',
        null,
        true,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
    ],
    'flalign*': [
        'XalignArray',
        null,
        false,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
    ]
}, XalignMethods);
exports.XalignConfiguration = Configuration_1.Configuration.create('xalign', {
    handler: {
        environment: ['Xalign-environment']
    },
    items: (_a = {}, _a[XalignArrayItem.prototype.kind] = XalignArrayItem, _a)
});
//# sourceMappingURL=xalign.js.map