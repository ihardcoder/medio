import '@subway/style/index.css';
console.log(1)
window.onload = function(){
  require.ensure([],require=>{
    require('./_part.js')
  },'subway.part');
}