// "~/.conkerorrc" should be a symlink to this file ("init.js").  Other
// js-files loaded with `al_load_rc` are placed in the same directory
// (with this file).

// Documentation for working with files:
// <https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFile>

require("duckduckgo");
require("page-modes/wikipedia.js");
require("dom-inspector");
require("favicon");
require("new-tabs.js");
require("clicks-in-new-buffer.js");

var al_load_dir;

function al_load (relpath) {
    var file = al_load_dir.clone();
    file.appendRelativePath(relpath);
    if (file.exists())
        load(file);
    else
        dumpln("WARNING: file '" + file.path + "' does not exist");
}

function al_load_rc () {
    var rcfile = make_file((get_pref("conkeror.rcfile")));
    al_load_dir = make_file(rcfile.target).parent;
    al_load("other/modules/player-mode/player.js");
    al_load("keys.js");
    al_load("settings.js");
    al_load("text.js");
    al_load("visual.js");
    al_load("other/rc/thorkill/dot.conkerorrc/100-login.js");
}

al_load_rc();

interactive("test", null,
            function (I) {
                I.window.minibuffer.show("conkerorrc was loaded successfully!");
            });

