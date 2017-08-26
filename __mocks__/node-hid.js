export default {
  HID: class HID {
    constructor() {
      this.data = [];
    }

    write(payload) {
      this.data.push(payload);
      return this;
    }

    reset() {
      this.data = [];
      return this;
    }
  }
};
