'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeHid = require('node-hid');

var _colorMap = require('./colorMap');

var _colorMap2 = _interopRequireDefault(_colorMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      wave: 4,
      pattern: 6
    };

    // Position colors can be applied
    this.positions = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      both: 0xff,
      back: 0x42,
      front: 0x41
    };

    this.patterns = {
      police: 5
    };

    // Data that will be passed to write on exec
    this.data = {};

    // Led positions to write to
    this.ledPositions = [];

    // Grab device
    this.device = new _nodeHid.HID(vid, pid);
  }

  /**
   * Get timing bytes for writing
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string} command Lighting command
   * @param  {number} [speed] Speed value 0-255
   * @param  {number} [repeat] Repeat value 0-255
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
        wave: [NIL, repeat, speed],
        pattern: [NIL, NIL, NIL]
      };

      return timingBytes[command];
    }

    /**
     * Write to Luxafor
     * @author Matt Goucher <matt@mattgoucher.com>
     * @param   {string} [command] Lighting command
     * @param   {string} [position] Position to write to
     * @param   {number} [r] Red value 0-255
     * @param   {number} [g] Green value 0-255
     * @param   {number} [b] Blue value 0-255
     * @param   {number} [speed] How fast or slow to change 0-255
     * @param   {number} [repeat] value 0-255
     * @returns {object} Instance
     */

  }, {
    key: 'write',
    value: function write(_ref) {
      var _ref$command = _ref.command,
          command = _ref$command === undefined ? 'color' : _ref$command,
          _ref$position = _ref.position,
          position = _ref$position === undefined ? 'both' : _ref$position,
          _ref$r = _ref.r,
          r = _ref$r === undefined ? 0 : _ref$r,
          _ref$g = _ref.g,
          g = _ref$g === undefined ? 0 : _ref$g,
          _ref$b = _ref.b,
          b = _ref$b === undefined ? 0 : _ref$b,
          pattern = _ref.pattern,
          speed = _ref.speed,
          repeat = _ref.repeat;

      var secondByte = this.patterns[pattern] || this.positions[position];
      var baseBytes = [this.commands[command], secondByte, r, g, b];
      var timingBytes = this.getTiming(command, speed, repeat);
      this.device.write([].concat(baseBytes, _toConsumableArray(timingBytes)));

      return this;
    }

    /**
     * Write stored data to Luxafor
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @returns {object} Instance
     */

  }, {
    key: 'exec',
    value: function exec() {
      var _this = this;

      if (this.ledPositions.length > 0) {
        this.ledPositions.forEach(function (led) {
          _this.write(Object.assign(_this.data, { position: led }));
        });
      } else {
        this.write(Object.assign(this.data));
      }

      this.data = {};
      this.ledPositions = [];
      return this;
    }

    /**
     * Set Luxafor command mode
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param   {string} cmd Lighting command
     * @returns {object} Instance
     */

  }, {
    key: 'command',
    value: function command(cmd) {
      this.data.command = cmd;
      return this;
    }

    /**
     * Set Luxafor color via rgb
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param  {number} r Red value 0-255
     * @param  {number} g Green value 0-255
     * @param  {number} b Blue value 0-255
     * @return {object} Instance
     */

  }, {
    key: 'color',
    value: function color(r, g, b) {
      Object.assign(this.data, { r: r, g: g, b: b });
      return this;
    }

    /**
     * Set Luxafor color via html color names
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param  {string} color HTML color name
     * @return {object} Instance
     */

  }, {
    key: 'colorName',
    value: function colorName(color) {
      Object.assign(this.data, _colorMap2.default[color]);
      return this;
    }

    /**
     * Set Luxafor led position
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param  {string|number} position Specific LED 1-6 or named section
     * @return {object}        Instance
     */

  }, {
    key: 'led',
    value: function led(position) {
      this.data.position = position;
      return this;
    }

    /**
     * Set multiple Luxafor led positions
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param  {array}  positions Specific LED positions 1-6 or named section
     * @return {object} Instance
     */

  }, {
    key: 'leds',
    value: function leds(positions) {
      this.ledPositions = positions;
      return this;
    }

    /**
     * Set Luxafor pattern
     * @author Josh Kloster <klosterjosh@gmail.com>
     * @param  {string} name Name of pattern
     * @return {object} Instance
     */

  }, {
    key: 'pattern',
    value: function pattern(name) {
      this.data.pattern = name;
      this.data.command = 'pattern';
      return this;
    }
  }]);

  return Luxafor;
}();

exports.default = Luxafor;
module.exports = exports['default'];