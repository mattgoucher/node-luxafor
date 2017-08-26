import {HID} from 'node-hid';
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

    // Grab device
    this.device = new HID(vid, pid);
  }

  /**
   * Get timing bytes for writing
   * @author Josh Kloster <klosterjosh@gmail.com>
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
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @returns {object} Instance
   */
  exec() {
    this.write(this.data);
    this.data = {};
    return this;
  }

  /**
   * Set Luxafor command mode
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param   {string} cmd Lighting command
   * @returns {object} Instance
   */
  command(cmd) {
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
  color(r, g, b) {
    Object.assign(this.data, {r, g, b});
    return this;
  }

  /**
   * Set Luxafor color via html color names
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string} color HTML color name
   * @return {object} Instance
   */
  colorName(color) {
    Object.assign(this.data, colorMap[color]);
    return this;
  }

  /**
   * Set Luxafor led position
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string|number} position Specific LED 1-6 or named section
   * @return {object} Instance
   */
  led(position) {
    this.data.position = position;
    return this;
  }

  /**
   * Set Luxafor pattern
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string} name Name of pattern
   * @return {object} Instance
   */
  pattern(name) {
    this.data.pattern = name;
    this.data.command = 'pattern';
    return this;
  }
}
