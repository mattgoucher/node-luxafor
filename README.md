# node-luxafor
Control your Luxafor light

[![CircleCI](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master.svg?style=shield)](https://circleci.com/gh/mattgoucher/node-luxafor/tree/master) [![Coverage Status](https://coveralls.io/repos/github/mattgoucher/node-luxafor/badge.svg?branch=master)](https://coveralls.io/github/mattgoucher/node-luxafor?branch=master)


```js
import Luxafor from 'node-luxafor';

// Initialize your light
const MyLight = new Luxafor();

// Set the back-side to blue
MyLight.setColor(0, 0, 255, 'back');

// Set the front-side to green
MyLight.setColor(0, 255, 0, 'green');
```
