

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../../genie'], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('geniejs'));
  } else {
    root.Lamp = factory(genie);
  }
}(this, function(genie) {
  'use strict';

  function Lamp(el) {
    var _this = this;
    this.el = el;
    this.wishes = [];
    this.currentIndex = 0;

    this.el.innerHTML = Lamp.template;
    this.input = document.getElementById('lamp-input');
    this.wishesContainer = document.getElementById('lamp-wishes-container');

    // Set this to false to keep it from autohiding
    this.autoHide = true;
    this.hide();

    this.input.addEventListener('keyup', function(e) {
      if (e.keyCode === 40) { // down arrow
        _this.focusOnWish(_this.currentIndex + 1);
        e.preventDefault();
      } else if (e.keyCode === 38) { // up arrow
        _this.focusOnWish(_this.currentIndex - 1);
        e.preventDefault();
      } else if (e.keyCode === 13) { // enter key
        genie.makeWish(_this.focusedWish, _this.focusedWish.magicWords[0]);
      } else {
        var tempFunc = _this.updateList.bind(_this);
        tempFunc();
      }
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

  Lamp.prototype.focusOnWish = function(num) {
    if (this.wishes.length && num < 0) {
      num = this.wishes.length - 1;
    } else if (this.wishes.length && num >= this.wishes.length) {
      num = 0;
    }

    this.wishDom[this.currentIndex].classList.remove('focused');
    this.wishDom[num].classList.add('focused');
    this.focusedWish = this.wishes[num];
    this.scrollToWish(num);
    this.currentIndex = num;
  };

  Lamp.prototype.scrollToWish = function(index) {
    var containerEl = this.wishesContainer;
    var containerHeight = this.wishesContainer.offsetHeight;
    var focusedWishElement = this.wishes[index];
    var containerTop = containerEl.scrollTop;
    var containerBottom = containerTop + containerHeight;
    var focusedWishTop = 0;
    for (var i = 0; i < this.wishes.length; i++) {
      if (i >= index) break;
      focusedWishTop += this.wishes[i].offsetHeight;
    }
    var focusedWishBottom = focusedWishTop + focusedWishElement.offsetHeight;
    if (containerBottom < focusedWishBottom) {
      containerEl.scrollTop = focusedWishBottom - containerHeight;
    } else if (containerTop > focusedWishTop) {
      containerEl.scrollTop = focusedWishTop;
    }
  };


  Lamp.prototype.updateList = function() {
    var _this = this;
    var value = _this.input.value;

    this.wishesContainer.innerHTML = '';

    if (!value) {
      return false;
    }
    if (value === "'") value = '';

    this.wishes = genie.getMatchingWishes(value);
    var wishes = this.wishes;

    for (var i = 0; i < wishes.length; i++) {
      /*
        <div class="lamp-wish wish-{{wish.id}}">
          <span class="wish-icon">
            <img class="wish-img-icon" src="{{wish.icon}}">
            <i class="wish-i-icon {{wish.iIcon}}"></i>
          </span>
          <span class="wish-display-text">{{wish.text}}</span>
        </div>
      */
      var wish = wishes[i];
      var wishEl = document.createElement('div');
      wishEl.classList.add('lamp-wish');
      wishEl.classList.add('wish-' + wish.id);

      if (wish.data.icon || wish.img) {
        var wishSpan = document.createElement('span');
        wishSpan.classList.add('wish-icon');
        if (wish.data.icon) {
          var icon = document.createElement('i');
          icon.classList.add('wish-i-icon');
          icon.className += ' ' + wish.data.icon;
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
      this.wishDom = this.wishesContainer.querySelectorAll('.lamp-wish');
    }

    if (wishes.length) {
      this.wishesContainer.classList.remove('lamp-hidden');
    }
  };

  return Lamp;

}));