/* jshint -W030 */
var expect = chai.expect;

describe('genie-lamp-vanilla', function() {
  'use strict';

  var testLamp;

  beforeEach(function() {
    testLamp = new Lamp(document.getElementById('genie'));
  });

  describe('#', function() {
    it('should show the lamp', function() {
      expect(testLamp.el.style.display).to.equal('none');
      testLamp.show();
      expect(testLamp.showing).to.be.true;
    });

    it('should hide the lamp', function() {
      testLamp.show();
      testLamp.hide();
      expect(testLamp.showing).to.be.false;
    });

    it('should toggle between hiding and showing', function() {
      testLamp.show();
      testLamp.toggle();
      expect(testLamp.showing).to.be.false;
      testLamp.toggle();
      expect(testLamp.showing).to.be.true;
    });

    it('should hide when clicking around it', function() {
      testLamp.show();
      clickBody();
      expect(testLamp.showing).to.be.false;
    });

    it('should not hide when clicking around if autoHide == false', function() {
      testLamp.autoHide = false;
      testLamp.show();
      clickBody();
      expect(testLamp.showing).to.be.true;
    });
  });


  function clickBody() {
      var clickEvent = document.createEvent('MouseEvent');
      clickEvent.initMouseEvent('click', true, true, window,
    0, 0, 0, 80, 20, false, false, false, false, 0, null);
      var body = document.querySelector('body');
      body.dispatchEvent(clickEvent);
  }
});