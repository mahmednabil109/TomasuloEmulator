import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class ReserveStations extends Observer {
  constructor(size) {
    super();
    this.operationInputs = new Input(this);
    this.regInputs = new Input(this);
    this.busInput = new Input(this);
    this.operationOutput = new Output();
    this.regOutput = new Output();
    this.size = size;
    let dataMap = new Map();
  }

  update(data) {
    if (!data) {
      let keys = this.dataMap.keys();
      if (keys.length < this.size) {
        if (this.operationInputs.data) {
          this.regOutput.load({
            reg: this.operationInputs.data.firstReg,
            op: 'read',
          });
          const firstRegValue = this.regInput.data;
          this.regOutput.load({
            reg: this.operationInputs.data.secondReg,
            op: 'read',
          });
          const secondRegValue = this.regInput.data;
          for (let i = 0; i < this.size; i++) {
            if (!this.dataMap.get(this.operationInputs.data.operation + i)) {
              this.dataMap.set(this.operationInputs.data.operation + i, {
                operation: this.operationInputs.data.operation,
                firstRegValue,
                secondRegValue,
              });
            }
          }
        }
      }
    }
  }
}
export default ReserveStations;
