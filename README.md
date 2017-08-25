# node-luxafor
Control your Luxafor light

```js
import Luxafor from 'node-luxafor';

// Initialize your light
const MyLight = new Luxafor();

// Set the back-side to blue
MyLight.setColor(0, 0, 255, 'back');

// Set the front-side to green
MyLight.setColor(0, 255, 0, 'green');
```
