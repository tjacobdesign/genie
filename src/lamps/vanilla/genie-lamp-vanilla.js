

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../../genie'], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('geniejs'));
  } else {
    root.lamp = factory(genie);
  }
}(this, function(genie) {
  'use strict';


  function Lamp(el) {
    var _this = this;
    this.el = el;
    this.wishes = [];

    this.el.innerHTML = Lamp.template;
    this.input = document.getElementById('lamp-input');
    this.wishesContainer = document.getElementById('lamp-wishes-container');

    this.autoHide = true;
    this.hide();

    this.input.addEventListener('keyup', function(e) {
      _this.updateList(_this);
      e.preventDefault();
    });
  }

  Lamp.template = '<div class="default-template light large fast">' +
                '<div class="genie-lamp-container visible">' +
                  '<input type="text" id="lamp-input" class="lamp-input input form-control" />' +
                '<div id="lamp-wishes-container" class="lamp-wishes-container lamp-hidden"></div>' +
              '</div>';


  Lamp.prototype.show = function() {
    var _this = this;
    this.el.style.display = '';
    this.showing = true;
    this.input.focus();

    function tempHide() {
      _this.hide();
      document.removeEventListener('click', tempHide);
      _this.el.removeEventListener('click', stopPropagation);
    }

    function stopPropagation(e) {
      e.stopPropagation();
    }

    if (this.autoHide) {
      document.addEventListener('click', tempHide);
      this.el.addEventListener('click', stopPropagation);
    }
  };

  Lamp.prototype.hide = function() {
    this.el.style.display = 'none';
    this.showing = false;
  };

  Lamp.prototype.toggle = function() {
    if (this.showing) {
      this.hide();
    } else {
      this.show();
    }
  };

  Lamp.prototype.addWish = function(magicWords, action, data) {
    if (typeof magicWords === 'string') {
      magicWords = magicWords.split(',');
    }
    genie({
      magicWords: magicWords,
      action: action || function(wish) {
        alert('Your "' + wish.magicWords[0] + '" wish is my command!');
      },
      data: data
    });
  };

  Lamp.prototype.trigger = function(element, eventName) {
    var event;

    if (window.CustomEvent) {
      event = new CustomEvent('my-event', {detail: {some: 'data'}});
    } else {
      // IE fallback
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('my-event', true, true, {some: 'data'});
    }

    element.dispatchEvent(event);
  };

  Lamp.prototype.updateList = function(lamp) {
    var _this = lamp || this;
    var value = _this.input.value;
    var wishes = genie.getMatchingWishes(value);

    this.wishesContainer.innerHTML = '';

    if (!value) {
      return false;
    }

    for (var i = 0; i < wishes.length; i++) {
      var wish = wishes[i];
      /*
        <div class="lamp-wish wish-{{wish.id}}">
          <span class="wish-icon">
            <img class="wish-img-icon" src="{{wish.icon}}">
            <i class="wish-i-icon {{wish.iIcon}}"></i>
          </span>
          <span class="wish-display-text">{{wish.text}}</span>
        </div>
      */
      var wishEl = document.createElement('div');
      wishEl.classList.add('lamp-wish');
      wishEl.classList.add('wish-' + wish.id);

      if (wish.icon || wish.img) {
        var wishSpan = document.createElement('span');
        wishSpan.classList.add('wish-icon');
        if (wish.icon) {
          var icon = document.createElement('i');
          icon.classList.add('wish-i-icon');
          icon.classList.add(wish.icon);
          wishSpan.appendChild(icon);
        } else {
          var img = document.createElement('img');
          img.classList.add('wish-img-icon');
          img.src = wish.imgSrc;
          wishSpan.appendChild(img);
        }
        wishEl.appendChild(wishSpan);
      }

      var text = document.createElement('span');
      text.classList.add('wish-display-text');
      text.innerHTML = wish.magicWords[0];
      wishEl.appendChild(text);

      this.wishesContainer.appendChild(wishEl);
    };

    if (wishes.length) {
      this.wishesContainer.classList.remove('lamp-hidden');
    }
  };

  return Lamp;

}));