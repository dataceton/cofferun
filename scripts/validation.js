(function (window) {
  var App = window.App || {};

  var Validation = {
    isCompanyEmail: function (email) {
      return /.+@random\.com$/.test(email);
    },

    isAlreadyExist: function (email, serverEmail, fn) {
      fn(email !== serverEmail);
    }
  };

  App.Validation = Validation;
  window.App = App;
})(window);
