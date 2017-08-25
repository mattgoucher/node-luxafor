import {HID} from 'node-hid';

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
    this.device = new HID(vid, pid);
  }

  /**
   * Get timing bytes for writing
   * @author Josh Kloster <klosterjosh@gmail.com>
   * @param  {string} command Lighting command
   * @param  {number} speed Speed value 0-255
   * @param  {number} repeat Repeat value 0-255
   * @returns {array} Three timing bytes
   */
  getTiming(command, speed = 0, repeat = 0) {
    const timingBytes = {
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
  write(command = 'color', side = 'both', r, g, b, speed, repeat) {
    const baseBytes = [this.commands[command], this.sides[side], r, g, b];
    const timingBytes = this.getTiming(command, speed, repeat);

    this.device.write([
      ...baseBytes,
      ...timingBytes
    ]);

    return this;
  }

  /**
   * Change the Luxafor's color
   * @author Matt Goucher <matt@mattgoucher.com>
   * @param   {number} r Red value 0-255
   * @param   {number} g Green value 0-255
   * @param   {number} b Blue value 0-255
   * @param   {string} side Side to change
   * @param   {string} command Lighting mode
   * @returns {object} Instance
   */
  setColor(r, g, b, side, command) {
    this.write(command, side, r, g, b, NIL, NIL);
    return this;
  }

  /**
   * Fade to color
   * @author Matt Goucher <matthew.goucher@concur.com>
   * @param   {number} r Red value 0-255
   * @param   {number} g Green value 0-255
   * @param   {number} b Blue value 0-255
   * @param   {string} speed How fast or slow to change 0-255
   * @param   {string} side Side to change
   * @returns {object} Instance
   */
  fadeToColor(r, g, b, speed, side = 'both') {
    this.write('fade', side, r, g, b, speed, NIL);
    return this;
  }
}
