import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';
import MemoryUnit from './MemoryUnit';
class LoadUnit extends Observer{
    constructor(latency){
        super();

        //Map holding outputs and latency
        let dataMap = Map();

        //latency of the unit described by user
        this.latency = latency;

        //object having base , offset , register to load into
        this.input = new Input(this);

        //object having the value of the target address
        this.output = new Output(this);
        
        
    }
}