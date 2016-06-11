/**
 * Represents an event consisting of a series of actions occurring at the given time.
 * @param {number} time
 * @param {Array<TrafficLightAction>} actions
 * @constructor
 */
var TrafficSystemChangeEvent = function(time, actions) {
  this.time = time;
  this.actions = actions;
};

TrafficSystemChangeEvent.prototype.toString = function() {
  var baseString =  "At time= " + this.time + " (s), the following changes occur: ";
  var actionStrings = this.actions.map(function(action) {
    return action.toString();
  }, baseString).join(', ');

  return baseString + actionStrings + '.';
};

module.exports = TrafficSystemChangeEvent;