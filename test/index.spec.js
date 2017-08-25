/* eslint-disable no-undef */
import Luxafor from '../src';

jest.mock('node-hid');

describe('Luxafor', () => {
  const setup = (...opts) => new Luxafor(...opts);

  it('Should use default pid and vid', () => {
    const instance = setup();

    expect({
      pid: instance.pid,
      vid: instance.vid
    }).toMatchSnapshot();
  });

  it('Should expose commands', () => {
    const instance = setup();

    expect(
      instance.commands
    ).toMatchSnapshot();
  });

  describe('getTiming', () => {
    it('Should return the proper timing bytes', () => {
      const instance = setup();
      const commands = Object.keys(instance.commands);
      const timingBytes = {
        color: [0, 0, 0],
        fade: [1, 0, 0],
        strobe: [1, 0, 2],
        wave: [0, 2, 1]
      };

      commands.forEach(command => {
        expect(
          instance.getTiming({
            command,
            speed: 1,
            repeat: 2
          })
        ).toEqual(timingBytes[command]);
      });
    });
  });

  describe('write', () => {
    it('Should return the instance', () => {
      const instance = setup();

      expect(
        instance.write({
          command: 'strobe',
          side: 'front',
          r: 255,
          g: 254,
          b: 253,
          speed: 252,
          repeat: 251
        })
      ).toMatchObject(instance);
    });

    it('Should write to the device', () => {
      const instance = setup();

      expect(
        instance.write({
          command: 'strobe',
          side: 'front',
          r: 255,
          g: 254,
          b: 253,
          speed: 252,
          repeat: 251
        })
      ).toMatchSnapshot();
    });
  });

  describe('setColor', () => {
    it('Should return the instance', () => {
      const instance = setup();

      expect(
        instance.setColor(255, 254, 253)
      ).toMatchObject(instance);
    });

    it('Write args', () => {
      const instance = setup();

      expect(
        instance.setColor(255, 254, 253)
      ).toMatchSnapshot();
    });
  });

});
