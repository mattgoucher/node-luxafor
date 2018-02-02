import {HID} from 'node-hid';
import hexToRGB from 'hex-rgb';
import colorMap from './colorMap';

const NIL = 0x00;

/**
 * Luxafor
 * @type {object}
 */
export default class Luxafor {

  constructor(pid = 62322, vid = 1240) {
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
    this.device = new HID(vid, pid);
  }

  /**
   * Reset the data for the instance
   * @returns {object} Instance
   */
  reset() {
    this.data = {};
    this.ledPositions = [];

    return this;
  }

  /**
   * Get timing bytes for writing
   * @param  {string} command Lighting command
   * @param  {number} [speed] Speed value 0-255
   * @param  {number} [repeat] Repeat value 0-255
   * @returns {array} Three timing bytes
   */
  getTiming(command, speed = 0, repeat = 0) {
    const timingBytes = {
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
   * @param   {string} [command] Lighting command
   * @param   {string} [position] Position to write to
   * @param   {number} [r] Red value 0-255
   * @param   {number} [g] Green value 0-255
   * @param   {number} [b] Blue value 0-255
   * @param   {number} [speed] How fast or slow to change 0-255
   * @param   {number} [repeat] value 0-255
   * @returns {object} Instance
   * TODO: Should pattern clear out command byte?
   */
  write({command = 'color', position = 'both', r = 0, g = 0, b = 0, pattern, speed, repeat}) {
    const secondByte = this.patterns[pattern] || this.positions[position];
    const baseBytes = [this.commands[command], secondByte, r, g, b];
    const timingBytes = this.getTiming(command, speed, repeat);

    this.device.write([
      ...baseBytes,
      ...timingBytes
    ]);

    return this;
  }

  /**
   * Write stored data to Luxafor
   * @returns {object} Instance
   */
  exec() {

    // Execute a single command
    if (!this.ledPositions.length) {
      return this
        .write(this.data)
        .reset();
    }

    // Execute for each LED
    this.ledPositions.forEach(led =>
      this.write({
        ...this.data,
        position: led
      })
    );

    return this.reset();
  }

  /**
   * Set Luxafor command mode
   * @param   {string} cmd Lighting command
   * @returns {object} Instance
   * TODO: Validate commands?
   */
  command(cmd) {
    this.data.command = cmd;
    return this;
  }

  /**
   * Set Luxafor color via rgb
   * @param  {number} r Red value 0-255
   * @param  {number} g Green value 0-255
   * @param  {number} b Blue value 0-255
   * @return {object} Instance
   */
  color(r = 0, g = 0, b = 0) {
    Object.assign(this.data, {r, g, b});
    return this;
  }

  hex(str) {
    const {red, green, blue} = hexToRGB(str);
    return this.color(red, green, blue);
  }

  /**
   * Fade to a color
   * @param  {number} r Red value 0-255
   * @param  {number} g Green value 0-255
   * @param  {number} b Blue value 0-255
   * @param  {number} speed Speed to fade 0-255 (fast -> slow)
   * @return {object} Instance
   */
  fade(r = 0, g = 0, b = 0, speed = 100) {
    Object.assign(this.data, {r, g, b, speed, command: 'fade'});
    return this;
  }

  /**
   * Set Luxafor color via html color names
   * @param  {string} color HTML color name
   * @return {object} Instance
   */
  colorName(color) {
    Object.assign(this.data, colorMap[color]);
    return this;
  }

  /**
   * Set Luxafor led position
   * @param  {string|number} position Specific LED 1-6 or named section
   * @return {object}        Instance
   */
  led(position) {
    this.data.position = position;
    return this;
  }

  /**
   * Set multiple Luxafor led positions
   * @param  {array}  positions Specific LED positions 1-6 or named section
   * @return {object} Instance
   * TODO: Validate LED positions exist?
   */
  leds(positions) {
    this.ledPositions = positions;
    return this;
  }

  /**
   * Set Luxafor pattern
   * @param  {string} name Name of pattern
   * @return {object} Instance
   */
  pattern(name) {
    this.data.pattern = name;
    this.data.command = 'pattern';
    return this;
  }
}
