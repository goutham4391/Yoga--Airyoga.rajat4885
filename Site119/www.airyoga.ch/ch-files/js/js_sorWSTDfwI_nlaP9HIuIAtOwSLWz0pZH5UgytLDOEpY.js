(function($) {
   
    $(window).ready(ready);

    function ready(){
        
        
        $('#block-views-classes-schedule-block-1').addClass("block-gold");
        
        $('#block-views-classes-schedule-block-1 h2.block-title').addClass("gold");
        $('#block-views-classes-schedule-block-1 h2.block-title').splitcolors({classone:"bold", classtwo:"nobold"});
        $('#block-views-classes-schedule-block-1 h2.block-title').addClass("text-center");
        
        $('#block-views-classes-schedule-block-1 .view-classes-schedule .view-content').wrap('<div class="view-content-wrapper" />');
        
        /*$('.block-classes-of-the-day-block .views-field-field-teacher-tag').each(function(){
            
            $(this).qtip({
                    content: '<div style="float:left; margin:5px 10px 0px 0;">'+$(this).find(".field-name-field-mbo-image").html()+"</div><br />"+$(this).find(".taxonomy-term-description").html(),
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
            
            
        });*/
        
        /*$('.block-classes-of-the-day-block .views-field-title').each(function(){
            
            $(this).qtip({
                    content: '<h2>'+$(this).html()+'</h2>'+"<br />"+$(this).parent().find(".views-field-body").html(),
                    position: {
                            my: 'bottom left',
                            target: 'mouse',
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
            
            
        });*/
        

    }
    
})(jQuery);;
