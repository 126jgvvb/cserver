const BehaviorExport=require('../server_methods/serverBehavior');

module.exports=()=>{
console.log('checking time...current Time:'+(new Date).getHours()+":"+(new Date).getMinutes());
BehaviorExport('checking time...current Time:'+(new Date).getHours()+":"+(new Date).getMinutes());
  //not necessary.......
 // if((new Date).getHours()==0 && (new Date).getMinutes()==30) Database.resetLunchState();  //at midnight reached? erase/reset hadLunch values
}