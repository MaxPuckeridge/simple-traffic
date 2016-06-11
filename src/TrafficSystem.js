var constants = require('./constants.js');
var math = require('./math.js');
var TrafficSystemState = require('./TrafficSystemState.js');
var TrafficSystemStatus = require('./TrafficSystemStatus.js');
var TrafficSystemChangeEvent = require('./TrafficSystemChangeEvent.js');

/**
 * Represents an intersection containing traffic lights.
 * @param {number=} opt_offset
 * @constructor
 */
var TrafficSystem = function(opt_offset) {
  /**
   * The offset of the cycle relative to the NS lights becoming active at time 0s.
   * E.g., an offset of constants.GREEN_DURATION will result in the cycle starting as the NS lights turn yellow.
   * Negative offsets are allowed.
   * @type {number}
   */
  this.offset = opt_offset || 0;
};

/**
 * Maps the offset to its equivalent value in the range
 * [0, constants.CYCLE_TIME) if that is not already the case.
 * @return {number}
 * @private
 */
TrafficSystem.prototype.getNormalizedOffset_ = function(offset) {
  return math.mod(offset, constants.CYCLE_TIME);
};

/**
 * State just prior to time = 0s. A new state may begin at 0s, which is the case for the default offset.
 * @return {TrafficSystemState}
 * @private
 */
TrafficSystem.prototype.getInitialTrafficSystemState_ = function(offset) {
  var normalizedOffset = this.getNormalizedOffset_(offset);

  if (normalizedOffset === 0) {
    var stateStartTime = - constants.YELLOW_DURATION
    return new TrafficSystemState(stateStartTime, TrafficSystemStatus.NS_PENDING);
  }

  if (normalizedOffset > 0 && normalizedOffset <= constants.GREEN_DURATION) {
    var stateStartTime = -normalizedOffset;
    return new TrafficSystemState(stateStartTime, TrafficSystemStatus.NS_ACTIVE);
  }

  if (normalizedOffset > constants.GREEN_DURATION && normalizedOffset <= constants.ROTATION_TIME) {
    var stateStartTime = constants.GREEN_DURATION - normalizedOffset;
    return new TrafficSystemState(stateStartTime, TrafficSystemStatus.EW_PENDING);
  }

  if (normalizedOffset > constants.ROTATION_TIME &&
      normalizedOffset <= constants.ROTATION_TIME + constants.GREEN_DURATION) {
    var stateStartTime = constants.ROTATION_TIME - normalizedOffset;
    return new TrafficSystemState(stateStartTime, TrafficSystemStatus.EW_ACTIVE);
  }

  var stateStartTime = constants.ROTATION_TIME + constants.GREEN_DURATION - normalizedOffset;
  return new TrafficSystemState(stateStartTime, TrafficSystemStatus.NS_PENDING);
};

/**
 * Generates a sequence of traffic system changes that occur over the duration provided.
 * @param {number} duration
 * @return {Array<TrafficSystemChangeEvent>}
 */
TrafficSystem.prototype.generateEventSequence = function(duration) {
  var state = this.getInitialTrafficSystemState_(this.offset);

  var sequence = [];
  while (state.getExpiryTime() <= duration) {
    state = state.getNext();
    sequence.push(state.getSystemChangeEvent());
  }

  return sequence;
};

module.exports = TrafficSystem;