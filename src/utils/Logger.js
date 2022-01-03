class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  static log(...msg) {
    // eslint-disable-next-line no-console
    console.log(`[${this.prefix || 'LOG'}]`, ...msg);
  }

  static assert(condition, msg) {
    // eslint-disable-next-line no-console
    console.assert(!!condition, msg);
  }
}

export default Logger;
