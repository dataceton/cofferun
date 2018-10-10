(function (window) {
  var App = window.App || {};
  var $ = window.jQuery;

  function CheckList(selector) {
    if (!selector) {
      throw new Error('No selector provided');
    }

    this.$element = $(selector);
    if (this.$element.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }

    this._timer = 0;
    this._prevent = false;
  }

  CheckList.prototype.addRow = function (coffeeOrder) {
    this.removeRow(coffeeOrder.emailAddress)
    var rowElement = new Row(coffeeOrder);
    this.$element.append(rowElement.$element);
  };

  CheckList.prototype.removeRow = function (email) {
    this.$element
      .find('[value="' + email + '"]')
      .closest('[data-coffee-order="checkbox"]')
      .remove();
  };

  CheckList.prototype.addClickHandler = function (fn) {
    this.$element.on('click', 'input', function (event) {
      event.preventDefault();
      this._timer = setTimeout(function () {
        if (!this._prevent) {
          // event.target.checked = true|false
          var email = event.target.value;
          fn(email)
            .then(function () {
              console.log('just one click');
              this.removeRow(email);
            }.bind(this));
        }
        this._prevent = false;
      }.bind(this), 200);
    }.bind(this));
  };

  CheckList.prototype.addDoubleClickHandler = function (fn) {
    this.$element.on('dblclick', 'input', function (event) {
      event.preventDefault();
      clearTimeout(this._timer);
      this._prevent = true;
      var email = event.target.value;
      fn(email);
      console.log('double click');
    }.bind(this));
  };

  function Row(coffeeOrder) {
    var $div = $('<div></div>', {
      'data-coffee-order': 'checkbox',
      'class': 'checkbox'
    });
    var $label = $('<label></label>');
    var $checkbox = $('<input></input>', {
      type: 'checkbox',
      value: coffeeOrder.emailAddress
    });

    var description = coffeeOrder.size + ' ';
    if (coffeeOrder.flavor) {
      description += coffeeOrder.flavor + ' ';
    }
    description += coffeeOrder.coffee + ', ';
    description += ' (' + coffeeOrder.emailAddress + ')';
    description += ' [' + coffeeOrder.strength + 'x]';

    $label.append($checkbox);
    $label.append(description);
    $div.append($label);
    this.$element = $div;
  }

  App.CheckList = CheckList;
  window.App = App;
})(window);
