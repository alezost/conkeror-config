/// Misc

homepage = "https://bbs.archlinux.org/search.php?action=show_recent";

session_pref("general.useragent.compatMode.firefox", true);
session_pref('browser.history_expire_days', 30);
session_pref("browser.enable_automatic_image_resizing", true);
session_pref("browser.dom.window.dump.enabled", false);

hints_auto_exit_delay = 200;
minibuffer_read_url_select_initial = true;

// the method of loading url (from argument) when conkeror
// is opened again (externally)
url_remoting_fn = load_url_in_new_buffer;
can_kill_last_buffer = false;
download_buffer_automatic_open_target = OPEN_NEW_BUFFER_BACKGROUND;

// require("favicon");
// add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
// add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));
remove_hook("mode_line_hook", mode_line_adder(clock_widget));

// require("new-tabs.js");
tab_bar_button_close = 1;
tab_bar_show_icon = true;
// tab_bar_mode(false);

// require("clicks-in-new-buffer.js");
clicks_in_new_buffer_button = 1; // middle button
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;

// download directory
function update_save_path (info) {
    // cwd = info.target_file.parent;
    cwd = make_file("~/temp");
}
add_hook("download_added_hook", update_save_path);

// adblockplus
//require("adblockplus.js");
interactive("adblockplus-filters",
    "Show the Adblock Plus filter settings dialog.",
    function (I) {
        make_chrome_window("chrome://adblockplus/content/ui/filters.xul");
    });

////////////////////////////////////////////////////////////////
/// External programs

editor_shell_command = "emacsclient";
set_protocol_handler("mailto", make_file("/usr/local/bin/mailto"));
content_handlers.set("application/x-bittorrent", content_handler_open_default_viewer);
external_content_handlers.set("application/pdf", "zathura");
external_content_handlers.set("application/x-bittorrent", "torrent_job");

////////////////////////////////////////////////////////////////
/// Interacting with org-mode

function org_store_link (url, title, window) {
    var cmd_str =
        'emacsclient \"org-protocol:/store-link:/'+url+'/'+title+'\"';
    if (window != null) {
      window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}
interactive("org-store-link", "Store url and title via org-protocol",
          function (I) {
              org_store_link(encodeURIComponent(I.buffer.display_uri_string),
                             encodeURIComponent(I.buffer.document.title),
                             I.window);
          });

////////////////////////////////////////////////////////////////
/// Blocking focus

// <http://conkeror.org/Focus>

function focusblock (buffer) {
    var s = Components.utils.Sandbox(buffer.top_frame);
    s.document = buffer.document.wrappedJSObject;
    Components.utils.evalInSandbox(
        "(function () {\
            function nothing () {}\
            if (! document.forms)\
                return;\
            for (var i = 0, nforms = document.forms.length; i < nforms; i++) {\
              for (var j = 0, nels = document.forms[i].elements.length; j < nels; j++)\
                document.forms[i].elements[j].focus = nothing;\
            }\
          })();",
        s);
}
add_hook('content_buffer_progress_change_hook', focusblock);

////////////////////////////////////////////////////////////////
/// Javascript

interactive("toggle-js", "toggle javascript",
    function (I) {
        var pref = "javascript.enabled";
        var val  = get_pref(pref);
        val = !val;
        session_pref(pref, val);
        I.window.minibuffer.show("JavaScript is " + (val ? "ON" : "OFF"));
    });

////////////////////////////////////////////////////////////////
/// Buffers

interactive("switch-to-other-buffer",
            "Switch to the previously active buffer",
            function (I) {
                var blist = I.window.buffers.buffer_history;
                if (blist.length > 1)
                    switch_to_buffer(I.window, blist[1]);
            });

// Restore killed buffers
var kill_buffer_original = kill_buffer_original || kill_buffer;
var killed_buffer_urls = [];

kill_buffer = function (buffer, force) {
    if (buffer.display_uri_string) {
        killed_buffer_urls.push(buffer.display_uri_string);
    }
    kill_buffer_original(buffer,force);
};

interactive("restore-killed-buffer-url",
            "Restore a previously killed buffer",
            function restore_killed_buffer_url (I) {
                if (killed_buffer_urls.length !== 0) {
                    var url = yield I.minibuffer.read(
                        $prompt = "Restore killed url:",
                        $completer = all_word_completer($completions = killed_buffer_urls),
                        $default_completion = killed_buffer_urls[killed_buffer_urls.length - 1],
                        $auto_complete = "url",
                        $auto_complete_initial = true,
                        $auto_complete_delay = 0,
                        $match_required);
                    load_url_in_new_buffer(url);
                }
                else {
                    I.window.minibuffer.message("No killed buffers");
                }
            });

////////////////////////////////////////////////////////////////
/// Toggling bars

// set to STATE or toggle if STATE is not a boolean
// the visibility of tab_bar, minibuffer and mode_line
function toggle_all_bars (window, state) {
    if ( !(state === true || state === false) )
        state = window.minibuffer.element.collapsed;
    window.minibuffer.element.collapsed = !state;
    tab_bar_mode(state);
    if (window.mode_line)
        window.mode_line.container.collapsed = !state;
}

interactive("toggle-all-bars",
            "Hide or show tab-bar, minibuffer and mode-line",
            function (I) { toggle_all_bars(I.window) });

////////////////////////////////////////////////////////////////
/// Finding urls, history

// add history items in "find-url"
url_completion_use_history = true;

define_browser_object_class(
    "history-url", null,
    function (I, prompt) {
        check_buffer (I.buffer, content_buffer);
        var result = yield I.buffer.window.minibuffer.read_url(
            $prompt = prompt,  $use_webjumps = false, $use_history = true, $use_bookmarks = false);
        yield co_return (result);
    });

interactive("find-url-from-history",
            "Find a page from history in the current buffer",
            alternates(follow_current_buffer, follow_new_buffer, follow_new_window),
            $browser_object = browser_object_history_url)

interactive("follow-next",
            "Follow 'next' link",
            alternates(follow_current_buffer, follow_new_buffer, follow_new_window),
            $browser_object = browser_object_relationship_next);

interactive("follow-previous",
            "Follow 'previous' link",
            alternates(follow_current_buffer, follow_new_buffer, follow_new_window),
            $browser_object = browser_object_relationship_previous);

// overrided from content-buffer.js
minibuffer.prototype.read_url = function () {
    keywords(arguments, $prompt = "URL:", $history = "url", $initial_value = "",
             $use_webjumps = url_completion_use_webjumps,
             $use_history = url_completion_use_history,
             $use_bookmarks = url_completion_use_bookmarks,
             $sort_order = url_completion_sort_order);
    var completer = url_completer($use_webjumps = arguments.$use_webjumps,
        $use_bookmarks = arguments.$use_bookmarks,
        $use_history = arguments.$use_history,
        $sort_order = arguments.$sort_order);
    var result = yield this.read(
        $prompt = arguments.$prompt,
        $history = arguments.$history,
        $completer = completer,
        $initial_value = arguments.$initial_value,
        $auto_complete = "url",
        // added string
        $select = (arguments.$select == null) ? minibuffer_read_url_select_initial : arguments.$select,
        $match_required = false);
    if (!possibly_valid_url(result) && !get_webjump(result))
        result = try_read_url_handlers(result);
    if (result == "")
        throw ("invalid url or webjump (\""+ result +"\")");
    yield co_return(load_spec(result));
};

interactive("find-alternate-select-url", "Edit the current URL in the minibuffer",
    "find-url",
    $browser_object =
        define_browser_object_class("alternate-url", null,
            function (I, prompt) {
                check_buffer(I.buffer, content_buffer);
                var result = yield I.buffer.window.minibuffer.read_url(
                    $prompt = prompt,
                    $select = true,
                    $initial_value = I.buffer.display_uri_string);
                yield co_return(result);
            }),
    $prompt = "Find url");

////////////////////////////////////////////////////////////////
/// Webjumps & searches

wikipedia_webjumps_format = "wikipedia-%s";
define_wikipedia_webjumps("en", "ru", "fr");

define_webjump("emacswiki",
    "http://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi"+
        "&q=%s&sa=Search&siteurl=emacswiki.org%2F",
    $alternative="http://www.emacswiki.org/");
define_webjump("archwiki", "https://wiki.archlinux.org/index.php?search=%s",
               $alternative="http://www.archlinux.org");
define_webjump("arch-package", "https://www.archlinux.org/packages/?sort=&q=%s&maintainer=&flagged=",
               $alternative="https://www.archlinux.org/packages");
define_webjump("youtube", "http://www.youtube.com/results?search_query=%s&search=Search");
define_webjump("youtube-user", "http://youtube.com/profile_videos?user=%s");
define_webjump("stackoverflow","http://stackoverflow.com/search?q=%s", $alternative="http://stackoverflow.com");
define_webjump("python2", "http://docs.python.org/search.html?q=%s");
define_webjump("python3", "http://docs.python.org/py3k/search.html?q=%s",
               $alternative="http://docs.python.org/3/library");
define_webjump("pypi", "https://pypi.python.org/pypi?:action=search&term=%s&submit=search",
               $alternative="https://pypi.python.org/pypi");
define_webjump("mana", "http://wiki.themanaworld.org/index.php/Special:Search/%s",
               $alternative="http://wiki.themanaworld.org/index.php");
define_webjump("ip", "http://www.ip-address.org/lookup/ip-locator.php?track=%s",
               $alternative="http://www.ip-address.org/");
define_webjump("multitran", "http://www.multitran.ru/c/M.exe?CL=1&s=%s");
// french - http://www.multitran.ru/c/m.exe?l1=4&l2=2&CL=1&a=0
define_webjump("yandex", "http://yandex.ru/yandsearch?text=%s");
define_webjump("github", "http://github.com/search?q=%s&type=Everything");

// selection searches
function create_selection_search(webjump, key) {
    interactive(
        "internet-search-" + webjump,
        "Search for selected string with " + webjump,
        function (I) {
            var term;
            if (I.buffer.top_frame.getSelection() == "")
                term = yield I.minibuffer.read_url($prompt = "Search with " + webjump + ":",
                                                   $select = false,
                                                   $initial_value = webjump + " ");
            else
                term = webjump + " " + I.buffer.top_frame.getSelection();
            browser_object_follow(I.buffer, OPEN_NEW_BUFFER, term);
        });
    define_key(content_buffer_normal_keymap, key, "internet-search-" + webjump);

    interactive(
        "internet-search-" + webjump + "-prompted",
        "Search for a string with " + webjump,
        function (I) {
            var term = yield I.minibuffer.read_url($prompt = "Search with " + webjump + ":",
                                                   $select = false,
                                                   $initial_value = webjump + " ");
            browser_object_follow(I.buffer, OPEN_NEW_BUFFER, term);
        });
}

create_selection_search("google"        , "M-S G");
create_selection_search("duckduckgo"    , "M-S d");
create_selection_search("github"        , "M-S g");
create_selection_search("conkeror"      , "M-S c");
create_selection_search("emacswiki"     , "M-S e");
create_selection_search("archwiki"      , "M-S a");
create_selection_search("arch-package"  , "M-S A");
create_selection_search("wikipedia-en"  , "M-S w e");
create_selection_search("wikipedia-ru"  , "M-S w r");
create_selection_search("multitran"     , "M-S M");
create_selection_search("mana"          , "M-S m");
create_selection_search("ip"            , "M-S i");
create_selection_search("yandex"        , "M-S y");
create_selection_search("youtube"       , "M-S Y");
create_selection_search("stackoverflow" , "M-S s");
create_selection_search("python3"       , "M-S p");
