/**
 * Extends summernote editor with "shift + return = soft linebreak" functionality
 * https://github.com/covistefan/summernote-br
 * Version: 0.3
 * Date: 2018-10-17T12:14Z
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
                        context.invoke('editor.saveRange');
                        context.invoke('editor.pasteHTML', '<br />&VeryThinSpace;');
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
