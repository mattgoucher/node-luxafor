# node-luxafor

> Control your Luxafor light

[![CircleCI](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master.svg?style=shield)](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/mattgoucher/node-luxafor/badge.svg)](https://coveralls.io/github/mattgoucher/node-luxafor)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mattgoucher/node-luxafor/edit/master/README.md)

## Install

```bash
npm i node-luxafor
```

## Usage
```js
import Luxafor from 'node-luxafor';

// Initialize your light
const MyLight = new Luxafor();

// Set the back-side to blue
MyLight.setColor(0, 0, 255, 'back');

// Set the front-side to green
MyLight.setColor(0, 255, 0, 'front');
```

## License
[MIT](http://vjpr.mit-license.org)
