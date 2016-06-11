var TrafficSystem = require('./TrafficSystem.js');

var HALF_AN_HOUR = 30*60;

var mainArgs = process.argv.slice(2);
if (mainArgs.length > 2) {
  console.error('Usage: node src/main.js [duration (s), default=1800] [offset(s), default=0]');
}

var duration = mainArgs[0] || HALF_AN_HOUR;
var offset = mainArgs[1];

var sequence = new TrafficSystem(offset).generateEventSequence(duration);
sequence.forEach(function(event) {
  console.log(event.toString());
});