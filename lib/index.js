'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeHid = require('node-hid');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Luxafor
 * @type {object}
 */
var Luxafor = function () {
  function Luxafor() {
    var pid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 62322;
    var vid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1240;

    _classCallCheck(this, Luxafor);

    this.pid = pid;
    this.vid = vid;

    // Modes to change color in
    this.commands = {
      color: 1,
      fade: 2,
      strobe: 3,
      wave: 4
    };

    // Sides color can be applied
    this.sides = {
      both: 0xff,
      back: 0x42,
      front: 0x41
    };

    // Grab device
    this.device = new _nodeHid.HID(vid, pid);
  }

  _createClass(Luxafor, [{
    key: 'write',
    value: function write(_ref) {
      var command = _ref.command,
          side = _ref.side,
          r = _ref.r,
          g = _ref.g,
          b = _ref.b;

      this.device.write([this.commands[command], this.sides[side], r, g, b]);
    }
  }, {
    key: 'setColor',
    value: function setColor(r, g, b) {
      var side = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'both';

      this.write({ command: 'color', side: side, r: r, g: g, b: b });
      return this;
    }
  }]);

  return Luxafor;
}();

exports.default = Luxafor;
module.exports = exports['default'];