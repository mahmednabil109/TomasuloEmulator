class Instruction {
  constructor(operation, dst, reg1, reg2) {
    this.operation = operation;
    this.dst = dst;
    this.reg1 = reg1;
    this.reg2 = reg2;
  }

  toString() {
    return `<${this.operation} ${this.dst} ${this.reg1} ${this.reg2}>`;
  }
}

export default Instruction;
