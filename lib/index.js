'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeHid = require('node-hid');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NIL = 0x00;

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

    this.patterns = {
      police: 5
    };

    // Grab device
    this.device = new _nodeHid.HID(vid, pid);
  }

  /**
   * Get timing bytes for writing
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string} command Lighting command
   * @param  {number} speed Speed value 0-255
   * @param  {number} repeat Repeat value 0-255
   * @returns {array} Three timing bytes
   */


  _createClass(Luxafor, [{
    key: 'getTiming',
    value: function getTiming(command) {
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var repeat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var timingBytes = {
        color: [NIL, NIL, NIL],
        fade: [speed, NIL, NIL],
        strobe: [speed, NIL, repeat],
        wave: [NIL, repeat, speed]
      };

      return timingBytes[command];
    }

    /**
     * Write to Luxafor
     * @author Matt Goucher <matt@mattgoucher.com>
     * @param   {string} command Lighting command
     * @param   {string} side Side to write to
     * @param   {number} r Red value 0-255
     * @param   {number} g Green value 0-255
     * @param   {number} b Blue value 0-255
     * @param   {number} speed How fast or slow to change 0-255
     * @param   {number} repeat value 0-255
     * @returns {object} Instance
     */

  }, {
    key: 'write',
    value: function write(_ref) {
      var _ref$command = _ref.command,
          command = _ref$command === undefined ? 'color' : _ref$command,
          _ref$side = _ref.side,
          side = _ref$side === undefined ? 'both' : _ref$side,
          _ref$r = _ref.r,
          r = _ref$r === undefined ? 0 : _ref$r,
          _ref$g = _ref.g,
          g = _ref$g === undefined ? 0 : _ref$g,
          _ref$b = _ref.b,
          b = _ref$b === undefined ? 0 : _ref$b,
          speed = _ref.speed,
          repeat = _ref.repeat;

      var baseBytes = [this.commands[command], this.sides[side], r, g, b];
      var timingBytes = this.getTiming(command, speed, repeat);

      this.device.write([].concat(baseBytes, _toConsumableArray(timingBytes)));

      return this;
    }

    /**
     * Change the Luxafor's color, instantly.
     * @author Matt Goucher <matt@mattgoucher.com>
     * @param   {number} r Red value 0-255
     * @param   {number} g Green value 0-255
     * @param   {number} b Blue value 0-255
     * @param   {string} side Side to change
     * @param   {string} command Lighting mode
     * @returns {object} Instance
     */

  }, {
    key: 'setColor',
    value: function setColor(r, g, b, side, command) {
      this.write({ command: command, side: side, r: r, g: g, b: b });
      return this;
    }

    /**
     * Change the Luxafor's color with fade transition
     * @author Matt Goucher <matthew.goucher@concur.com>
     * @param   {number} r Red value 0-255
     * @param   {number} g Green value 0-255
     * @param   {number} b Blue value 0-255
     * @param   {string} speed How fast or slow to change 0-255
     * @param   {string} side Side to change
     * @returns {object} Instance
     */

  }, {
    key: 'fadeToColor',
    value: function fadeToColor(r, g, b, speed) {
      var side = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'both';

      this.write({ command: 'fade', side: side, r: r, g: g, b: b, speed: speed });
      return this;
    }
  }]);

  return Luxafor;
}();

exports.default = Luxafor;
module.exports = exports['default'];