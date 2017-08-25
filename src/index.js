import {HID} from 'node-hid';

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
   * Write to Luxafor
   * @author Matt Goucher <matthew.goucher@concur.com>
   * @param   {string} command Lighting command
   * @param   {string} side Side to write to
   * @param   {number} r Red value 0-255
   * @param   {number} g Green value 0-255
   * @param   {number} b Blue value 0-255
   * @returns {object} Instance
   */
  write({command, side, r, g, b}) {
    this.device.write([this.commands[command], this.sides[side], r, g, b]);
    return this;
  }

  /**
   * Change the Luxafor's color
   * @author Matt Goucher <matthew.goucher@concur.com>
   * @param   {number} r Red value 0-255
   * @param   {number} g Green value 0-255
   * @param   {number} b Blue value 0-255
   * @param   {string} side Side to change
   * @param   {string} command Lighting mode
   * @returns {object} Instance
   */
  setColor(r, g, b, side = 'both', command = 'color') {
    this.write({command, side, r, g, b});
    return this;
  }

}
