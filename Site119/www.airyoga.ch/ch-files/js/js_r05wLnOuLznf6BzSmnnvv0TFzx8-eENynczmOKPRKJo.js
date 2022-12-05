/*
  Formalize - version 1.1

  Note: This file depends on the jQuery library.
*/

// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern
var FORMALIZE = (function($, window, document, undefined) {
  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var IE6 = !!($.browser.msie && parseInt($.browser.version, 10) === 6);
  var IE7 = !!($.browser.msie && parseInt($.browser.version, 10) === 7);

  // Expose innards of FORMALIZE.
  return {
    // FORMALIZE.go
    go: function() {
      for (var i in FORMALIZE.init) {
        FORMALIZE.init[i]();
      }
    },
    // FORMALIZE.init
    init: {
      // FORMALIZE.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !$('input, select, textarea').length) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        $('input').each(function() {
          var el = $(this);

          // Is it a button?
          if (this.getAttribute('type').match(button_regex)) {
            el.addClass('ie6-button');

            /* Is it disabled? */
            if (this.disabled) {
              el.addClass('ie6-button-disabled');
            }
          }
          // Or is it a textual input?
          else if (this.getAttribute('type').match(type_regex)) {
            el.addClass('ie6-input');

            /* Is it disabled? */
            if (this.disabled) {
              el.addClass('ie6-input-disabled');
            }
          }
        });

        $('textarea, select').each(function() {
          /* Is it disabled? */
          if (this.disabled) {
            $(this).addClass('ie6-input-disabled');
          }
        });
      },
      // FORMALIZE.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !$(':input[autofocus]').length) {
          return;
        }

        $(':input[autofocus]:visible:first').focus();
      },
      // FORMALIZE.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        FORMALIZE.misc.add_placeholder();

        $(':input[placeholder]').each(function() {
          var el = $(this);
          var text = el.attr('placeholder');

          el.focus(function() {
            if (el.val() === text) {
              el.val('').removeClass('placeholder-text');
            }
          }).blur(function() {
            FORMALIZE.misc.add_placeholder();
          });

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          el.closest('form').submit(function() {
            if (el.val() === text) {
              el.val('').removeClass('placeholder-text');
            }
          }).bind('reset', function() {
            setTimeout(FORMALIZE.misc.add_placeholder, 50);
          });
        });
      }
    },
    // FORMALIZE.misc
    misc: {
      // FORMALIZE.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        $(':input[placeholder]').each(function() {
          var el = $(this);
          var text = el.attr('placeholder');

          if (!el.val() || el.val() === text) {
            el.val(text).addClass('placeholder-text');
          }
        });
      }
    }
  };
// Alias jQuery, window, document.
})(jQuery, this, this.document);

// Automatically calls all functions in FORMALIZE.init
jQuery(document).ready(function() {
  FORMALIZE.go();
});;
/**
 * @todo
 */

Drupal.omega = Drupal.omega || {};

(function($) {
  /**
   * @todo
   */
  var current;
  var previous;
  
  /**
   * @todo
   */
  var setCurrentLayout = function (index) {
    index = parseInt(index);
    previous = current;
    current = Drupal.settings.omega.layouts.order.hasOwnProperty(index) ? Drupal.settings.omega.layouts.order[index] : 'mobile';

    if (previous != current) {      
      $('body').removeClass('responsive-layout-' + previous).addClass('responsive-layout-' + current);      
      $.event.trigger('responsivelayout', {from: previous, to: current});
    }
  };
  
  /**
   * @todo
   */
  Drupal.omega.getCurrentLayout = function () {
    return current;
  };
  
  /**
   * @todo
   */
  Drupal.omega.getPreviousLayout = function () {
    return previous;
  };
  
  /**
   * @todo
   */
  Drupal.omega.crappyBrowser = function () {
    return $.browser.msie && parseInt($.browser.version, 10) < 9;
  };
  
  /**
   * @todo
   */
  Drupal.omega.checkLayout = function (layout) {
    if (Drupal.settings.omega.layouts.queries.hasOwnProperty(layout) && Drupal.settings.omega.layouts.queries[layout]) {
      var output = Drupal.omega.checkQuery(Drupal.settings.omega.layouts.queries[layout]);
      
      if (!output && layout == Drupal.settings.omega.layouts.primary) {
        var dummy = $('<div id="omega-check-query"></div>').prependTo('body');       

        dummy.append('<style media="all">#omega-check-query { position: relative; z-index: -1; }</style>');
        dummy.append('<!--[if (lt IE 9)&(!IEMobile)]><style media="all">#omega-check-query { z-index: 100; }</style><![endif]-->');
        
        output = parseInt(dummy.css('z-index')) == 100;

        dummy.remove();
      }
      
      return output;
    }

    return false;
  };
  
  /**
   * @todo
   */
  Drupal.omega.checkQuery = function (query) {
    var dummy = $('<div id="omega-check-query"></div>').prependTo('body');       
    
    dummy.append('<style media="all">#omega-check-query { position: relative; z-index: -1; }</style>');
    dummy.append('<style media="' + query + '">#omega-check-query { z-index: 100; }</style>');

    var output = parseInt(dummy.css('z-index')) == 100;
    
    dummy.remove();

    return output;
  };
  
  /**
   * @todo
   */
  Drupal.behaviors.omegaMediaQueries = {
    attach: function (context) {
      $('body', context).once('omega-mediaqueries', function () {
        var primary = $.inArray(Drupal.settings.omega.layouts.primary, Drupal.settings.omega.layouts.order);
        var dummy = $('<div id="omega-media-query-dummy"></div>').prependTo('body');

        dummy.append('<style media="all">#omega-media-query-dummy { position: relative; z-index: -1; }</style>');
        dummy.append('<!--[if (lt IE 9)&(!IEMobile)]><style media="all">#omega-media-query-dummy { z-index: ' + primary + '; }</style><![endif]-->');

        for (var i in Drupal.settings.omega.layouts.order) {
          dummy.append('<style media="' + Drupal.settings.omega.layouts.queries[Drupal.settings.omega.layouts.order[i]] + '">#omega-media-query-dummy { z-index: ' + i + '; }</style>');
        }

        $(window).bind('resize.omegamediaqueries', function () {
          setCurrentLayout(dummy.css('z-index'));
        }).load(function () {
          $(this).trigger('resize.omegamediaqueries');
        });
      });
    }
  };
})(jQuery);;
/**
 * @todo
 */

(function($) {
  /**
   * @todo
   */
  Drupal.behaviors.omegaEqualHeights = {
    attach: function (context) {
      $('body', context).once('omega-equalheights', function () {
        $(window).bind('resize.omegaequalheights', function () {
          $($('.equal-height-container').get().reverse()).each(function () {
            var elements = $(this).children('.equal-height-element').css('height', '');
            
            if (!Drupal.behaviors.hasOwnProperty('omegaMediaQueries') || Drupal.omega.getCurrentLayout() != 'mobile') {
              var tallest = 0;

              elements.each(function () {    
                if ($(this).height() > tallest) {
                  tallest = $(this).height();
                }
              }).each(function() {
                if ($(this).height() < tallest) {
                  $(this).css('height', tallest);
                }
              });
            }
          });
        }).load(function () {
          $(this).trigger('resize.omegaequalheights');
        });
      });
    }
  };
})(jQuery);;
(function ($) {
  // Handle user toolbar when user is admin and have admin toolbar enabled.
  Drupal.behaviors.commerce_kickstart_theme_custom_toolbar = {
    attach: function(context, settings) {
      if ($('body').hasClass('toolbar')) {
        $(window, context).resize(function() {
          var toolbarHeight = $('div#toolbar').height();
          $('.zone-user-wrapper').css('top', toolbarHeight + 'px');
        });
      }
    }
  }
  // Disable input fields on price range when viewing the site
  // on normal devices.
  Drupal.behaviors.commerce_kickstart_theme_custom_search_api_ranges = {
    attach:function (context, settings) {
      $('body').bind('responsivelayout', function(e, d) {
        if ($(this).hasClass("responsive-layout-normal")) {
          $('div.search-api-ranges-widget').each(function() {
            $(this).find('input[name=range-from]').attr('readonly', true).unbind('keyup');
            $(this).find('input[name=range-to]').attr('readonly', true).unbind('keyup');
          });
        }
        else {
          $('body').unbind('responsivelayout');
        }
      });
    }
  }
  // Switch list elements to select lists on faceted blocks.
  Drupal.behaviors.commerce_kickstart_theme_custom_search = {
    attach: function(context, settings) {
      $('body').bind('responsivelayout', function(e, d) {
        if($(this).hasClass("responsive-layout-mobile")) {
          $('.block-facetapi', context).each(function(index) {
            $('.facetapi-checkbox').remove();
            $('.element-invisible').remove();

            // Get block title.
            var list_title;
            $(this).find('.block-title').each(function() {
              list_title = $(this).text().toLowerCase();
            });

            // Get list elements.
            var list_element;
            $(this).find('ul').each(function() {
              list_element = $(this).attr('id');
              $(this).addClass('facetapi-lists');
            });

            if(list_element != 'undefined') {
              selectnav(list_element, {
                label: 'Select a ' + list_title + '...',
                activeclass: 'false'
              });
            }
          });
        }
        else {
          $('body').unbind('responsivelayout');
        }
      });
    }
  }
  
  Drupal.behaviors.commerce_kickstartslideshow_custom = {
    attach: function(context, settings) {

      // Conflict betwwen this script bxslider and ctools for display the modal.
      // Hack: add a class on slider when the pager is displayed and test after if the class exist.
      var processed = $('.event-slider', context).hasClass('pager-processed');
      if (typeof $.fn.bxSlider != 'undefined' && processed == false) {
        // bx Slider.
        var slider = $('.event-slider', context).bxSlider({
          auto: true,
          autoHover: true,
          controls: true,
          pause: 5000,
          hideControlOnEnd: false,
          mode: 'fade',
          prevText: '<span class="control">' + $('.event-slider .views-row:last .views-field-nothing').html() + '</span>',
          nextText: '<span class="control">' + $('.event-slider .views-row-2 .views-field-nothing').html() + '</span>',
          onBeforeSlide: function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject){
            /*var leftSlideNumber = currentSlideNumber == 0 ? (totalSlideQty - 1) : (currentSlideNumber - 1);
            var rightSlideNumber = currentSlideNumber == (totalSlideQty - 1) ? 0 : (currentSlideNumber + 1);
            var leftSlideText = $(currentSlideHtmlObject).parents('.event-slider').find('.views-row-' + (leftSlideNumber + 1) + ':first .views-field-nothing').html();
            var rightSlideText = $(currentSlideHtmlObject).parents('.event-slider').find('.views-row-' + (rightSlideNumber + 1) + ':first .views-field-nothing').html();
            $(currentSlideHtmlObject).parents('.bx-wrapper').find('a.bx-prev span').html(leftSlideText);
            $(currentSlideHtmlObject).parents('.bx-wrapper').find('a.bx-next span').html(rightSlideText);*/
          },
          speed: 400
        });
        $('.event-slider', context).addClass('pager-processed')
      };
    }
  }
  
  $(window).ready(ready);
  $(window).resize(resize);

    function ready(){
        
        
        // very very not nice !!!!
        if($("body").hasClass("front")){
            $('.view-id-homepage').wrap('<div class="grid-15 prefix-2 region region-content" id="region-content" />');
        }
        
        $('#edit-commerce-payment').wrap('<div id="commerce-checkout-coupon-ajax-wrapper" />');
        
        
        $("#region-content h1").splitcolors({classone:"brown", classtwo:"pink"});
        $("#region-content h2").splitcolors({classone:"brown", classtwo:"pink"});
        $("#region-content h3").splitcolors({classone:"brown", classtwo:"pink"});
        //$(".view-yoga-formen .views-field-title a").splitcolors({classone:"brown", classtwo:"pink"});
        
        $("#block-menu-menu-social-networks ul.menu li a").empty();
        $("#block-menu-menu-social-networks ul.menu li a").append('<div class="social-title">'+$("#block-menu-menu-social-networks ul.menu li a").attr("title")+'</div>');
        
        $(".qtip-package").each(function(){
            //console.log("qtip me !!!");
            $(this).find('.qtip-link').qtip({
                id: 'myTooltip',
                content: {
                        text: $(this).find('.qtip-source')
                },
                position: {
                            my: 'bottom left',
                            target:  'mouse',
                            viewport: $(window), // Keep it on-screen at all times if possible
                            adjust: {
                                    x: 20,  y: -10
                            }
                    },
                    hide: {
                            fixed: true // Helps to prevent the tooltip from hiding ocassionally when tracking!
                    },
                    style: 'qtip-class-of-the-day'
                });
        });
        
        resize();

    }
    
    function resize(){
        
    }
  
})(jQuery);
;
