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

    // Grab device
    this.device = new HID(vid, pid);
  }

  write({command, side, r, g, b}) {
    this.device.write([this.commands[command], this.sides[side], r, g, b])
  }

  setColor(r, g, b, side = 'both') {
    this.write({command: 'color', side, r, g, b});
    return this;
  }

}