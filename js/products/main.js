$(function(){
    simpleCart({
        cartColumns: [
            { view: function(item, column){
                return	"<span>"+item.get('quantity')+"</span>" +
                        "<div>" +
                        "<a href='javascript:;' class='simpleCart_increment'><img src='../../images/cartImages/increment.png' title='+1' alt='arrow up'/></a>" +
                        "<a href='javascript:;' class='simpleCart_decrement'><img src='../../images/cartImages/decrement.png' title='-1' alt='arrow down'/></a>" +
                        "</div>";
                }, attr: 'custom'},
            { attr: "name" , label: false },
            { attr: "pid"},
            { view: 'currency', attr: "total" , label: false  }
        ],
        cartStyle: 'div',
        checkout: {
            type: 'angular',
            url: "checkout"
        }
    });
    simpleCart.currency({
        code: "RON" ,
        name: "LEU" ,
        symbol: "" ,
        delimiter: " " ,
        decimal: "," ,
        after: true ,
        accuracy: 2
    });

    $(".cartInfo").toggle(function(){
        $("#cartPopover").show();
        $(".cartInfo").addClass('open');
    }, function(){
        $("#cartPopover").hide();
        $(".cartInfo").removeClass('open');
    });
});

jQuery(document).ready(function () {
    jQuery('.orderlistcontainer').hover(
        function () {
            jQuery(this).find('.orderlist').stop().show()
        },
        function () {
            jQuery(this).find('.orderlist').stop().hide()
        }
    )

    /*
     * Tabs change on products page 2view -> 3view
     */
    jQuery('.tab').click(function () {
        if (jQuery(this).parent().hasClass('ui-state-active')) {
            return;
        }

        var oldTabLink = jQuery('.ui-state-active');
        var newTabLink = jQuery(this).parent();

        var oldTab = jQuery("#tabs-" + oldTabLink.attr('id').replace('tabs_', ''));
        var newTab = jQuery("#tabs-" + newTabLink.attr('id').replace('tabs_', ''));
        oldTabLink.removeClass('ui-state-active');
        oldTabLink.removeClass('ui-tabs-selected');

        newTabLink.addClass('ui-state-active');
        newTabLink.addClass('ui-tabs-selected');

        oldTab.addClass('ui-tabs-hide');
        newTab.removeClass('ui-tabs-hide');
    });

    /*
     * Checkout popup
     */

    jQuery('#checkOutPopup').click(function () {
        jQuery('#checkOutPopup').bPopup({
            easing: 'easeOutBack', //uses jQuery easing plugin
            speed: 450,
            transition: 'slideDown',
            modalClose: false
        })
    }) ;
});
