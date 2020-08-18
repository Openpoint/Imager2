(function () {
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    var aa = function () {
            var a = v,
                b = 0;
            return function () {
                return b < a.length ? {
                    done: !1,
                    value: a[b++]
                } : {
                    done: !0
                }
            }
        },
        ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
            if (a == Array.prototype || a == Object.prototype) return a;
            a[b] = c.value;
            return a
        },
        ca = function (a) {
            a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                if (c && c.Math == Math) return c
            }
            throw Error("a");
        },
        da =
        ca(this),
        ea = function (a, b) {
            if (b) a: {
                var c = da;a = a.split(".");
                for (var d = 0; d < a.length - 1; d++) {
                    var e = a[d];
                    if (!(e in c)) break a;
                    c = c[e]
                }
                a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && ba(c, a, {
                    configurable: !0,
                    writable: !0,
                    value: b
                })
            }
        },
        fa = "function" == typeof Object.create ? Object.create : function (a) {
            var b = function () {};
            b.prototype = a;
            return new b
        },
        x;
    if ("function" == typeof Object.setPrototypeOf) x = Object.setPrototypeOf;
    else {
        var A;
        a: {
            var ha = {
                    R: !0
                },
                ia = {};
            try {
                ia.__proto__ = ha;
                A = ia.R;
                break a
            } catch (a) {}
            A = !1
        }
        x = A ? function (a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
            return a
        } : null
    }
    var ja = x;
    ea("Math.trunc", function (a) {
        return a ? a : function (b) {
            b = Number(b);
            if (isNaN(b) || Infinity === b || -Infinity === b || 0 === b) return b;
            var c = Math.floor(Math.abs(b));
            return 0 > b ? -c : c
        }
    });
    var B = "closure_uid_" + (1E9 * Math.random() >>> 0),
        ka = 0,
        la = function (a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a
        };
    var ma = Array.prototype.indexOf ? function (a, b) {
            return Array.prototype.indexOf.call(a, b, void 0)
        } : function (a, b) {
            if ("string" === typeof a) return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
            for (var c = 0; c < a.length; c++)
                if (c in a && a[c] === b) return c;
            return -1
        },
        na = Array.prototype.forEach ? function (a, b, c) {
            Array.prototype.forEach.call(a, b, c)
        } : function (a, b, c) {
            for (var d = a.length, e = "string" === typeof a ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
        },
        ra = Array.prototype.reduce ? function (a, b, c) {
            return Array.prototype.reduce.call(a,
                b, c)
        } : function (a, b, c) {
            var d = c;
            na(a, function (e, f) {
                d = b.call(void 0, d, e, f, a)
            });
            return d
        },
        sa = function (a) {
            return Array.prototype.concat.apply([], arguments)
        },
        ta = function (a) {
            var b = a.length;
            if (0 < b) {
                for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
                return c
            }
            return []
        },
        ua = function (a) {
            for (var b = {}, c = 0, d = 0; d < a.length;) {
                var e = a[d++];
                var f = e;
                var k = typeof f;
                f = "object" == k && null != f || "function" == k ? "o" + (Object.prototype.hasOwnProperty.call(f, B) && f[B] || (f[B] = ++ka)) : (typeof f).charAt(0) + f;
                Object.prototype.hasOwnProperty.call(b,
                    f) || (b[f] = !0, a[c++] = e)
            }
            a.length = c
        };
    var C;
    a: {
        var va = (this || self).navigator;
        if (va) {
            var wa = va.userAgent;
            if (wa) {
                C = wa;
                break a
            }
        }
        C = ""
    };
    var xa = function (a) {
            return String(a).replace(/\-([a-z])/g, function (b, c) {
                return c.toUpperCase()
            })
        },
        ya = function (a) {
            return a.replace(/(^|[\s]+)([a-z])/g, function (b, c, d) {
                return c + d.toUpperCase()
            })
        };
    var za = -1 != C.indexOf("Opera"),
        Aa = -1 != C.indexOf("Trident") || -1 != C.indexOf("MSIE"),
        Ba = -1 != C.indexOf("Gecko") && !(-1 != C.toLowerCase().indexOf("webkit") && -1 == C.indexOf("Edge")) && !(-1 != C.indexOf("Trident") || -1 != C.indexOf("MSIE")) && -1 == C.indexOf("Edge"),
        Ca = -1 != C.toLowerCase().indexOf("webkit") && -1 == C.indexOf("Edge");
    var v = [
        [0, 448],
        [1300, 590],
        [1900, 800]
    ];
    /*

     Copyright 2011 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    /*

     Copyright 2013 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    var Ea = function (a, b, c) {
            var d = Da[c];
            if (!d) {
                var e = xa(c);
                d = e;
                void 0 === a.style[e] && (e = (Ca ? "Webkit" : Ba ? "Moz" : Aa ? "ms" : za ? "O" : null) + ya(e), void 0 !== a.style[e] && (d = e));
                Da[c] = d
            }(c = d) && (a.style[c] = b)
        },
        Da = {};
    var D = function (a) {
        a instanceof D ? a = a.C : a[0] instanceof D && (a = ra(a, function (b, c) {
            return sa(b, c.C)
        }, []), ua(a));
        this.C = ta(a)
    };
    D.prototype.a = function (a) {
        na(this.C, a, void 0);
        return this
    };
    D.prototype.get = function (a) {
        return this.C[a] || null
    };
    var E = function (a, b) {
        var c = [];
        a.a(function (d) {
            d = d.querySelectorAll(String(b));
            for (var e = 0; e < d.length; e++) c.push(d[e])
        });
        return new D(c)
    };
    D.prototype.next = function (a) {
        return Fa(this, a)
    };
    var Fa = function (a, b) {
            var c = [],
                d;
            b ? d = Ga(b) : d = Ha;
            a.a(function (e) {
                if (void 0 !== e.nextElementSibling) e = e.nextElementSibling;
                else
                    for (e = e.nextSibling; e && 1 != e.nodeType;) e = e.nextSibling;
                e && d(e) && c.push(e)
            });
            return new D(c)
        },
        Ia = function (a, b, c) {
            return a.a(function (d) {
                d.setAttribute(b, c)
            })
        },
        H = function (a, b, c) {
            a.a(function (d) {
                if ("string" === typeof b) Ea(d, c, b);
                else
                    for (var e in b) Ea(d, b[e], e)
            })
        },
        K = function (a, b) {
            a instanceof D && (b = a.C, a = null);
            D.call(this, null != a ? [a] : b)
        };
    la(K, D);
    K.prototype.a = function (a) {
        a.call(void 0, this.C[0], 0);
        return this
    };
    var Ja = /^\[([a-z0-9-]+)(="([^\\"]*)")?]$/,
        Ga = function (a) {
            if ("string" == typeof a) {
                if ("." == a.substr(0, 1)) return Ka(a.substr(1));
                if ("[" == a.substr(0, 1)) {
                    var b = Ja.exec(a);
                    return La(b[1], -1 == a.indexOf("=") ? void 0 : b[3])
                }
                return Ma(a)
            }
            return a
        },
        Ka = function (a) {
            return function (b) {
                var c;
                if (c = b.getAttribute) b.classList ? b = b.classList.contains(a) : (b = b.classList ? b.classList : ("string" == typeof b.className ? b.className : b.getAttribute && b.getAttribute("class") || "").match(/\S+/g) || [], b = 0 <= ma(b, a)), c = b;
                return c
            }
        },
        La = function (a,
            b) {
            return function (c) {
                return void 0 !== b ? c.getAttribute && c.getAttribute(a) == b : c.hasAttribute && c.hasAttribute(a)
            }
        },
        Ma = function (a) {
            a = a.toUpperCase();
            return function (b) {
                return (b = b.tagName) && b.toUpperCase() == a
            }
        },
        Ha = function () {
            return !0
        };

    function M(a) {
        return 0 == a ? "" : a + "px"
    }

    function N(a, b) {
        return parseInt(O(a, b), 10) || 0
    }

    function O(a, b) {
        return a.getAttribute("data-" + b)
    }
    var P = function (a) {
            this.element = a;
            this.D = !!O(this.element, "bc");
            this.o = N(this.element, "ct");
            this.s = N(this.element, "cb");
            this.m = N(this.element, "cl");
            this.B = N(this.element, "cr");
            this.M = !!O(this.element, "sc");
            this.L = N(this.element, "ow");
            this.K = N(this.element, "oh");
            this.width = N(this.element, "tw");
            this.height = this.width * this.K / this.L;
            this.P = !!O(this.element, "rm");
            this.g = null != this.element.querySelector(".islir");
            this.u = -1;
            this.N = !!O(this.element, "crl");
            this.O = !!O(this.element, "ismultirow");
            this.A = N(this.element,
                "ri")
        },
        Na = function (a, b) {
            var c = b.height,
                d = b.width;
            b = c - 42;
            var e = a.width,
                f = a.height;
            if (a.width > d || a.height > b) {
                e = d / b;
                var k = Math.min(Q(a), Math.max(e, R(a)));
                a.width / a.height > k ? (k = Math.min(a.height, d / k), e = a.width / a.height * k, f = k) : (e = k = Math.min(a.width, k > e ? d : b * k), f = k / (a.width / a.height))
            }
            e = Math.ceil(e);
            f = Math.ceil(f);
            k = d - e;
            var g = 0 < k || 0 == a.m && 0 == a.B ? Math.ceil(k / 2) : Math.ceil(a.m / (a.m + a.B) * k),
                m = b - f;
            m = 0 < m || 0 == a.o && 0 == a.s ? Math.ceil(m / 2) : Math.ceil(a.o / (a.o + a.s) * m);
            d = {
                width: M(d)
            };
            d[a.g ? "height" : "minHeight"] = M(a.g ?
                c : b);
            c = {
                height: M(f),
                marginLeft: M(g),
                marginRight: M(k - g),
                marginTop: M(m)
            };
            a = new K(a.element);
            H(a, d);
            H(E(a, ".islib"), "height", M(b));
            H(E(a, ".islir"), c);
            Ia(Ia(E(a, ".islir img"), "width", e), "height", f)
        },
        R = function (a) {
            if (a.D) return a.width / a.height;
            var b = (a.m + a.B) / 100;
            a.M || (b = Math.min(1, b + .1));
            return (a.width - a.width * b) / a.height
        },
        Q = function (a) {
            if (a.D) return a.width / a.height;
            var b = (a.o + a.s) / 100;
            a.M || (b = Math.min(1, b + .1));
            return a.width / (a.height - a.height * b)
        };
    var S = function (a) {
        P.call(this, a);
        this.v = this.L;
        this.j = this.K;
        this.l = this.c = !1;
        this.a = this.f = 0;
        this.i = -1
    };
    S.prototype = fa(P.prototype);
    S.prototype.constructor = S;
    if (ja) ja(S, P);
    else
        for (var T in P)
            if ("prototype" != T)
                if (Object.defineProperties) {
                    var Oa = Object.getOwnPropertyDescriptor(P, T);
                    Oa && Object.defineProperty(S, T, Oa)
                } else S[T] = P[T];
    var Pa = function () {
            this.a = []
        },
        Qa = function (a, b, c, d) {
            d = void 0 === d ? !1 : d;
            for (var e = [], f = [], k = 0; 4 > k; k++) {
                var g = a,
                    m = b,
                    t = c,
                    F = e;
                f = [];
                for (var q = 0, l, h = g, p = 0; p < h.a.length; p++) h.a[p].c ? 0 < h.a[p].f && (h.a[p].a = h.a[p].f) : (h.a[p].i = -1, h.a[p].a = 0, h.a[p].l = !1);
                p = 0;
                h = [];
                var L = F.length || m.length;
                a: {
                    var n = g.a;
                    for (var u = 0; u < n.length; u++)
                        if (!n[u].c || 0 < n[u].f) {
                            n = u;
                            break a
                        } n = n.length
                }
                for (u = 0; u < L; u++) {
                    var y = 0,
                        w = 0;
                    l = t;
                    var I = F[u] || 222;
                    if (p < m.length) {
                        w = I;
                        if (n >= g.a.length) w = 0;
                        else {
                            var r = g.a[n];
                            r.c && !r.f ? w = 3 : m[p].A < r.A || t < r.v ? w =
                                0 : 0 > r.i ? (r.i = p, r.a += w - 6, w = 1) : r.a > r.j ? w = 3 : (r.a += w + 20, w = 2)
                        }
                        2 === w || 1 === w ? (y = g.a[n].v + 20, l = t - y) : 3 === w && n++
                    }
                    for (var oa = r = 0, pa = 0, J = 0, qa = 0; p < m.length;) {
                        var z = m[p],
                            G = U(z, I);
                        G = r + G + 20;
                        var bb = z.g ? V(z, R(z), I) : W(z);
                        oa += bb + 20;
                        if (oa > l && (0 < J || 0 < y)) break;
                        else if (G > l && G - l > l - r && pa >= l) break;
                        J++;
                        r = G;
                        G = z.g ? V(z, Q(z), I) : W(z);
                        pa += G + 20;
                        qa += z.width / z.height;
                        p++;
                        if (r > l) break
                    }
                    if (0 == J)
                        if (0 < y) {
                            1 === w ? (g.a[n].l = !0, g.a[n].a = g.a[n].j) : p < m.length && (g.a[n].a = g.a[n].j);
                            n++;
                            u--;
                            continue
                        } else break;
                    h[u] = {
                        count: J,
                        width: r,
                        height: I,
                        J: void 0,
                        S: y
                    };
                    m.length <= p && l - r > r / J && n < g.a.length && 0 < y && (2 === w ? g.a[n].a -= I + 20 : 1 === w && (g.a[n].i = -1, g.a[n].a = 0, g.a[n].l = !1));
                    l = 1 / Math.sqrt((qa + .1) / (J + .1));
                    f.push(l);
                    q += l
                }
                g = f.length;
                m = 222 * g;
                for (t = 0; t < g; t++) h[t].J = Math.ceil(f[t] / q * m);
                f = h;
                q = !1;
                f.length != e.length && (e.length = f.length, q = !0);
                for (h = 0; h < f.length; h++) e[h] != f[h].J && (e[h] = f[h].J, q = !0);
                if (!q) break
            }
            a = f;
            e = 0;
            k = {
                results: [],
                H: [],
                I: [],
                G: 0,
                F: 0
            };
            for (f = 0; f < a.length; f++) {
                q = a[f];
                if (!q.count) break;
                h = c - q.S;
                g = b.slice(e, e + q.count);
                m = h - q.width;
                if ((m = e + q.count == b.length &&
                        m > q.width / q.count) && !d) break;
                m && (k.G = q.count, k.F = q.height);
                t = h;
                F = q.height;
                h = [];
                if (g.length) {
                    p = t - q.width;
                    L = [];
                    n = 0;
                    if (0 > p || !m)
                        for (u = 0; u < g.length; u++) l = g[u], l = (0 > p ? l.g ? V(l, R(l), F) : W(l) : l.g ? V(l, Q(l), F) : W(l)) - U(l, F), L[u] = l, n += l;
                    for (l = u = 0; l < g.length; l++) y = 0 <= p ? Math.min : Math.max, y = m || 0 == n ? 0 : y(L[l], p * L[l] / n), y = Math.ceil(Math.max(145, U(g[l], F) + y)), u += y + 20, h.push(y);
                    if (!m)
                        if (m = t - u, 0 > m)
                            for (g = h.length - 1; - 1 < g && (t = Math.max(m, 145 - h[g]), h[g] += t, m -= t, 0 != m); g--);
                        else {
                            g = Math.trunc(m / g.length);
                            for (t = 0; g && t < h.length; t++) h[t] +=
                                g, m -= g;
                            h[h.length - 1] += m
                        }
                }
                for (g = 0; g < h.length; g++) k.results.push({
                    width: h[g],
                    height: q.height
                });
                e += q.count;
                k.H.push(q.height);
                k.I.push(q)
            }
            return k
        },
        U = function (a, b) {
            return a.g ? V(a, a.width / a.height, b) : W(a)
        },
        W = function (a) {
            0 > a.u && (a.u = Math.ceil(a.element.getBoundingClientRect().width));
            return a.u
        },
        V = function (a, b, c) {
            return Math.max(Math.min((c - 42) * Math.min(b, 2), a.width), 145)
        };
    var X = function () {
        var a = document.getElementById("islrg");
        this.D = a;
        this.c = a.querySelector(".islrc");
        this.j = a.querySelector(".islrh");
        this.a = [];
        this.g = [];
        this.l = null;
        this.u = !1;
        this.height = 0;
        this.c.style.width = Math.max(this.D.clientWidth, 145) + 20 + "px";
        this.B = new Pa;
        this.i = !1;
        this.v = !!this.c.getAttribute("data-dci");
        this.m = this.o = 0;
        this.A = [];
        this.f = []
    };
    X.prototype.b = function (a) {
        Ra(this, a)
    };
    X.prototype.mc = function () {
        this.i || (this.i = !0, Sa(this))
    };
    var Ra = function (a, b) {
            if (a.i) {
                a.i = !1;
                a.height -= a.m;
                var c = a.a.length - a.o;
                a.g = a.a.slice(c, a.a.length);
                a.a = a.a.slice(0, c)
            }
            Ta(a, b);
            Sa(a)
        },
        Ta = function (a, b) {
            var c = [];
            c.push.apply(c, b.querySelectorAll(".isv-r"));
            c.forEach(function (d) {
                var e = new P(d);
                e.N ? a.l = e : e.O ? a.f.push(new S(d)) : e.P ? (e.element.style.display = "none", e.element.parentElement !== a.c && a.c.appendChild(e.element)) : a.g.push(e)
            });
            a.B.a = a.f
        },
        Ua = function (a, b, c) {
            if (a.l && !a.u) {
                for (var d = a.l.A, e = 0; e < b.length && c < d; e++) c += b[e].count;
                c >= d && (a.a[c - 1].element.insertAdjacentElement("afterend",
                    a.l.element), a.u = !0)
            }
        },
        Va = function (a, b) {
            if (!(0 >= a.f.length))
                for (var c = 0; c < a.f.length; c++) {
                    var d = a.f[c];
                    if (!d.c || d.f) {
                        var e = d.i + b;
                        if (0 > d.i || e >= a.a.length && !d.c) a.j.appendChild(d.element);
                        else {
                            d.element.style.width = (d.l ? parseInt(a.c.style.width, 10) - 20 : d.v) + "px";
                            var f = d.a;
                            d.j > d.a ? (f = d.j, d.f = d.a) : d.f = 0;
                            d.element.style.height = f + "px";
                            d.c || (a.a[e].element.insertAdjacentElement("beforebegin", d.element), d.c = !0, d.l && (a.height += d.a))
                        }
                    }
                }
        },
        Wa = function (a) {
            for (var b = 0; b < a.f.length; b++) a.f[b].c = !1, a.f[b].f = 0
        },
        Sa =
        function (a) {
            var b = Qa(a.B, a.g, parseInt(a.c.style.width, 10), a.i || a.v);
            a.o = b.G;
            a.m = b.F;
            for (var c = a.a.length; 0 < b.results.length;) Xa(a, a.g.shift(), b.results.shift());
            Ua(a, b.I, c);
            Va(a, c);
            a.g.forEach(function (d) {
                d.element.parentElement !== a.j && a.j.appendChild(d.element)
            });
            a.height += b.H.reduce(function (d, e) {
                return d + e + 20
            }, 0);
            Ya(a)
        },
        Xa = function (a, b, c) {
            Na(b, c);
            b.element.parentElement !== a.c && a.c.appendChild(b.element);
            a.a.push(b)
        };
    X.prototype.h = function () {
        return this.height
    };
    var Za = function (a, b) {
        var c = null,
            d = 0;
        a.u = !1;
        Wa(a);
        if (a.s)
            for (var e = 0; e < a.a.length && !(c = a.a[e].element, d = c.getBoundingClientRect().top, 0 <= d); e++);
        e = a.a.concat(a.g);
        var f = Qa(a.B, e, b, a.i || a.v);
        a.o = f.G;
        a.m = f.F;
        a.a = e.slice(0, f.results.length);
        a.g = e.slice(f.results.length);
        a.c.style.width = b + "px";
        a.a.forEach(function (k, g) {
            Na(k, f.results[g]);
            k.element.parentElement !== a.c && a.c.appendChild(k.element)
        });
        Ua(a, f.I, 0);
        Va(a, 0);
        a.g.forEach(function (k) {
            k.element.parentElement !== a.j && a.j.appendChild(k.element)
        });
        a.height =
            f.H.reduce(function (k, g) {
                return k + g + 20
            }, 0);
        a.s && c && (a.s.scrollTop = a.s.scrollTop + c.getBoundingClientRect().top - d)
    };
    X.prototype.r = function (a) {
        var b = Math.max(this.D.clientWidth, 145) + 20;
        if (a || parseInt(this.c.style.width, 10) != b) a && (this.i = !1, this.v = this.c.hasAttribute("data-dci"), this.m = this.o = 0), Za(this, b)
    };
    X.prototype.cf = function (a) {
        this.s = a
    };
    X.prototype.anrc = function (a) {
        this.A.push(a)
    };
    var Ya = function (a) {
        for (var b = 0; b < a.A.length; ++b) try {
            a.A[b]()
        } catch (c) {}
    };
    X.prototype.anrc = X.prototype.anrc;
    X.prototype.cf = X.prototype.cf;
    X.prototype.r = X.prototype.r;
    X.prototype.h = X.prototype.h;
    X.prototype.mc = X.prototype.mc;
    X.prototype.b = X.prototype.b;
    try {
        if (/imgrc=(?!_?(&|$))/.test(window.location.hash)) {
            var Y = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (Y && 500 < Y) {
                var $a = document.getElementById("islmp"),
                    ab = document.getElementById("islsp"),
                    cb = document.getElementById("islspvrs"),
                    Z = 0,
                    db, eb = "undefined" != typeof Symbol && Symbol.iterator && v[Symbol.iterator],
                    fb;
                eb ? fb = eb.call(v) : fb = {
                    next: aa()
                };
                db = fb;
                for (var gb = db.next(); !gb.done; gb = db.next()) {
                    var hb = gb.value;
                    Y > hb[0] && (Z = hb[1])
                }
                var ib = Y - Z;
                ab.style.width = Z + "px";
                $a.style.width =
                    ib + "px";
                ab.style.display = "";
                cb.style.display = ""
            }
        }
    } catch (a) {}
    window.isl = new X;
    var jb = document.getElementById("is-results");
    jb && Ra(window.isl, jb);
}).call(this);