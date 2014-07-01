'use strict';

define(function (require) {
  var file = require('data');

  function domain(name) {
    this.domain = name;
    this.show = ko.observable(true);
  }

  function appViewModel() {
    var that,
        domainArr;

    that = this;
    domainArr = file.domains.map(function(element) {
      return new domain(element);
    });

    this.domains = ko.observableArray(domainArr);

    this.rm = function (domain) {
      file.rmDomain(domain.domain);
      that.domains.remove(domain);
    };

    this.handleInput = function (model, e) {
      var data,
          $this = $(e.target),
          value = $this.val();

      if (e.keyCode === 13) {
        file.addDomain(value);
        that.domains.push(new domain(value));
        $this.val('');
        value = '';
      }

      if (e.keyCode === 27) {
        $this.val('');
        value = '';
      }

      that.domains().forEach(function(domain) {
        if (domain.domain.indexOf(value) === 0) {
          domain.show(true);
        } else {
          domain.show(false);
        }
      });

      data = file.domains
        .filter(function (element) {
          return element.indexOf(value) !== -1;
        })
        .sort(function (a, b) {
          return b.score(value) - a.score(value);
        });

      that.domains.remove()
    };
  }

  return appViewModel;
});

