(function () {
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    'use strict';
    var a = !1,
        e = window,
        m = e.performance,
        p = n();
    e.cc_latency_start_time = m && m.now ? 0 : m && m.timing && m.timing.navigationStart ? m.timing.navigationStart : p;

    function n() {
        return m && m.now ? m.now() : (new Date).getTime()
    }

    function q(c) {
        if (m && m.now && m.mark) {
            var f = m.mark(c);
            if (f) return f.startTime;
            if (m.getEntriesByName && (c = m.getEntriesByName(c).pop())) return c.startTime
        }
        return n()
    }
    e.onaft = function (c) {
        q("aft");
        e.isPreloadSupported && e.isPreloadSupported() && e.executeBaseJs();
        if (!a && e.ebp) {
            var f = e.ebp(c);
            if (null !== f) {
                c = f.source;
                var h = f.eventId;
                f = f.metrics;
                c && h && f && (c = "/gen_204?s=" + c + "&t=aft&atyp=csi&ei=" + h + "&rt=" + f, window.performance && ((h = window.performance.navigation) && h.type === h.TYPE_RELOAD && (c += "&r=1"), h && h.type === h.TYPE_BACK_FORWARD && (c += "&bb=1")), navigator.sendBeacon ? navigator.sendBeacon(c, "") : (new Image).src = c, a = !0)
            }
        }
    };
    e._isLazyImage = function (c) {
        return c.hasAttribute("data-src") || c.hasAttribute("data-ils") || "lazy" === c.getAttribute("loading")
    };
    e.l = function (c) {
        function f(b) {
            var d = {};
            d[b] = n();
            e.cc_latency.push(d)
        }

        function h(b) {
            var d = q("iml");
            b.setAttribute("data-iml", d);
            return d
        }
        e.cc_aid = c;
        e.iml_start = e.cc_latency_start_time;
        e.css_size = 0;
        e.cc_latency = [];
        e.ccTick = f;
        e.onJsLoad = function () {
            f("jsl")
        };
        e.onCssLoad = function () {
            f("cssl")
        };
        e._isVisible = function (b, d, k) {
            var g = void 0 === k ? {} : k;
            k = g.b;
            g = void 0 === g.a ? !1 : g.a;
            if (!d || "none" == d.style.display) return !1;
            var l = b.defaultView;
            if (l && l.getComputedStyle && (l = l.getComputedStyle(d), "0px" == l.height || "0px" ==
                    l.width || "hidden" == l.visibility && !g)) return !1;
            if (!d.getBoundingClientRect) return !0;
            g = k ? k : d.getBoundingClientRect();
            d = g.left + e.pageXOffset;
            k = g.top + e.pageYOffset;
            if (0 > k + g.height || 0 > d + g.width || 0 >= g.height || 0 >= g.width) return !1;
            b = b.documentElement;
            return k <= (e.innerHeight || b.clientHeight) && d <= (e.innerWidth || b.clientWidth)
        };
        e._recordImlEl = h;
        document.documentElement.addEventListener("load", function (b) {
            b = b.target;
            var d;
            "IMG" != b.tagName || b.hasAttribute("data-iid") || e._isLazyImage(b) || b.hasAttribute("data-noaft") ||
                (d = h(b));
            if (e.aft_counter && (b = e.aft_counter.indexOf(b), -1 !== b && (b = 1 === e.aft_counter.splice(b, 1).length, 0 === e.aft_counter.length && b && d))) e.onaft(d)
        }, !0);
        e.prt = -1;
        e.wiz_tick = function () {
            var b = q("prt");
            e.prt = b
        }
    };
}).call(this);
l('TvbFac')