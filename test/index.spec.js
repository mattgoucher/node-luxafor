/* eslint-disable no-undef */
import Luxafor from '../src';

jest.mock('node-hid');

describe('Luxafor', () => {
  const setup = (...opts) => new Luxafor(...opts);

  describe('reset', () => {
    it('Should reset the data obj', () => {
      const instance = setup();
      const originalData = Object.assign({}, instance.data);

      instance
        .color(25, 50, 100)
        .reset();

      expect(
        instance.data
      ).toMatchObject(originalData);
    });
  });

  describe('getTiming', () => {
    const commands = ['color', 'fade', 'strobe', 'wave', 'pattern'];

    commands.forEach(command => {
      const instance = setup();

      it(`Should return timing values for ${command}`, () => {
        expect(
          instance.getTiming(command, 25, 40)
        ).toMatchSnapshot();
      });
    });

    it('Should pass 0\'s by default', () => {
      expect(
        setup()
          .getTiming('fade')
      ).toMatchSnapshot();
    });
  });

  describe('write', () => {
    it('Should turn off the light by default', () => {
      const instance = setup()
        .write({});

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });

    it('Should write bytes for a basic color change', () => {
      const instance = setup()
        .write({command: 'color', r: 200, g: 200, b: 200});

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });

    it('Should write bytes for a pattern', () => {
      const instance = setup()
        .write({pattern: 'police'});

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });

    it('Should write bytes for a fade to color', () => {
      const instance = setup()
        .write({command: 'fade', r: 200, g: 200, b: 200});

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });

  });

  describe('exec', () => {
    it('Should execute the write for only one led position', () => {
      const instance = setup()
        .color(0, 255, 0)
        .exec();

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });

    it('Should execute the write for only many led positions', () => {
      const instance = setup()
        .color(0, 255, 0)
        .leds([1, 2])
        .exec();

      expect(
        instance.device.data
      ).toMatchSnapshot();
    });
  });

  describe('command', () => {
    it('Should pass through the command value', () => {
      const instance = setup()
        .command('fugazi');

      expect(
        instance.data.command
      ).toEqual('fugazi');
    });
  });

  describe('color', () => {
    it('Should set the lights off by default', () => {
      const instance = setup()
        .color();

      expect(
        instance.data
      ).toMatchSnapshot();
    });

    it('Should set rgb values by default', () => {
      const instance = setup()
        .color(25, 50, 100);

      expect(
        instance.data
      ).toMatchSnapshot();
    });
  });

  describe('hex', () => {
    it('Should set rgb values by default', () => {
      const instance = setup()
        .hex('#FF0000');

      expect(
        instance.data
      ).toMatchSnapshot();
    });
  });

  describe('fade', () => {
    it('Should fade to 0 by default', () => {
      const instance = setup()
        .fade();

      expect(
        instance.data
      ).toMatchSnapshot();
    });

    it('Should set the rgb, and the fade duration', () => {
      const instance = setup()
        .fade(25, 50, 100, 200);

      expect(
        instance.data
      ).toMatchSnapshot();
    });
  });

  describe('colorName', () => {
    it('Should grab RGB values from colormap', () => {
      const instance = setup()
        .colorName('red');

      expect(
        instance.data
      ).toMatchSnapshot();
    });
  });

  describe('led', () => {
    it('Should set the led positions', () => {
      const instance = setup()
        .led(0x41);

      expect(
        instance.data.position
      ).toEqual(0x41);
    });
  });

  describe('leds', () => {
    it('Should set the led positions', () => {
      const instance = setup()
        .leds('fugazi');

      expect(
        instance.ledPositions
      ).toEqual('fugazi');
    });
  });

  describe('pattern', () => {
    const instance = setup()
      .pattern('fizz');

    it('Should set the pattern', () => {
      expect(
        instance.data.pattern
      ).toEqual('fizz');
    });

    it('Should set the command to pattern', () => {
      expect(
        instance.data.command
      ).toEqual('pattern');
    });
  });
});
