/**
 * Represents an action to be taken on a traffic light.
 * @param {constants.TrafficLight} target
 * @param {constants.TrafficLightState} value
 * @constructor
 */
var TrafficLightAction = function(target, value) {
  this.target = target;
  this.value = value;
};

TrafficLightAction.prototype.toString = function() {
  return this.target + " becomes " + this.value;
};

module.exports = TrafficLightAction;