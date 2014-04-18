jQuery(document).ready(function () {
    /*
     * Tabs change on product details page - product descriptions
     */
        jQuery('.tabd').click(function () {
            var oldTab = jQuery('.tabd_open');
            var oldTabDesc = jQuery('#tabDesc'+ jQuery('.tabd_open').attr('id'));

            var newTab = jQuery(this);
            var newTabDesc = jQuery('#tabDesc'+ jQuery(this).attr('id'));

            oldTab.removeClass('tabd_open');
            oldTab.removeClass('open');
            oldTab.addClass('tabd_closed');
            oldTab.addClass('closed');
            oldTabDesc.addClass('hide');

            newTab.removeClass('tabd_closed');
            newTab.removeClass('closed');
            newTab.addClass('tabd_open');
            newTab.addClass('open');
            newTabDesc.removeClass('hide');
        });

        /*
         * Initialize product details mail popup
         */
        jQuery('#askProductQuestion').click(function () {
            jQuery('#checkOutPopup').bPopup({
                easing: 'easeOutBack', //uses jQuery easing plugin
                speed: 450,
                transition: 'slideDown',
                modalClose: false
            })
        }) ;

        /*
         * Initialize rating popup
         */
        jQuery('#rateProduct').click(function () {
            jQuery('#rateProductPopup').bPopup({
                easing: 'easeOutBack', //uses jQuery easing plugin
                speed: 450,
                transition: 'slideDown',
                modalClose: false,
                onClose: function() { jQuery("#rateOpinionText").removeClass("redBorder"); }
            })
        }) ;

        jQuery('#ratyRating').raty({
            starOn   : 'images/icons/stars/star-on.png',
            starOff  : 'images/icons/stars/star-off.png',
            width    : 300,
            click: function(score, evt) {
                jQuery('#currentRatingScore').val(score);
            }
        });
});