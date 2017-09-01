import {HID} from 'node-hid';
import colorMap from './colorMap';

const NIL = 0x00;

/**
 * Check if array contains valid (0-255) input
 * @param  {array} nums Array of values
 * @returns {bool} True if any values in array are invalid
 */
function invalidNums(nums) {
  return nums.some(num =>
    !Number.isInteger(num) || num < 0 || num > 255
  );
}

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

  validate() {
    const { r, g, b, speed, command, repeat, pattern } = this.data;

    if (command && !this.commands[command]) {
      throw new Error(`Specified command: ${command} is invalid`);
    }

    if (invalidNums([r || 0, g || 0, b || 0])) {
      throw new Error(`Specified colors: ${[r, g, b]} are invalid`);
    }

    if (invalidNums([speed || 0, repeat || 0])) {
      throw new Error(`Specified timing numbers: ${[speed, repeat]} are invalid`);
    }

    if (!Array.isArray(this.ledPositions)) {
      throw new Error(`Specified leds: ${this.ledPositions} must be an Array`);
    }

    if (pattern && !this.patterns[pattern]) {
      throw new Error(`Specified pattern: ${pattern} is invalid`);
    }

    this.ledPositions.forEach(position => {
      if (!this.positions[position]) {
        throw new Error(`Specified led: ${position} is invalid`);
      }
    });

    return this;
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
    this.validate();

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
    if (this.ledPositions.length) {
      this.ledPositions.forEach(led =>
        this.write({
          ...this.data,
          position: led
        })
      );
    } else {
      this.write({ ...this.data });
    }

    return this.reset();
  }

  /**
   * Set Luxafor command mode
   * @param   {string} cmd Lighting command
   * @returns {object} Instance
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
    if (!colorMap[color]) {
      throw new Error(`Specified colorName: ${color} is invalid`);
    }

    Object.assign(this.data, colorMap[color]);
    return this;
  }

  /**
   * Set Luxafor led position
   * @param  {string|number} position Specific LED 1-6 or named section
   * @return {object}        Instance
   */
  led(position) {
    this.ledPositions.push(position);
    return this;
  }

  /**
   * Set multiple Luxafor led positions
   * @param  {array}  positions Specific LED positions 1-6 or named section
   * @return {object} Instance
   */
  leds(positions) {
    positions.forEach(position => {
      this.led(position);
    });

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
