# node-luxafor

> Control your [Luxafor](http://luxafor.com/) light

[![CircleCI](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master.svg?style=shield)](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master)
[![NPM](https://img.shields.io/npm/dm/node-luxafor.svg)](https://www.npmjs.com/package/node-luxafor)
[![Coverage Status](https://coveralls.io/repos/github/mattgoucher/node-luxafor/badge.svg)](https://coveralls.io/github/mattgoucher/node-luxafor)
[![Dependencies](https://david-dm.org/mattgoucher/node-luxafor.svg)](https://www.npmjs.com/package/node-luxafor)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mattgoucher/node-luxafor/edit/master/README.md)

## Install

```bash
npm i node-luxafor
```

## Usage

**Import the library and create an instance**
```js
import Luxafor from 'node-luxafor';
const MyLight = new Luxafor();
```

**Set Luxafor to blue**
```js
MyLight
  .color(0, 0, 255)
  .exec()
```

**Set Luxafor to blue**
```js
MyLight
  .color(0, 0, 255)
  .exec()
```

**Set Luxafor to green**
```js
MyLight
  .hex('#00FF00')
  .exec()
```

**Fade Luxafor to Cyan**
```js
MyLight
  .fade(0, 255, 255)
  .exec()
```

**Set a single LED to green**
```js
MyLight
  .led(1)
  .color(0, 255, 0)
  .exec()
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License
[MIT](http://vjpr.mit-license.org)
