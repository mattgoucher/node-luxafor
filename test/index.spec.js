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

  describe('write', () => {
    it('Should return the instance', () => {
      const instance = setup();

      expect(
        instance.write({})
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
          b: 253
        })
      ).toMatchSnapshot();
    });
  });

  describe('setColor', () => {
    it('Should return the instance', () => {
      const instance = setup();

      expect(
        instance.write({})
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
