(function () {
    'use strict';
    var b = window,
        d = null,
        e = {};
    d = {};
    Array.prototype.forEach.call(document.querySelectorAll("img[data-iid]"), function (a) {
        d[a.getAttribute("data-iid")] = a
    });
    Array.prototype.forEach.call(document.querySelectorAll("template[id^=_defer]"), function (a) {
        e[a.id] = a
    });
    b._setImgSrcFromTmpl = function (a) {
        var c = e["_defer" + a];
        a = d[a];
        c && a && (a.removeAttribute("data-iid"), a.src = c.content.textContent)
    };
    b._setImgSrc = function (a, c) {
        if (a = d[a]) a.removeAttribute("data-iid"), a.src = c
    };
}).call(this);