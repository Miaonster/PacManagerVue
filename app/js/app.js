define(function (require) {
    'use strict';

    var store = require('store');

    var items = new Vue({
        el: 'body',

        data: {
            items: [],
            domains: store.fetch(),
            domain: '',
            domainCompletion: false
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

            this.cm = CodeMirror.fromTextArea(document.querySelector('.js-search'), {
                mode: 'oneline',
                autofocus: true
            });

            this.cm.on("beforeChange", function(instance, change) {
                var newtext = change.text.join("").replace(/\n/g, "");

                if (change.text.length === 1 && change.text.join("") === newtext) {
                    return;
                }

                change.update(change.from, change.to, [newtext]);
            });

            this.cm.on('keydown', function (instance, event) {

                var existence;

                if (event.keyCode === 13) {

                    event.preventDefault();

                    if (!that.domainCompletion) {
                        return;
                    }

                    existence = that.domains.some(function (element) {
                        return element.name === that.domain;
                    });

                    if (!existence) {
                        that.domains.push({
                            name: that.domain,
                            active: true
                        });

                        that.domain = '';
                        that.cm.setValue('');
                    }
                }
            });

            this.cm.on('change', function (instance, change) {
                var pattern = /(?:https?:\/\/)?(?:[^\.]*\.)*?([^\.]+\.\w+)(?:(?:\/.*)?$)/,
                    domain = that.cm.getValue(),
                    matches = domain.match(pattern);

                if (matches) {
                    that.domain = matches[1];
                    that.domainCompletion = true;
                } else {
                    that.domain = domain;
                    that.domainCompletion = false;
                }
            });

            Mousetrap.bindGlobal('mod+l', function (e, combo) {
                e.preventDefault();
                that.cm.focus();
                that.cm.setSelection({ line: 0, ch: 0 }, { line: 0, ch: that.cm.getValue().length });
            });
        },

        methods: {

            onRemove: function (item) {
                this.cm.setValue('');
                this.domains.$remove(item.$data);
                this.domain = '';
            }

        }
    });

});
