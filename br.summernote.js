/**
 * Extends summernote editor with "shift + return = soft linebreak" functionality
 * https://github.com/covistefan/summernote-br
 * Version: 0.1
 * Date: 2018-08-14T14:00Z
 */

(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    
    var shiftKey = false;
/*  console.log('linebreak-plugin loaded'); */
    
    // Extends plugins for adding linebreaks - plugin is external module for customizing.
    $.extend($.summernote.plugins, {
        /**
        * @param {Object} context - context object has status of editor.
        */
        'br': function (context) {
            var self = this;

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.keydown': function (we, e) {
                    if (e.keyCode === 16) { shiftKey = true; }
                    if (e.keyCode === 13 && shiftKey) {
                        var sel, txt, firstPart = '', lastPart = '', setBR = 0, ms;
                        /*
                        var doc = $(this).next('.note-editor').children('.note-editing-area').children('.note-editable').html().ownerDocument || $(this).next('.note-editor').children('.note-editing-area').children('.note-editable').html().document;
                        */
                        if (typeof window.getSelection != "undefined") {
                            sel = window.getSelection();
                            if (sel.rangeCount > 0) {
                                txt = sel.focusNode.textContent;
                                var area = $(sel.focusNode).parents('.note-editable');
                                $(sel.focusNode.parentNode.childNodes).each(function(n){
                                    var cons = $(this).parent();
                                    if ($(this).text()==txt) {
                                        if (sel.isCollapsed) {
                                            // no text selected and the linebreak will be added on caret position
                                            if ($(this).text().length<=sel.focusOffset) {
                                                // focus is after last character of set
                                                firstPart = $(this).text().trim();
                                                lastPart = '';
                                            } else {
                                                // focus is between chars
                                                firstPart = $(this).text().substring(0,sel.focusOffset).trim();
                                                lastPart = $(this).text().substring(sel.focusOffset).trim();
                                            }
                                        } else {
                                            // some text was selected and the linebreak will replace that text
                                            if (sel.focusOffset<sel.anchorOffset) {
                                                firstPart = $(this).text().substring(0,sel.focusOffset).trim();
                                                lastPart = $(this).text().substring(sel.anchorOffset).trim();
                                            }
                                            else {
                                                firstPart = $(this).text().substring(0,sel.anchorOffset).trim();
                                                lastPart = $(this).text().substring(sel.focusOffset).trim();
                                            }
                                        }
                                        console.log(firstPart);
                                        console.log(lastPart);
                                        if (firstPart=='') { setBR = n+1; } else { setBR = n+2; }
                                        var d = new Date();
                                        ms = d.getSeconds()*1000 + d.getMilliseconds();
                                        $(this).replaceWith(firstPart + "<br class='note-lb' id='" + ms + "' />" + lastPart);
                                        sel.removeAllRanges();
                                    }; 
                                });
                                var el = $('#' + ms);
                                var range = document.createRange();
                                var sel = window.getSelection();
                                range.setStart(el.parent().get(0).childNodes[setBR], 0); range.collapse(true);
                                sel.removeAllRanges(); sel.addRange(range);
                                el.focus; el.removeAttr('id');
                            }
                        }
                        e.preventDefault();
                    }
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                    if (e.keyCode==16) { shiftKey = false; }
                }
            };

            this.initialize = function () {};
            this.destroy = function () {
                this.$panel.remove();
                this.$panel = null;
            };
        }
    });
}));
