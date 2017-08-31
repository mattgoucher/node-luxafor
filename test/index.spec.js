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
        .command('color');

      expect(
        instance.data.command
      ).toEqual('color');
    });

    it('Should throw on invalid command', () => {
      const instance = setup();

      expect(() => {
        instance.command('foo');
      }).toThrow('Specified command: foo is invalid');
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

    it('Should throw on invalid colors', () => {
      const instance = setup();

      expect(() => {
        instance.color(-1, 3, 256);
      }).toThrow('Specified values: -1,3,256 are invalid');
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

    it('Should throw on invalid colors/speed', () => {
      const instance = setup();

      expect(() => {
        instance.fade(1, 1, 1, 'foo');
      }).toThrow('Specified values: 1,1,1,foo are invalid');
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

    it('Should throw on invalid colorName', () => {
      const instance = setup();

      expect(() => {
        instance.colorName('foo');
      }).toThrow('Specified colorName: foo is invalid');
    });
  });

  describe('led', () => {
    it('Should set the led positions', () => {
      const instance = setup()
        .led(1);

      expect(
        instance.ledPositions
      ).toEqual([1]);
    });

    it('Should throw on invalid led position', () => {
      const instance = setup();
      const invalid = [-1, 7, 'test'];

      invalid.forEach(val => {
        expect(() => {
          instance.led(val);
        }).toThrow(`Specified led: ${val} is invalid`);
      });
    });
  });

  describe('leds', () => {
    it('Should set the led positions', () => {
      const instance = setup()
        .leds([1, 2, 3]);

      expect(
        instance.ledPositions
      ).toEqual([1, 2, 3]);
    });

    it('Should throw on invalid led positions', () => {
      const instance = setup();

      expect(() => {
        instance.leds([1, 2, -1]);
      }).toThrow('Specified led: -1 is invalid');
    });

    it('Should throw on non Array passed in', () => {
      const instance = setup();
      const invalid = ['foo', 1, undefined, NaN, {foo: 'bar'}];

      invalid.forEach(val => {
        expect(() => {
          instance.leds(val);
        }).toThrow(`Specified leds: ${val} must be an Array`);
      });
    });
  });

  describe('pattern', () => {
    it('Should set the pattern', () => {
      const instance = setup()
        .pattern('police');

      expect(
        instance.data.pattern
      ).toEqual('police');
    });

    it('Should set the command to pattern', () => {
      const instance = setup()
        .pattern('police');

      expect(
        instance.data.command
      ).toEqual('pattern');
    });

    it('Should throw on invalid pattern', () => {
      const instance = setup();

      expect(() => {
        instance.pattern('foo');
      }).toThrow('Specified pattern: foo is invalid');
    });
  });
});
