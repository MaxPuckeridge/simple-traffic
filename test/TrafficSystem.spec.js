var expect = require('chai').expect;
var TrafficSystem = require('../src/TrafficSystem.js');
var TrafficSystemStatus = require('../src/TrafficSystemStatus');
var constants = require('../src/constants.js');

var HALF_AN_HOUR = 30*60;

describe('TrafficSystem', function() {
  var system;
  beforeEach(function() {
    system = new TrafficSystem();
  });

  describe('getNormalizedOffset_', function() {
    it('handles a wide range of offsets', function() {
      expect(system.getNormalizedOffset_(0)).to.equal(0);
      expect(system.getNormalizedOffset_(constants.YELLOW_DURATION)).to.equal(constants.YELLOW_DURATION);
      expect(system.getNormalizedOffset_(constants.GREEN_DURATION)).to.equal(constants.GREEN_DURATION);
      expect(system.getNormalizedOffset_(constants.CYCLE_TIME)).to.equal(0);

      // more than one period
      expect(system.getNormalizedOffset_(constants.CYCLE_TIME + constants.YELLOW_DURATION)).to
          .equal(constants.YELLOW_DURATION);
      expect(system.getNormalizedOffset_(constants.CYCLE_TIME + constants.GREEN_DURATION)).to
          .equal(constants.GREEN_DURATION);
      expect(system.getNormalizedOffset_(2*constants.CYCLE_TIME)).to.equal(0);

      // negative offsets
      expect(system.getNormalizedOffset_(constants.YELLOW_DURATION - constants.CYCLE_TIME)).to
          .equal(constants.YELLOW_DURATION);
      expect(system.getNormalizedOffset_(constants.GREEN_DURATION - constants.CYCLE_TIME)).to
          .equal(constants.GREEN_DURATION);
      expect(system.getNormalizedOffset_(-constants.CYCLE_TIME)).to.equal(0);
    });
  });

  describe('getInitialTrafficSystemState_', function() {
    function assertState(expBeginTime, expStatus, actual) {
      expect(actual.beginTime).to.equal(expBeginTime);
      expect(actual.status).to.equal(expStatus);
    }

    it('handles a wide range of offsets', function() {
      // last state is just about the expire
      assertState(-constants.YELLOW_DURATION, TrafficSystemStatus.NS_PENDING, system.getInitialTrafficSystemState_(0));
      assertState(-constants.GREEN_DURATION, TrafficSystemStatus.NS_ACTIVE,
          system.getInitialTrafficSystemState_(constants.GREEN_DURATION));
      assertState(-constants.YELLOW_DURATION, TrafficSystemStatus.EW_PENDING,
          system.getInitialTrafficSystemState_(constants.ROTATION_TIME));
      assertState(-constants.GREEN_DURATION, TrafficSystemStatus.EW_ACTIVE,
          system.getInitialTrafficSystemState_(constants.ROTATION_TIME + constants.GREEN_DURATION));

      // last state only just started
      assertState(-1, TrafficSystemStatus.NS_ACTIVE, system.getInitialTrafficSystemState_(1));
      assertState(-1, TrafficSystemStatus.EW_PENDING, system.getInitialTrafficSystemState_(constants.GREEN_DURATION + 1));
      assertState(-1, TrafficSystemStatus.EW_ACTIVE, system.getInitialTrafficSystemState_(constants.ROTATION_TIME + 1));
      assertState(-1, TrafficSystemStatus.NS_PENDING,
          system.getInitialTrafficSystemState_(constants.ROTATION_TIME + constants.GREEN_DURATION + 1));

      // negative offsets
      assertState(-constants.YELLOW_DURATION, TrafficSystemStatus.NS_PENDING,
          system.getInitialTrafficSystemState_(-constants.CYCLE_TIME));
      assertState(-constants.GREEN_DURATION, TrafficSystemStatus.NS_ACTIVE,
          system.getInitialTrafficSystemState_(-constants.CYCLE_TIME + constants.GREEN_DURATION));
      assertState(-constants.YELLOW_DURATION, TrafficSystemStatus.EW_PENDING,
          system.getInitialTrafficSystemState_(-constants.CYCLE_TIME + constants.ROTATION_TIME));
      assertState(-constants.GREEN_DURATION, TrafficSystemStatus.EW_ACTIVE,
          system.getInitialTrafficSystemState_(-constants.CYCLE_TIME + constants.ROTATION_TIME + constants.GREEN_DURATION));
    });
  });

  describe('generateEventSequence', function() {
    it('creates the correct sequence, default offset', function() {
      var sequence = system.generateEventSequence(constants.CYCLE_TIME);

      expect(sequence.length).to.equal(5);

      var firstItem = sequence[0];
      expect(firstItem.time).to.equal(0);
      expect(firstItem.actions).to.equal(TrafficSystemStatus.NS_ACTIVE.startupActions);

      var secondItem = sequence[1];
      expect(secondItem.time).to.equal(constants.GREEN_DURATION);
      expect(secondItem.actions).to.equal(TrafficSystemStatus.EW_PENDING.startupActions);

      var thirdItem = sequence[2];
      expect(thirdItem.time).to.equal(constants.ROTATION_TIME);
      expect(thirdItem.actions).to.equal(TrafficSystemStatus.EW_ACTIVE.startupActions);

      var forthItem = sequence[3];
      expect(forthItem.time).to.equal(constants.ROTATION_TIME + constants.GREEN_DURATION);
      expect(forthItem.actions).to.equal(TrafficSystemStatus.NS_PENDING.startupActions);

      var fifthItem = sequence[4];
      expect(fifthItem.time).to.equal(constants.CYCLE_TIME);
      expect(fifthItem.actions).to.equal(TrafficSystemStatus.NS_ACTIVE.startupActions);
    });

    it('creates the correct sequence, positive offset', function() {
      system = new TrafficSystem(constants.GREEN_DURATION);

      var sequence = system.generateEventSequence(constants.CYCLE_TIME);

      expect(sequence.length).to.equal(5);

      var firstItem = sequence[0];
      expect(firstItem.time).to.equal(0);
      expect(firstItem.actions).to.equal(TrafficSystemStatus.EW_PENDING.startupActions);

      var secondItem = sequence[1];
      expect(secondItem.time).to.equal(constants.YELLOW_DURATION);
      expect(secondItem.actions).to.equal(TrafficSystemStatus.EW_ACTIVE.startupActions);

      var thirdItem = sequence[2];
      expect(thirdItem.time).to.equal(constants.ROTATION_TIME);
      expect(thirdItem.actions).to.equal(TrafficSystemStatus.NS_PENDING.startupActions);

      var forthItem = sequence[3];
      expect(forthItem.time).to.equal(constants.ROTATION_TIME + constants.YELLOW_DURATION);
      expect(forthItem.actions).to.equal(TrafficSystemStatus.NS_ACTIVE.startupActions);

      var fifthItem = sequence[4];
      expect(fifthItem.time).to.equal(constants.CYCLE_TIME);
      expect(fifthItem.actions).to.equal(TrafficSystemStatus.EW_PENDING.startupActions);
    });

    it('creates the correct sequence, negative offset', function() {
      system = new TrafficSystem(-constants.YELLOW_DURATION);

      var sequence = system.generateEventSequence(constants.CYCLE_TIME);

      expect(sequence.length).to.equal(5);

      var firstItem = sequence[0];
      expect(firstItem.time).to.equal(0);
      expect(firstItem.actions).to.equal(TrafficSystemStatus.NS_PENDING.startupActions);

      var secondItem = sequence[1];
      expect(secondItem.time).to.equal(constants.YELLOW_DURATION);
      expect(secondItem.actions).to.equal(TrafficSystemStatus.NS_ACTIVE.startupActions);

      var thirdItem = sequence[2];
      expect(thirdItem.time).to.equal(constants.ROTATION_TIME);
      expect(thirdItem.actions).to.equal(TrafficSystemStatus.EW_PENDING.startupActions);

      var forthItem = sequence[3];
      expect(forthItem.time).to.equal(constants.ROTATION_TIME + constants.YELLOW_DURATION);
      expect(forthItem.actions).to.equal(TrafficSystemStatus.EW_ACTIVE.startupActions);

      var fifthItem = sequence[4];
      expect(fifthItem.time).to.equal(constants.CYCLE_TIME);
      expect(fifthItem.actions).to.equal(TrafficSystemStatus.NS_PENDING.startupActions);
    });

    it('generates the correct number of events for half an hour', function() {
      system = new TrafficSystem(-constants.YELLOW_DURATION);

      var sequence = system.generateEventSequence(HALF_AN_HOUR);

      expect(sequence.length).to.equal(13);
    });
  });
});