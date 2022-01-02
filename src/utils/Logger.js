class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  static log(...msg) {
    // eslint-disable-next-line no-console
    console.log(`[${this.prefix || 'LOG'}]`, ...msg);
  }

  static assert(condition) {
    // eslint-disable-next-line no-console
    console.assert(!!condition);
  }
}

export default Logger;
