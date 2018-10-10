// TODO
// Update CoffeeRun so that it uses a DataStore when its Ajax requests cannot reach the server.
// Fix existing bugs

(function (window) {
  var FORM_SELECTOR = '[data-coffee-order="form"]';
  var RANGE_SELECTOR = '[data-coffee-order="range"]';
  var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
  var SERVER_URL = 'http://coffeerun-v2-rest-api.herokuapp.com/api/coffeeorders';
  var App = window.App;
  var Truck = App.Truck;
  var DataStore = App.DataStore;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var CheckList = App.CheckList;
  var Validation = App.Validation;
  var remoteDS = new RemoteDataStore(SERVER_URL)
  var myTruck = new Truck('ncc-1701', remoteDS);
  var checkList = new CheckList(CHECKLIST_SELECTOR);
  window.checkList = checkList;
  window.myTruck = myTruck;
  window.remoteDS = remoteDS;
  var formhandler = new FormHandler(FORM_SELECTOR);

  checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck));
  // checkList.addDoubleClickHandler(function (email) {
  //   var order = myTruck.getOrder.call(myTruck, email).then(function () {
  //     console.log('this from defrre', this)
  //   });
  //   console.log('double click handler', order.responseJSON);
  //   formhandler.fill.call(formhandler, order.responseJSON);
  // });

  checkList.addDoubleClickHandler(function(email) {
    myTruck.getOrder(email, function (order) {
      formhandler.fill(order);
    })
  });

  formhandler.addInputHandler(Validation.isCompanyEmail);
  formhandler.addSubmitHandler(function (data) {
    return myTruck.createOrder(data)
      .then(function () {
        checkList.addRow.call(checkList, data);
        // $(RANGE_SELECTOR).find('input').trigger('input');
      }
    );
  });
  formhandler.addSliderHandler(RANGE_SELECTOR);
  formhandler.addFocusoutHandler(remoteDS, Validation.isAlreadyExist);

  myTruck.printOrders(checkList.addRow.bind(checkList));
})(window);
