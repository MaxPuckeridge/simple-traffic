var constants = require('./constants.js');
var TrafficLightAction = require('./TrafficLightAction.js');

/**
 * The traffic light system cycles 4 states, they
 * are described in this enum.
 * @enum {Object}
 */
var TrafficSystemStatus = {
  NS_ACTIVE: {
    duration: constants.GREEN_DURATION,
    startupActions: [
      new TrafficLightAction(constants.TrafficLight.N, constants.TrafficLightState.GREEN),
      new TrafficLightAction(constants.TrafficLight.S, constants.TrafficLightState.GREEN),
      new TrafficLightAction(constants.TrafficLight.W, constants.TrafficLightState.RED),
      new TrafficLightAction(constants.TrafficLight.E, constants.TrafficLightState.RED),
    ],
    nextState: 'EW_PENDING'
  },

  EW_PENDING: {
    duration: constants.YELLOW_DURATION,
    startupActions: [
      new TrafficLightAction(constants.TrafficLight.N, constants.TrafficLightState.YELLOW),
      new TrafficLightAction(constants.TrafficLight.S, constants.TrafficLightState.YELLOW),
    ],
    nextState: 'EW_ACTIVE'
  },

  EW_ACTIVE: {
    duration: constants.GREEN_DURATION,
    startupActions: [
      new TrafficLightAction(constants.TrafficLight.N, constants.TrafficLightState.RED),
      new TrafficLightAction(constants.TrafficLight.S, constants.TrafficLightState.RED),
      new TrafficLightAction(constants.TrafficLight.W, constants.TrafficLightState.GREEN),
      new TrafficLightAction(constants.TrafficLight.E, constants.TrafficLightState.GREEN)
    ],
    nextState: 'NS_PENDING'
  },

  NS_PENDING: {
    duration: constants.YELLOW_DURATION,
    startupActions: [
      new TrafficLightAction(constants.TrafficLight.W, constants.TrafficLightState.YELLOW),
      new TrafficLightAction(constants.TrafficLight.E, constants.TrafficLightState.YELLOW),
    ],
    nextState: 'NS_ACTIVE'
  }
};

module.exports = TrafficSystemStatus;