import { STORE } from '../constants/Operations';
import Logger from './Logger';

class Operation {
  // `opTag` optional tag is used in store instruction as the dst is the register to be stored
  // so tag holdes the opertaion that will produce the dst incase if it's not available
  constructor(tag, opertaion, operand1, operand2, tag1, tag2, dst, opTag) {
    this.tag = tag;
    this.operation = opertaion;
    this.operand1 = operand1;
    this.operand2 = operand2;
    this.tag1 = tag1;
    this.tag2 = tag2;

    this.dst = dst;
    this.opTag = opTag;
  }

  isReady() {
    if (this.operation === STORE) return !this.opTag && !this.tag2;
    return !this.tag1 && !this.tag2;
  }

  substitute({ tag, value }) {
    Logger.assert(tag !== null);
    Logger.assert(value !== null && !isNaN(value));

    if (this.tag1 === tag) {
      this.operand1 = value;
      this.tag1 = null;
    }

    if (this.tag2 === tag) {
      this.operand2 = value;
      this.tag2 = null;
    }

    // handle store instruction
    if (this.opTag === tag) {
      this.dst = value;
      this.opTag = null;
    }
  }
}

export default Operation;
