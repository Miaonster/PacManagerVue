'use strict';

define(function (require) {
  var appViewModel = require('appViewModel');

  ko.applyBindings(new appViewModel());
});
