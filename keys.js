// Moving cursor
function al_bind_move_keys (keymap) {
    define_key(keymap, "C-o", "backward-char");
    define_key(keymap, "M-o", "backward-word");
    define_key(keymap, "C-u", "forward-char");
    define_key(keymap, "M-u", "forward-word");
    define_key(keymap, "C-a", "beginning-of-line");
    define_key(keymap, "C-i", "end-of-line");
}

// Editing text (copy, paste, kill, delete)
function al_bind_edit_keys (keymap) {
    define_key(keymap, "C-,",       "cmd_deleteCharForward");
    define_key(keymap, "M-,",       "cmd_deleteWordForward");
    define_key(keymap, "M-<",       "cut-to-end-of-line");

    define_key(keymap, "C-p",       "cmd_deleteCharBackward");
    define_key(keymap, "M-p",       "cmd_deleteWordBackward");
    define_key(keymap, "M-P",       "cut-to-beg-of-line");

    define_key(keymap, "C-k",       "cut-whole-line");
    define_key(keymap, "M-k",       "copy-whole-line");
    define_key(keymap, "C-x",       "kill-region");
    define_key(keymap, "M-x",       "kill-ring-save");
    define_key(keymap, "s-space",   "cmd_selectAll");
    define_key(keymap, "M-space",   "cmd_selectWordNext");

    define_key(keymap, "C-'",       "transpose-chars");
    define_key(keymap, "s-4",       "insert-parentheses");
    define_key(keymap, "s-'",       "insert-double-quotes");
    define_key(keymap, "C-M-y",     "paste-x-primary-selection");

    define_key(keymap, "C-kanji",   "downcase-word-backward");
    define_key(keymap, "S-kanji",   "capitalize-word-backward");
    define_key(keymap, "kanji",     "upcase-word-backward");
    define_key(keymap, "C-M-kanji", "downcase-word");
    define_key(keymap, "M-S-kanji", "capitalize-word");
    define_key(keymap, "M-kanji",   "upcase-word");

    define_key(keymap, "s-u",       "cmd_undo");
}

// Scrolling screen
function al_bind_scroll_keys (keymap) {
    define_key(keymap, "C-s-o", "cmd_scrollLeft");
    define_key(keymap, "C-s-u", "cmd_scrollRight");
    define_key(keymap, "C-s-.", "cmd_scrollLineUp");
    define_key(keymap, "C-s-e", "cmd_scrollLineDown");
    define_key(keymap, "C-s-a", "scroll-beginning-of-line");
    define_key(keymap, "C-s-i", "scroll-end-of-line");
    define_key(keymap, "s-.",   "cmd_scrollPageUp");
    define_key(keymap, "s-e",   "cmd_scrollPageDown");
    define_key(keymap, "s-a",   "cmd_scrollTop");
    define_key(keymap, "s-i",   "cmd_scrollBottom");
}

// Selecting text
function al_bind_select_keys (keymap) {
    define_key(keymap, "C-o", "cmd_selectCharPrevious");
    define_key(keymap, "C-u", "cmd_selectCharNext");
    define_key(keymap, "M-o", "cmd_selectWordPrevious");
    define_key(keymap, "M-u", "cmd_selectWordNext");
    define_key(keymap, "C-.", "cmd_selectLinePrevious");
    define_key(keymap, "C-e", "cmd_selectLineNext");
    define_key(keymap, "C-a", "cmd_selectBeginLine");
    define_key(keymap, "C-i", "cmd_selectEndLine");
    define_key(keymap, "M-x", "cmd_copy");
}

// Miscellaneous bindings
function al_bind_misc_keys (keymap) {
    define_key(keymap, ".", "focus-previous-link");
    define_key(keymap, "e", "focus-next-link");
}

////////////////////////////////////////////////////////////////
/// Global bindings

define_key(default_base_keymap, "C-4", "universal-argument");
define_key(default_global_keymap, "C-t C-c", "quit");
define_key(default_global_keymap, "M-t", "execute-extended-command");
define_key(default_global_keymap, "M-v", "eval-expression");
define_key(default_global_keymap, "M-V t", function (I) {tab_bar_mode()});
define_key(default_global_keymap, "M-V s", "mode-line-mode");
define_key(default_global_keymap, "M-V a", "toggle-all-bars");
define_key(default_global_keymap, "M-V l", "apply-light-theme");
define_key(default_global_keymap, "M-V L", "toggle-light-theme");
define_key(default_global_keymap, "M-V d", "apply-dark-theme");
define_key(default_global_keymap, "M-V D", "toggle-dark-theme");
define_key(default_global_keymap, "C-M-j", "toggle-js");

////////////////////////////////////////////////////////////////
/// Text

al_bind_move_keys(text_keymap);
al_bind_edit_keys(text_keymap);

define_key(content_buffer_text_keymap, "M-d", "edit-current-field-in-external-editor");
undefine_key(content_buffer_text_keymap, "C-i");
undefine_key(content_buffer_text_keymap, "C-x");

undefine_key(content_buffer_textarea_keymap, "M-v");
undefine_key(content_buffer_textarea_keymap, "C-o");
undefine_key(content_buffer_textarea_keymap, "C-p");
define_key(content_buffer_textarea_keymap, "C-.", "backward-line");
define_key(content_buffer_textarea_keymap, "C-e", "forward-line");
define_key(content_buffer_textarea_keymap, "s-a", "beginning-of-first-line");
define_key(content_buffer_textarea_keymap, "s-i", "end-of-last-line");
define_key(content_buffer_textarea_keymap, "C-;", "open-line");

////////////////////////////////////////////////////////////////
/// Hints

define_key(hint_keymap, "C-.", "hints-previous");
define_key(hint_keymap, "M-.", "hints-previous");
define_key(hint_keymap, "C-e", "hints-next");
define_key(hint_keymap, "M-e", "hints-next");

////////////////////////////////////////////////////////////////
/// Minibuffer

define_key(minibuffer_keymap, "M-.", "minibuffer-history-previous");
define_key(minibuffer_keymap, "M-e", "minibuffer-history-next");
define_key(minibuffer_keymap, "C-.", "minibuffer-complete-previous");
define_key(minibuffer_keymap, "C-e", "minibuffer-complete");
undefine_key(minibuffer_keymap, "C-p");
undefine_key(minibuffer_keymap, "M-p");

////////////////////////////////////////////////////////////////
/// Normal buffer (web-pages)

al_bind_scroll_keys(content_buffer_normal_keymap);
al_bind_select_keys(content_buffer_normal_keymap);
al_bind_misc_keys(content_buffer_normal_keymap);
undefine_key(content_buffer_normal_keymap, "M-v");
undefine_key(content_buffer_normal_keymap, "C-b");

undefine_key(content_buffer_anchor_keymap, "o");
define_key(content_buffer_anchor_keymap, "S-return", "follow-new-buffer-background",
           $browser_object = browser_object_focused_element);

define_key(content_buffer_normal_keymap, "o", "up");
define_key(content_buffer_normal_keymap, "u", "follow");
define_key(content_buffer_normal_keymap, "U", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "h", "follow-previous");
define_key(content_buffer_normal_keymap, "n", "follow-next");

define_key(content_buffer_normal_keymap, ",", "back");
define_key(content_buffer_normal_keymap, "p", "forward");
define_key(content_buffer_normal_keymap, "y", "restore-killed-buffer-url");
define_key(content_buffer_normal_keymap, "j", "find-alternate-select-url");
define_key(content_buffer_normal_keymap, "g", "reload");
define_key(content_buffer_normal_keymap, "B", "bookmark");

define_key(content_buffer_normal_keymap, "a", "browser-object-dom-node");
define_key(content_buffer_normal_keymap, "l", "browser-object-links");
define_key(content_buffer_normal_keymap, "f", "browser-object-frames");
define_key(content_buffer_normal_keymap, "m", "browser-object-media");
define_key(content_buffer_normal_keymap, "t", "browser-object-text");

define_key(content_buffer_normal_keymap, "S", "save");
define_key(content_buffer_normal_keymap, "C", "copy");
define_key(content_buffer_normal_keymap, "D", "delete");
define_key(content_buffer_normal_keymap, "M-r M-l", "org-store-link");
define_key(content_buffer_normal_keymap, "I", "inspect-click");

////////////////////////////////////////////////////////////////
/// Special buffer (help, download)

al_bind_scroll_keys(special_buffer_keymap);
al_bind_select_keys(special_buffer_keymap);
al_bind_misc_keys(special_buffer_keymap);
undefine_key(special_buffer_keymap, "M-v");

////////////////////////////////////////////////////////////////
/// Buffers selecting and switching

define_key(default_global_keymap, "C-S-tab", "buffer-previous");
define_key(default_global_keymap, "C-tab",   "buffer-next");
define_key(default_global_keymap, "C-left",  "buffer-previous");
define_key(default_global_keymap, "C-right", "buffer-next");
define_key(default_global_keymap, "M-left",  "buffer-move-backward");
define_key(default_global_keymap, "M-right", "buffer-move-forward");

define_key(default_global_keymap, "M-b",     "switch-to-other-buffer");
define_key(default_global_keymap, "C-b C-b", "switch-to-buffer");
define_key(default_global_keymap, "C-b k",   "kill-current-buffer");
define_key(default_global_keymap, "k b",     "kill-buffer");
define_key(default_global_keymap, "k k",     "kill-current-buffer");
define_key(default_global_keymap, "k f",     "delete-window");

// From <http://conkeror.org/Tips?highlight=%28tips%29#Bind_Number_Keys_to_Switch_to_Buffers_1-10>
// "1..0" to switch to buffer; "k 1..0" to kill buffer
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
}
function define_kill_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   kill_buffer(I.window.buffers.get_buffer(buf_num));
               });
}
for (let i = 0; i < 10; ++i) {
    var num = String((i+1) % 10);
    define_switch_buffer_key(       num, i);
    define_kill_buffer_key  ("k " + num, i);
}

////////////////////////////////////////////////////////////////
/// Isearch

al_bind_move_keys(isearch_keymap);
al_bind_edit_keys(isearch_keymap);

////////////////////////////////////////////////////////////////
/// Duckduckgo

define_key(duckduckgo_keymap, "M-.", "duckduckgo-up");
define_key(duckduckgo_keymap, "M-e", "duckduckgo-down");
define_key(duckduckgo_keymap, "tab", "duckduckgo-focus-search");
undefine_key(duckduckgo_keymap, "k");
undefine_key(duckduckgo_keymap, "j");

////////////////////////////////////////////////////////////////
/// Wikipedia

define_key(wikipedia_keymap, "M-l", "wikipedia-other-language");

////////////////////////////////////////////////////////////////
/// Player mode

define_key(player_keymap, "space", "player-play-or-pause");
define_key(player_keymap, "f", "player-fullscreen");

