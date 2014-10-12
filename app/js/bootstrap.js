var gui = require('nw.gui'),
    os  = require('os');

if (os.platform() === "darwin") { // to do it only on mac OS
    var win = gui.Window.get();
    var mb = new gui.Menu({type:"menubar"});

    mb.createMacBuiltin("PacManager"); // To avoid having "undefined" in place of the app name
    win.menu = mb;
}

seajs.config({
    base: './js'
});

seajs.use('app');

