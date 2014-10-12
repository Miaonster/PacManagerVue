CodeMirror.defineMode('oneline', function(config) {

    return {
        startState: function () {
            return {
                last: 0,
                trueUrl: false,
                segment: ''
            };
        },

        token: function (stream, state) {
            var ch = '',
                cnt = 0;

            if (stream.eatSpace()) {
                return null;
            }

            if (stream.match(/https?:\/\//)) {
                return null;
            }

            if (state.segment === 'done') {
                stream.skipToEnd();
                return null;
            } else if (state.segment === 'domain') {
                while (ch = stream.peek()) {
                    if (ch !== '/') {
                        stream.next();
                    } else {
                        break;
                    }
                }

                state.segment = 'done';

                return 'keyword';
            } else {
                var result = stream.match(/((?:[^\.]*\.)*?)([^\.]+\.\w+)(\/.*)?$/),
                    length = 0;

                if (result && typeof result[1] !== 'undefined') {
                    length = result[1].length;
                    stream.backUp(stream.current().length - length);
                    state.segment = 'domain';
                } else {
                    stream.next();
                }

                return null;
            }
        }
    };

});
