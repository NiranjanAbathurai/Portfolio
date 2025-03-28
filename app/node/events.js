var fs = require('fs');
var rs = fs.createReadStream('./mynewfile1.txt');
rs.on('open',function(){
  console.log('The file is open')
});


var events = require('events');
var eventEmitter = new events.EventEmitter();

var eventHandler = function(){
  console.log('I create an event');
}

eventEmitter.on('screen',eventHandler);

eventEmitter.emit('screen'); // when screen is fired or emiited we call an function named eventHandler