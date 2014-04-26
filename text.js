interactive("insert-double-quotes",
    "Insert (or surround the currently selected text with) a pair of double quotes.",
    function (I) {
        call_on_focused_field(I, function (field) {
            modify_region(field,
                          function (str) {
                              return ["\""+str+"\"", (str ? str.length+2 : 1)];
                          });
        }, true);
    });

////////////////////////////////////////////////////////////////
/// Cutting, copying

function cut_to_beg_of_line (field, window) {
    field.selectionStart = 0;
    call_builtin_command(window, 'cmd_cut');
}

interactive("cut-to-beg-of-line",
            null,
            function (I) {
                call_on_focused_field(I, function (field) {
                    cut_to_beg_of_line(field, I.window);
                });
            });

function cut_whole_line (field, window) {
    field.selectionStart = 0;
    var eol = field.value.indexOf("\n");
    if (eol == -1)
        field.selectionEnd = field.textLength;
    else
        field.selectionEnd = eol;
    call_builtin_command(window, 'cmd_cut');
}

interactive("cut-whole-line",
            null,
            function (I) {
                call_on_focused_field(I, function (field) {
                    cut_whole_line(field, I.window);
                });
            });

function copy_whole_line (field, window) {
    var st = field.selectionStart;
    var en = field.selectionEnd;
    field.selectionStart = 0;
    var eol = field.value.indexOf("\n");
    if (eol == -1)
        field.selectionEnd = field.textLength;
    else
        field.selectionEnd = eol;
    call_builtin_command(window, 'cmd_copy');
    field.selectionStart = st;
    field.selectionEnd   = en;
}

interactive("copy-whole-line",
            null,
            function (I) {
                call_on_focused_field(I, function (field) {
                    copy_whole_line(field, I.window);
                });
            });

////////////////////////////////////////////////////////////////
/// Changing the case of the previous word

function modify_word_backward (field, func) {
    var point = field.selectionStart;
    var str = field.value;
    var beg_str = str.substring(0, point);
    var beg;
    var end = point;

    // Skip spaces backward and find the bounds of the word.
    for (var i = beg_str.length-1; i >= 0; i--) {
        if (" ".indexOf(beg_str.charAt(i)) == -1) {
            end = i;
            break;
        }
    }
    beg = str.lastIndexOf(" ", end) + 1;
    end = str.indexOf(" ", beg);
    if (end == -1)
        end = str.length;

    // Change the value of the text field.
    field.value =
        str.substring(0, beg) +
        func(str.substring(beg, end)) +
        str.substring(end);

    // Move point.
    field.selectionStart = point;
    field.selectionEnd = point;
}

interactive("downcase-word-backward",
            "Downcase the word backward.",
            function (I) {
                call_on_focused_field(I, function (field) {
                    modify_word_backward(field, function (word) {
                        return word.toLocaleLowerCase();
                    });
                });
            });

interactive("upcase-word-backward",
            "Upcase the word backward.",
            function (I) {
                call_on_focused_field(I, function (field) {
                    modify_word_backward(field, function (word) {
                        return word.toLocaleUpperCase();
                    });
                });
            });

interactive("capitalize-word-backward",
            "Capitalize the word backward.",
            function (I) {
                call_on_focused_field(I, function (field) {
                    modify_word_backward(field, function (word) {
                        if (word.length > 0)
                            return word[0].toLocaleUpperCase() +
                            word.substring(1).toLocaleLowerCase();
                        return word;
                    });
                });
            });

// overriden from "modules/content-buffer-input.js"
interactive("capitalize-word",
            "Capitalize the following word (or arg words), moving over.",
            function (I) {
                call_on_focused_field(I, function (field) {
                    modify_word_at_point(field, function (word) {
                        if (word.length > 0)
                            return word[0].toLocaleUpperCase() +
                            word.substring(1).toLocaleLowerCase();
                        return word;
                    });
                });
            });

