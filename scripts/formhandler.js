(function (window) {
  var App = window.App || {};
  var $ = window.jQuery;

  function FormHandler(selector) {
    if (!selector) {
      throw new Error('No selector provided');
    }

    this.$formElement = $(selector);
    if (this.$formElement.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  FormHandler.prototype.addSubmitHandler = function (fn) {
    console.log('Setting submit handler for form');
    addModalHandler();

    this.$formElement.on('submit', function (event) {
      event.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
        console.log(item.name + ' is ' + item.value);
      });
      console.log(data);
      if (data.size === 'coffee-zilla' && data.flavor != "" && data.strength === '100') {
        $('#achivmentModal').modal('show');
        return
      }
      fn(data)
        .then(function () {
          this.reset();
          this.elements[0].focus();
        }.bind(this));
    });
  };

  FormHandler.prototype.addSliderHandler = function (selector) {
    var $sliderDiv = $(selector);
    var $slider = $sliderDiv.find('input');
    var $strengthLabel = $('label[for="strengthLevel"]');
    var $sliderValue = $('<div data-coffee-order="range-value"></div>').prependTo($sliderDiv);

    $slider.on('input', function () {
      $sliderValue.text(this.value);
      changeColor($sliderValue, this.value, 100 - this.value, 0);
    });
    $slider.trigger('input');
  };

  FormHandler.prototype.addInputHandler = function (fn) {
    console.log('Setting input handler for form');
    this.$formElement.on('input', '[name="emailAddress"]', function (event) {
      var email = event.target.value;
      var message = '';
      if (fn(email)) {
        event.target.setCustomValidity('');
      } else {
        message = email + ' is not authorized email address!';
        console.log(message);
        event.target.setCustomValidity(message);
      }
    });
  };

  FormHandler.prototype.addFocusoutHandler = function (db, fn) {
    // var email = event.target.value;
    this.$formElement.on('focusout', '[name="emailAddress"]', function (event) {
      var email = event.target.value;
      var message = '';
      db.get(email, function (response) {
        var resp = response || {};
        fn(email, resp.emailAddress, function (isValid) {
          if (isValid) {
            event.target.setCustomValidity('');
          } else {
            message = email + ' is already exists';
            event.target.setCustomValidity(message);
          }
        });
      });
    });
  };

  FormHandler.prototype.fill = function (order) {
    window.myOrder = order;
    console.log('from form fill');
    Object.keys(order).forEach(function (key) {
      // console.log(order);
      $formInput = this.$formElement.find('[name="' + key + '"]')
      switch ($formInput.attr('type')) {
        case 'radio':
          console.log('radio');
          $formInput.filter('[value="' + order[key] + '"]').prop('checked', true);
          break;
        case 'range':
          console.log('range');
          $formInput.val(order[key]);
          $formInput.trigger('input');
          break;
        case undefined:
          console.log('select');
          $formInput.find('[value="' + order[key] + '"]').prop('selected', true);
          break;
        default:
          console.log('text input');
          $formInput.val(order[key]);
      }
    }.bind(this));
  };

  function addModalHandler () {
    $modalConfirm = $('[data-modal-button="yes"]');
    $modalConfirm.on('click', function () {
      $(this).closest('.modal').modal('hide');
      $('body').addClass('achivment');
    });
  }

  function changeColor(element, red, green, blue) {
    $(element).css('color', `rgb(${red}%, ${green}%, ${blue}%)`)
  }

  App.FormHandler = FormHandler
  window.App = App;
})(window)
