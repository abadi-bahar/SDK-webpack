export default  class State{

     constructor() {
    this.user=null;
    this.l=3;
    this.moduleSettings=null;
    this.score=0;
    this.startTime=0;
    this.endTime=0;
    this.counter=0;
    this.language="en";
      }
  resetState()
   {
   	     this.score=0;
         this.startTime=0;
         this.endTime=0;

   }

setState=(newstate)=>{

    Object.keys(newstate).map(key=>{
    this[key] = newstate[key]
    })
    }

}

