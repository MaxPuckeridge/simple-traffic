var TrafficSystemChangeEvent = require('./TrafficSystemChangeEvent.js');
var TrafficSystemStatus = require('./TrafficSystemStatus.js');

/**
 * Represents the state of the traffic light system.
 * @param {number} beginTime
 * @param {TrafficSystemStatus} status
 * @constructor
 */
var TrafficSystemState = function(beginTime, status) {
  this.beginTime = beginTime;
  this.status = status;
};

/**
 * Calculates the time this state will expire.
 * @return {number}
 */
TrafficSystemState.prototype.getExpiryTime = function() {
  return this.beginTime + this.status.duration;
};

/**
 * Gets the next state following this state completing.
 * @return {TrafficSystemState}
 */
TrafficSystemState.prototype.getNext = function() {
  var nextStatus = TrafficSystemStatus[this.status.nextState];
  return new TrafficSystemState(this.getExpiryTime(), nextStatus);
};

/**
 * Get the system change event that occurs when the traffic system
 * enters this state.
 * @return {TrafficSystemChangeEvent}
 */
TrafficSystemState.prototype.getSystemChangeEvent = function() {
  return new TrafficSystemChangeEvent(this.beginTime, this.status.startupActions);
};

module.exports = TrafficSystemState;