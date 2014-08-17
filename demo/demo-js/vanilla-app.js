(function() {
  'use strict';

  var mainLamp = new lamp(document.getElementById('genie'));

  var iconPrefix = 'fa fa-';

  var logo = document.getElementById('genie-logo');
  var ctrlPressed = false;

  var genieHome = encodeURIComponent('http://kent.doddsfamily.us/genie');
  var genieTagline = encodeURIComponent('Genie: Better than keyboard shortcuts');

  logo.addEventListener('click', function(e) {
    mainLamp.show();
    e.stopPropagation();
  });

  document.addEventListener('keydown', function(e) {
    console.log(e.keyCode);
    if (e.keyCode === 17) { // ctrl key
      ctrlPressed = true;
    }
    if (e.keyCode === 32 && ctrlPressed) { // space
      mainLamp.show();
      e.preventDefault();
    }
    if (e.keyCode === 27) { // escape key
      mainLamp.hide();
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 17) { // ctrl key
      ctrlPressed = false;
    }
  });


  function addNavigateWishWithoutPrefix(magicWord, shareUrl, iIcon) {
    mainLamp.addWish(magicWord, {
      destination: shareUrl,
      openNewTab: true
    }, {
      uxGenie: {
        iIcon: iIcon
      }
    });
  }

  addNavigateWishWithoutPrefix('Tweet #GenieJS', 'https://twitter.com/intent/tweet?hashtags=GenieJS&original_referer=' + genieHome + '&text=' + genieTagline + '&tw_p=tweetbutton&url=' + genieHome + '&via=kentcdodds', iconPrefix + 'share');
  addNavigateWishWithoutPrefix('Share #GenieJS on Google+', 'http://plus.google.com/share?&url=' + genieHome, iconPrefix + 'share');
  addNavigateWishWithoutPrefix('Email about GenieJS', 'mailto:?&subject=' + encodeURIComponent('Cool JavaScript Library: Genie') + '&body=' + genieTagline + encodeURIComponent('\nCheck it out here: ') + genieHome, iconPrefix + 'envelope');
  
  addNavigateWishWithoutPrefix('Code with @kentcdodds', 'http://www.github.com/kentcdodds', iconPrefix + 'github');
  addNavigateWishWithoutPrefix('Follow @kentcdodds', 'https://twitter.com/intent/follow?original_referer=' + genieHome + '&region=follow_link&screen_name=kentcdodds&tw_p=followbutton&variant=2.0', iconPrefix + 'twitter');
  addNavigateWishWithoutPrefix('Circle +KentCDodds', 'http://plus.google.com/+KentCDodds', iconPrefix + 'google-plus');
  addNavigateWishWithoutPrefix('Visit Kent\'s website', 'http://kent.doddsfamily.us', iconPrefix + 'globe');



})();