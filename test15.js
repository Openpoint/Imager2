window['ei'] = 'jrc6X6TON8aJgQbe5ar4Bw';
(function () {
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    'use strict';
    var e = this || self;

    function f(a, b) {
        b = void 0 === b ? e.location : b;
        return (a = b.search.match(new RegExp("[?&]" + a + "=(\\d+)"))) ? Number(a[1]) : void 0
    }

    function g(a) {
        a = void 0 === a ? e.location : a;
        var b = void 0,
            c = void 0,
            d = f("qsubts", a);
        a = f("fbts", a);
        d && 0 < d && (b = d, a && 0 < a && (c = Math.max(d, a)));
        return {
            g: b,
            h: c
        }
    };

    function h() {
        return !(!window.performance || !window.performance.timing)
    };
    window.ebp = function (a, b) {
        b = void 0 === b ? e.location : b;
        var c = b;
        b = g(c).g;
        b = void 0 !== b ? window.performance && window.performance.now && h() ? b - performance.timing.navigationStart : b : window.cc_latency_start_time;
        c = g(c).h;
        c = void 0 !== c ? h() ? c - performance.timing.navigationStart : c : window.performance && window.performance.now ? performance.timing.responseStart - performance.timing.navigationStart : h() ? performance.timing.responseStart : null;
        null == b || null == c || c < b || 0 !== a && c > a ? a = null : (b = c - b, a = 0 === a ? null : a - c, a = {
            source: "images",
            eventId: window.ei,
            metrics: null == a ? "wsrt." + b.toFixed() : "wsrt." + b.toFixed() + ",aft." + a.toFixed()
        });
        return a
    };
}).call(this);