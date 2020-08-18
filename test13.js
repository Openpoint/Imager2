this.gbar_ = this.gbar_ || {};
(function (_) {
    var window = this;
    try {
        /*

         Copyright The Closure Library Authors.
         SPDX-License-Identifier: Apache-2.0
        */
        _.Kd = !_.x || _.ic(9);
        _.Ld = !_.x || _.ic(9);
        _.Md = _.x && !_.gc("9");
        _.Nd = function () {
            if (!_.p.addEventListener || !Object.defineProperty) return !1;
            var a = !1,
                b = Object.defineProperty({}, "passive", {
                    get: function () {
                        a = !0
                    }
                });
            try {
                _.p.addEventListener("test", _.va, b), _.p.removeEventListener("test", _.va, b)
            } catch (c) {}
            return a
        }();
        _.Od = _.Sb ? "webkitTransitionEnd" : _.Ob ? "otransitionend" : "transitionend";

    } catch (e) {
        _._DumpException(e)
    }
    try {
        _.Pd = function (a, b, c) {
            if (!a.o)
                if (c instanceof Array) {
                    c = _.ia(c);
                    for (var d = c.next(); !d.done; d = c.next()) _.Pd(a, b, d.value)
                } else {
                    d = (0, _.q)(a.F, a, b);
                    var e = a.D + c;
                    a.D++;
                    b.setAttribute("data-eqid", e);
                    a.B[e] = d;
                    b && b.addEventListener ? b.addEventListener(c, d, !1) : b && b.attachEvent ? b.attachEvent("on" + c, d) : a.C.log(Error("n`" + b))
                }
        };

    } catch (e) {
        _._DumpException(e)
    }
    try {
        var Qd = document.querySelector(".gb_C .gb_D"),
            Rd = document.querySelector("#gb.gb_Lc");
        Qd && !Rd && _.Pd(_.Ad, Qd, "click");

    } catch (e) {
        _._DumpException(e)
    }
    try {
        var Ah = function (a) {
            _.I.call(this);
            this.F = a;
            this.A = null;
            this.o = {};
            this.H = {};
            this.j = {};
            this.C = null
        };
        _.n(Ah, _.I);
        _.Bh = function (a) {
            if (a.A) return a.A;
            for (var b in a.j)
                if (a.j[b].$e() && a.j[b].Tb()) return a.j[b];
            return null
        };
        Ah.prototype.D = function (a) {
            this.j[a] && (_.Bh(this) && _.Bh(this).Xc() == a || this.j[a].xe(!0))
        };
        Ah.prototype.$a = function (a) {
            this.C = a;
            for (var b in this.j) this.j[b].$e() && this.j[b].$a(a)
        };
        Ah.prototype.B = function (a) {
            this.j[a.Xc()] = a
        };
        var Ch = new Ah(_.M);
        _.Mc("dd", Ch);

    } catch (e) {
        _._DumpException(e)
    }
    try {
        var oj = document.querySelector(".gb_Ua .gb_D"),
            pj = document.querySelector("#gb.gb_Lc");
        oj && !pj && _.Pd(_.Ad, oj, "click");

    } catch (e) {
        _._DumpException(e)
    }
})(this.gbar_);
// Google Inc.