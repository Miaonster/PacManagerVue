define(function (require) {
    'use strict';

    var store = require('store');

    var items = new Vue({
        el: 'body',

        data: {
            items: [],
            domains: store.fetch(),
            domain: ''
        },

        ready: function () {
            var timer,
                that = this;

            this.$watch('domains', function (domains) {
                store.save(domains);
            });

            this.$watch('domain', function (value) {
                that.items = [];
                for (var i = 0; i < that.domains.length && value; i++) {
                    if (that.domains[i].name.indexOf(value) === 0) {
                        that.items.push(that.domains[i]);
                    }
                }
            });
       },

        methods: {

            onRemove: function (item) {
                this.domains.$remove(item.$data);
                this.domain = '';
            },

            onHandle: function (e) {
                var data,
                    value = this.domain.trim();

                if (e.keyCode === 13) {
                    this.domains.push({
                        name: value,
                        active: true
                    });
                    this.domain = '';
                }

                if (e.keyCode === 27) {
                    this.domain = value = '';
                }
            },

            domainFilter: function (self) {
                return self.name.indexOf(this.domain) === 0;
            }

        }
    });

});
