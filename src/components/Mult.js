import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class Mult extends Observer {
  constructor() {
    //tag-operation-reg1val-reg2val
    //oper=>inlec(add,sub)
    //other=>and,or,shift,setlessthan
    super();
    this.input = new Input(this);
    let datamap=new Map();

this.addo=(operlist)=>{
  for(var n in operlist){
    var oper=operlist[n];
     console.log(oper);
  if(Object.keys(oper).length!==0){
   if(!datamap.has(oper.tag)){
  var op=oper.op+"";
  if(op.includes("MUL")){
var res=oper.reg1val*oper.reg2val;
  }
  else{
    var res=oper.reg1val/oper.reg2val;
  }
datamap.set(oper.tag,{op:oper.op,res:res,counter:0})
  }}}
};





this.delo=(tag)=>{
  datamap.delete(tag)
  };





this.inco=()=>{
  
  for (const [key, value] of datamap.entries()) {
    value.counter=value.counter+1;
    //console.log(key, value);
  }

}; 





this.checker=()=>{
  for (const [key, value] of datamap.entries()) {
    if(value.counter>=3){
      this.output.load({tag:key,op:value.op,res:value.res,counter:value.counter})
      this.delo(key)
      break;
    }
  }
  for (const [key, value] of datamap.entries()) {
    
    console.log(key, value);
  }
};

    this.clk = new Input(this);
    this.output = new Output();
  }



  update(data) {

    if(data){
     var oper=data;
      this.addo(oper);
      this.inco();
      this.checker();
      console.log("maraaaaaaaaaaaaaa")
     // console.log(oper);
   // console.log("this.datamap");
      
      // this.inputmap.set(this.input.data.tag ,{op:this.input.data.op,reg1val:this.input.data.reg1val,reg2val:this.input.data.reg2val})
      // this.output.load(this.inputmap)
    
    }
//     if (!data) {
//       var op=this.input2.data+"";
//       console.log(op);
//      // this.output.load(this.input3.data + this.input4.data);
     
   
//       if(op.includes("ADD")){
       
//         var res=this.input3.data + this.input4.data
//         this.output.load({tag:this.input1.data,val:res});
//       }
//       else if(op.includes("SUB")){
//         var res=this.input3.data - this.input4.data
// this.output.load({tag:this.input1.data,val:res})
//       }
    
   
//   }

  }

}

export default Mult;
