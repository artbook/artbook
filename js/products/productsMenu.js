menuJS = {
    toggleDiv: function (divid) {
        if (document.getElementById(divid).className == 'toggle_open togglePaddBtm') {
            document.getElementById(divid).className = 'toggle_close togglePaddBtm';
        } else {
            document.getElementById(divid).className = 'toggle_open togglePaddBtm';
        }
    },
    toggleImage: function (divid) {
        if (document.getElementById(divid).className == 'left_nav_close') {
            document.getElementById(divid).className = 'left_nav_open';
        } else {
            document.getElementById(divid).className = 'left_nav_close';
        }
    }
}