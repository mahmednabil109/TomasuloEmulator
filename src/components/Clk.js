class Clk {
  constructor() {
    this.subs = [];
  }

  connect(obs) {
    if (obs) this.subs.push(obs);
  }

  tick() {
    this.subs.forEach((sub) => sub.tick());
  }
}

export default Clk;
