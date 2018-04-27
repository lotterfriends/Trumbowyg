(function ($) {
    'use strict';

    window._tbSelect = function(element) {
        var $node = $(element);
        $('.trumbowyg .trumbowyg-modal-box .finder-list .finder-list-itm.active').removeClass('active');
        $node.addClass('active');
    };

    var defaultOptions = {
        url: false 
    };

    function buildButtonDef(trumbowyg) {
        return {
            fn: function() {

                if (!trumbowyg.o.plugins.finder.url) {
                    return false;
                }

                $.getJSON(trumbowyg.o.plugins.finder.url, function(data) {

                    // build the template
                    var content = ['<div class="finder-list">'];
                    for(var i in data) {
                        content.push('<span data-url="' + data[i] + '" ');
                        content.push('onclick="_tbSelect(this)" class="finder-list-itm" style="background-image: url(\'');
                        content.push(data[i]);
                        content.push('\')">');
                        content.push('</span>');
                    }
                    content.push('</div>');
                    
                    var $modal = trumbowyg.openModal(trumbowyg.lang['finder'], content.join(''));
                    $modal.on('tbwconfirm', function() {
                        var $activeNode = $('.trumbowyg .trumbowyg-modal-box .finder-list .finder-list-itm.active');
                        if ($activeNode.length) {
                            var url = $activeNode.data('url');
                            trumbowyg.execCmd('insertImage', url);
                            var $img = $('img[src="' + url + '"]:not([alt])', trumbowyg.$box);
                            trumbowyg.syncCode();
                            trumbowyg.$c.trigger('tbwchange');
                            trumbowyg.closeModal();
                        }

                    });
                    
                    $modal.on('tbwcancel', function() {
                        trumbowyg.closeModal();
                    });

                });

            }
        }
    }

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                finder: 'Select image'
            },
            de: {
                finder: 'Bild auswählen',
            }
        },
        plugins: {
            finder: {
                init: function(trumbowyg) {
                    trumbowyg.o.plugins.finder = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.finder || {}
                    );
                    trumbowyg.addBtnDef('finder', buildButtonDef(trumbowyg));
                }
            }
        }
    })
})(jQuery);