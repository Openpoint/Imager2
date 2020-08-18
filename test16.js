(function () {
    var a = document.getElementsByClassName("itb-h")[0],
        b = a.getElementsByClassName("itb-st")[0];
    if (b) {
        var c = b.getBoundingClientRect(),
            d = a.getBoundingClientRect();
        if (c.left < d.left || c.right > d.right) {
            var e = "rtl" == window.getComputedStyle(a).getPropertyValue("direction") ? a.clientWidth - 125 - b.clientWidth : 125;
            a.scrollLeft += c.left - (d.left + e)
        }
    };
}).call(this);