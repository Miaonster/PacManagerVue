var fs = require('fs');

define(function () {
    'use strict';

    var data = {
        path: '/Users/witcher42/.ShadowsocksX/gfwlist.js',
        suffix: '',
        prefix: '',
        domains: null,

        options: {
            encoding: 'utf8'
        },

        init: function () {
            var content = this.read(),
                match = /((?:[\r\n]|.)*var domains = )(\{(?:[\s\r\n]*".*?":\s*1,?)*[\s\r\n]*\})((?:[\r\n]|.)*)/g.exec(content);


            this.domains = JSON.parse(match[2]);
            this.prefix = match[1];
            this.suffix = match[3];
        },

        addDomain: function (domain) {
            this.domains.push(domain);
            this.save(this.assemble());
        },

        rmDomain: function (domain) {
            this.domains = _.without(this.domains, domain);
            this.save(this.assemble());
        },

        parseData: function () {
            var content = this.read(),
            match = /var domains = (\[([\s\r\n]*".*?",?)*[\s\r\n]*\])/g.exec(content);
            return match;
        },

        read: function () {
            return fs.readFileSync(this.path, this.options);
        },

        assemble: function (arr) {
            var content = {};

            for (var i = 0; i < arr.length; i++) {
                content[arr[i].name] = 1;
            }

            content = JSON.stringify(content, null, 4);
            content = this.prefix + content + this.suffix;

            return content;
        },

        save: function (arr) {
            var text = this.assemble(arr);

            try {
                return fs.writeFileSync(this.path, text, this.options);
            } catch (e) {
                return false;
            }
        }

    };

    data.init();

    return {

        // fetch formatted domains
        fetch: function () {
            var domain,
                arr = [];

            for (domain in data.domains) {
                arr.push({
                    name: domain,
                    active: true
                });
            }

            return arr;
        },

        // save domains
        save: function (arr) {
            data.save(arr);
        }
    };
});
