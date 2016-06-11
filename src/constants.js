/**
 * A set of states that a traffic light may take.
 * @enum {string}
 */
var TrafficLightState = {
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green'
};

/**
 * A set of traffic lights at an intersection.
 * @enum {string}
 */
var TrafficLight = {
  N: 'N',
  W: 'E',
  E: 'E',
  S: 'S'
};

/**
 * Duration between rotating between one set of lights being
 * green and the other set.
 * @const
 * @type {number}
 */
var ROTATION_TIME = 300;

/**
 * Duration between the c
 */
var CYCLE_TIME = 2 * ROTATION_TIME;

/**
 * Duration of an yellow traffic light in seconds.
 * @const
 * @type {number}
 */
var YELLOW_DURATION = 30;

/**
 * Duration of a green traffic light in seconds.
 * @const
 * @type {number}
 */
var GREEN_DURATION = ROTATION_TIME - YELLOW_DURATION;

/**
 * Duration of a red traffic light in seconds.
 * @const
 * @type {number}
 */
var RED_DURATION = ROTATION_TIME;

module.exports = {
  'TrafficLightState': TrafficLightState,
  'TrafficLight': TrafficLight,
  'ROTATION_TIME': ROTATION_TIME,
  'CYCLE_TIME': CYCLE_TIME,
  'YELLOW_DURATION': YELLOW_DURATION,
  'GREEN_DURATION': GREEN_DURATION,
  'RED_DURATION': RED_DURATION
};