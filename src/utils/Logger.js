class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  static log(...msg) {
    // eslint-disable-next-line no-console
    console.log(`[${this.prefix || 'LOG'}] ${msg.join(' ')}`);
  }
}

export default Logger;
