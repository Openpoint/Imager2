(function () {
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    'use strict';
    var d = this || self,
        f = Date.now;
    /*

     Copyright 2011 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    /*

     Copyright 2013 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    var u = {};

    function aa(a, b) {
        if (null === b) return !1;
        if ("contains" in a && 1 == b.nodeType) return a.contains(b);
        if ("compareDocumentPosition" in a) return a == b || !!(a.compareDocumentPosition(b) & 16);
        for (; b && a != b;) b = b.parentNode;
        return b == a
    };

    function ba(a, b) {
        return function (e) {
            e || (e = window.event);
            return b.call(a, e)
        }
    }

    function x(a) {
        a = a.target || a.srcElement;
        !a.getAttribute && a.parentNode && (a = a.parentNode);
        return a
    }
    var ca = "undefined" != typeof navigator && /Macintosh/.test(navigator.userAgent),
        da = "undefined" != typeof navigator && !/Opera/.test(navigator.userAgent) && /WebKit/.test(navigator.userAgent),
        ea = {
            A: 1,
            INPUT: 1,
            TEXTAREA: 1,
            SELECT: 1,
            BUTTON: 1
        };

    function fa(a) {
        return (a = a.changedTouches && a.changedTouches[0] || a.touches && a.touches[0]) ? {
            clientX: a.clientX,
            clientY: a.clientY,
            screenX: a.screenX,
            screenY: a.screenY
        } : null
    }

    function ha(a) {
        var b = {};
        b.originalEventType = a.type;
        b.type = "click";
        for (var e in a) {
            var c = a[e];
            "type" != e && "srcElement" != e && "function" !== typeof c && (b[e] = c)
        }
        b.timeStamp = f();
        b.defaultPrevented = !1;
        b.preventDefault = ia;
        b._propagationStopped = !1;
        b.stopPropagation = ja;
        if (a = fa(a)) b.clientX = a.clientX, b.clientY = a.clientY, b.screenX = a.screenX, b.screenY = a.screenY;
        return b
    }

    function ma() {
        this._mouseEventsPrevented = !0
    }

    function ia() {
        this.defaultPrevented = !0
    }

    function ja() {
        this._propagationStopped = !0
    }
    var na = {
            A: 13,
            BUTTON: 0,
            CHECKBOX: 32,
            COMBOBOX: 13,
            FILE: 0,
            GRIDCELL: 13,
            LINK: 13,
            LISTBOX: 13,
            MENU: 0,
            MENUBAR: 0,
            MENUITEM: 0,
            MENUITEMCHECKBOX: 0,
            MENUITEMRADIO: 0,
            OPTION: 0,
            RADIO: 32,
            RADIOGROUP: 32,
            RESET: 0,
            SUBMIT: 0,
            SWITCH: 32,
            TAB: 0,
            TREE: 13,
            TREEITEM: 13
        },
        oa = {
            CHECKBOX: !0,
            FILE: !0,
            OPTION: !0,
            RADIO: !0
        },
        pa = {
            COLOR: !0,
            DATE: !0,
            DATETIME: !0,
            "DATETIME-LOCAL": !0,
            EMAIL: !0,
            MONTH: !0,
            NUMBER: !0,
            PASSWORD: !0,
            RANGE: !0,
            SEARCH: !0,
            TEL: !0,
            TEXT: !0,
            TEXTAREA: !0,
            TIME: !0,
            URL: !0,
            WEEK: !0
        },
        qa = {
            A: !0,
            AREA: !0,
            BUTTON: !0,
            DIALOG: !0,
            IMG: !0,
            INPUT: !0,
            LINK: !0,
            MENU: !0,
            OPTGROUP: !0,
            OPTION: !0,
            PROGRESS: !0,
            SELECT: !0,
            TEXTAREA: !0
        };
    /*

     Copyright 2020 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    /*

     Copyright 2005 Google LLC.
     SPDX-License-Identifier: Apache-2.0
    */
    function ra() {
        this.j = [];
        this.a = [];
        this.c = [];
        this.i = {};
        this.b = null;
        this.g = []
    }
    var z, sa, ta = "undefined" != typeof navigator && /iPhone|iPad|iPod/.test(navigator.userAgent),
        ua = String.prototype.trim ? function (a) {
            return a.trim()
        } : function (a) {
            return a.replace(/^\s+/, "").replace(/\s+$/, "")
        },
        va = /\s*;\s*/,
        A = null;

    function wa(a, b) {
        return function v(c, h) {
            h = void 0 === h ? !0 : h;
            var n = b;
            if ("click" == n && (ca && c.metaKey || !ca && c.ctrlKey || 2 == c.which || null == c.which && 4 == c.button || c.shiftKey)) n = "clickmod";
            else {
                var l = c.which || c.keyCode;
                da && 3 == l && (l = 13);
                if (13 != l && 32 != l) l = !1;
                else {
                    var g = x(c),
                        m;
                    (m = "keydown" != c.type || !!(!("getAttribute" in g) || (g.getAttribute("type") || g.tagName).toUpperCase() in pa || "BUTTON" == g.tagName.toUpperCase() || g.type && "FILE" == g.type.toUpperCase() || g.isContentEditable) || c.ctrlKey || c.shiftKey || c.altKey || c.metaKey ||
                        (g.getAttribute("type") || g.tagName).toUpperCase() in oa && 32 == l) || ((m = g.tagName in ea) || (m = g.getAttributeNode("tabindex"), m = null != m && m.specified), m = !(m && !g.disabled));
                    if (m) l = !1;
                    else {
                        m = (g.getAttribute("role") || g.type || g.tagName).toUpperCase();
                        var r = !(m in na) && 13 == l;
                        g = "INPUT" != g.tagName.toUpperCase() || !!g.type;
                        l = (0 == na[m] % l || r) && g
                    }
                }
                l && (n = "clickkey")
            }
            g = c.srcElement || c.target;
            l = B(n, c, g, "", null);
            for (m = g; m && m != this; m = m.__owner || m.parentNode) {
                var k = m;
                b: {
                    var q = void 0;
                    var t = k;r = n;
                    var ka = c;
                    var p = t.__jsaction;
                    if (!p) {
                        var y;
                        p = null;
                        "getAttribute" in t && (p = t.getAttribute("jsaction"));
                        if (y = p) {
                            p = u[y];
                            if (!p) {
                                p = {};
                                for (var K = y.split(va), Fa = K ? K.length : 0, L = 0; L < Fa; L++) {
                                    var C = K[L];
                                    if (C) {
                                        var M = C.indexOf(":"),
                                            la = -1 != M;
                                        p[la ? ua(C.substr(0, M)) : "click"] = la ? ua(C.substr(M + 1)) : C
                                    }
                                }
                                u[y] = p
                            }
                            t.__jsaction = p
                        } else p = xa, t.__jsaction = p
                    }
                    "maybe_click" == r && p.click ? (q = r, r = "click") : "clickkey" == r ? r = "click" : "click" != r || p.click || (r = "clickonly");y = null;
                    if (p.click) {
                        t = ya(t, ka, p);
                        if (!t) {
                            q = {
                                f: r,
                                action: "",
                                event: null,
                                l: !0
                            };
                            break b
                        }
                        t != ka && (y = t, r = t.type)
                    }
                    q = {
                        f: q ? q : r,
                        action: p[r] || "",
                        event: y,
                        l: !1
                    }
                }
                if (q.l || q.action) break
            }
            q && (l = B(q.f, q.event || c, g, q.action || "", k, l.timeStamp));
            l && "touchend" == l.eventType && (l.event._preventMouseEvents = ma);
            if (q && q.action) {
                if (g = "clickkey" == n) g = x(c), g = (g.type || g.tagName).toUpperCase(), (g = 32 == (c.which || c.keyCode) && "CHECKBOX" != g) || (g = x(c), m = g.tagName.toUpperCase(), q = (g.getAttribute("role") || "").toUpperCase(), g = "BUTTON" === m || "BUTTON" === q ? !0 : !(g.tagName.toUpperCase() in qa) || "A" === m || "SELECT" === m || (g.getAttribute("type") || g.tagName).toUpperCase() in
                    oa || (g.getAttribute("type") || g.tagName).toUpperCase() in pa ? !1 : !0);
                g && (c.preventDefault ? c.preventDefault() : c.returnValue = !1);
                if ("mouseenter" == n || "mouseleave" == n)
                    if (g = c.relatedTarget, !("mouseover" == c.type && "mouseenter" == n || "mouseout" == c.type && "mouseleave" == n) || g && (g === k || aa(k, g))) l.action = "", l.actionElement = null;
                    else {
                        n = {};
                        for (var w in c) "function" !== typeof c[w] && "srcElement" !== w && "target" !== w && (n[w] = c[w]);
                        n.type = "mouseover" == c.type ? "mouseenter" : "mouseleave";
                        n.target = n.srcElement = k;
                        n.bubbles = !1;
                        l.event =
                            n;
                        l.targetElement = k
                    }
            } else l.action = "", l.actionElement = null;
            k = l;
            a.b && !k.event.a11ysgd && (w = B(k.eventType, k.event, k.targetElement, k.action, k.actionElement, k.timeStamp), "clickonly" == w.eventType && (w.eventType = "click"), a.b(w, !0));
            if (k.actionElement) {
                if (a.b) {
                    if (!k.actionElement || "A" != k.actionElement.tagName || "click" != k.eventType && "clickmod" != k.eventType || (c.preventDefault ? c.preventDefault() : c.returnValue = !1), (c = a.b(k)) && h) {
                        v.call(this, c, !1);
                        return
                    }
                } else {
                    if ((h = d.document) && !h.createEvent && h.createEventObject) try {
                        var N =
                            h.createEventObject(c)
                    } catch (La) {
                        N = c
                    } else N = c;
                    k.event = N;
                    a.g.push(k)
                }
                "touchend" == k.event.type && k.event._mouseEventsPrevented && (A = ha(k.event))
            }
        }
    }

    function B(a, b, e, c, h, v) {
        return {
            eventType: a,
            event: b,
            targetElement: e,
            action: c,
            actionElement: h,
            timeStamp: v || f()
        }
    }
    var xa = {};

    function ya(a, b, e) {
        if ("click" == b.type || b.targetTouches && 1 < b.targetTouches.length) return b;
        var c = z,
            h = b.target;
        if (h && za(h)) return b;
        h = fa(b);
        if ("touchstart" != b.type || e.touchstart || e.touchend)
            if ("touchend" == b.type && c && c.node == a)
                if (b.defaultPrevented || h && 4 < Math.abs(h.clientX - c.x) + Math.abs(h.clientY - c.y)) z = null;
                else {
                    A = a = ha(b);
                    b.stopPropagation();
                    b.preventDefault();
                    document.createEvent ? (b = document.createEvent("MouseEvent"), b.initMouseEvent(a.type, !0, !0, window, a.detail || 1, a.screenX || 0, a.screenY || 0, a.clientX ||
                        0, a.clientY || 0, a.ctrlKey || !1, a.altKey || !1, a.shiftKey || !1, a.metaKey || !1, a.button || 0, a.relatedTarget || null)) : (b = document.createEventObject(), b.type = a.type, b.clientX = a.clientX, b.clientY = a.clientY, b.button = a.button, b.detail = a.detail, b.ctrlKey = a.ctrlKey, b.altKey = a.altKey, b.shiftKey = a.shiftKey, b.metaKey = a.metaKey);
                    b.m = a.timeStamp;
                    b._fastclick = !0;
                    a: {
                        for (e = a.target; e && e.getAttribute;) {
                            c = e.tagName || "";
                            if ("A" == c || "INPUT" == c || "TEXTAREA" == c || "SELECT" == c || "BUTTON" == c || e.getAttribute("tabIndex")) break a;
                            e = e.parentNode
                        }
                        e =
                        null
                    }
                    e ? e.focus() : document.activeElement && document.activeElement.blur();
                    a.target.dispatchEvent(b);
                    if (!b.defaultPrevented) {
                        if (document.activeElement && document.activeElement != b.target && document.activeElement != e && za(document.activeElement)) try {
                            document.activeElement.blur()
                        } catch (v) {}
                        try {
                            window.getSelection().removeAllRanges()
                        } catch (v) {}
                    }
                    return null
                }
        else "touchmove" == b.type && c && h && 4 < Math.abs(h.clientX - c.x) + Math.abs(h.clientY - c.y) && (z = null);
        else return z = {
                node: a,
                x: h ? h.clientX : 0,
                y: h ? h.clientY : 0
            }, A = null, clearTimeout(sa),
            sa = setTimeout(Aa, 400), null;
        return b
    }

    function za(a) {
        var b = a.tagName || "";
        return "TEXTAREA" == b || "INPUT" == b || "SELECT" == b || "OPTION" == b || a.isContentEditable
    }

    function Aa() {
        z = null
    }

    function D(a) {
        if (!a._fastclick) {
            var b = A;
            if (b)
                if (800 < f() - b.timeStamp) A = null;
                else {
                    var e = 4 >= Math.abs(a.clientX - b.clientX) + Math.abs(a.clientY - b.clientY);
                    b.target == a.target || e ? (a.stopPropagation(), a.preventDefault(), "click" == a.type && (A = null)) : A = null
                }
        }
    }

    function Ba(a, b) {
        return function (e) {
            var c = a,
                h = b,
                v = !1;
            "mouseenter" == c ? c = "mouseover" : "mouseleave" == c && (c = "mouseout");
            if (e.addEventListener) {
                if ("focus" == c || "blur" == c || "error" == c || "load" == c) v = !0;
                e.addEventListener(c, h, v)
            } else e.attachEvent && ("focus" == c ? c = "focusin" : "blur" == c && (c = "focusout"), h = ba(e, h), e.attachEvent("on" + c, h));
            return {
                f: c,
                h: h,
                capture: v
            }
        }
    }

    function E(a, b, e) {
        if (!a.i.hasOwnProperty(b)) {
            var c = wa(a, b);
            e = Ba(e || b, c);
            a.i[b] = c;
            a.j.push(e);
            for (c = 0; c < a.a.length; ++c) {
                var h = a.a[c];
                h.b.push(e.call(null, h.a))
            }
            "click" == b && E(a, "keydown");
            "click" == b && (E(a, "touchstart"), E(a, "touchend"), E(a, "touchmove"), document.addEventListener && (document.addEventListener("click", D, !0), document.addEventListener("mouseup", D, !0), document.addEventListener("mousedown", D, !0)))
        }
    }
    ra.prototype.h = function (a) {
        return this.i[a]
    };

    function Ca(a) {
        var b = F,
            e = a.a;
        ta && (e.style.cursor = "pointer");
        for (e = 0; e < b.j.length; ++e) a.b.push(b.j[e].call(null, a.a))
    }

    function Da(a) {
        for (var b = Ea, e = 0; e < b.length; ++e)
            if (b[e].a != a.a && Ga(b[e].a, a.a)) return !0;
        return !1
    }

    function Ga(a, b) {
        for (; a != b && b.parentNode;) b = b.parentNode;
        return a == b
    };
    var G = window,
        F = new ra;
    var Ha = G.document.documentElement,
        H = new function (a) {
            this.a = a;
            this.b = []
        }(Ha),
        I;
    b: {
        for (var J = 0; J < F.a.length; J++)
            if (Ga(F.a[J].a, Ha)) {
                I = !0;
                break b
            } I = !1
    }
    if (I) F.c.push(H);
    else {
        Ca(H);
        F.a.push(H);
        for (var Ea = F.c.concat(F.a), O = [], P = [], Q = 0; Q < F.a.length; ++Q) {
            var R = F.a[Q];
            if (Da(R)) {
                O.push(R);
                for (var S = 0; S < R.b.length; ++S) {
                    var T = R.a,
                        U = R.b[S];
                    T.removeEventListener ? T.removeEventListener(U.f, U.h, U.capture) : T.detachEvent && T.detachEvent("on" + U.f, U.h)
                }
                R.b = []
            } else P.push(R)
        }
        for (var V = 0; V < F.c.length; ++V) {
            var W = F.c[V];
            Da(W) ? O.push(W) : (P.push(W), Ca(W))
        }
        F.a = P;
        F.c = O
    }
    E(F, "click");
    E(F, "dblclick");
    E(F, "focus");
    E(F, "focusin");
    E(F, "blur");
    E(F, "error");
    E(F, "focusout");
    E(F, "keydown");
    E(F, "keyup");
    E(F, "keypress");
    E(F, "load");
    E(F, "mouseover");
    E(F, "mouseout");
    E(F, "mouseenter");
    E(F, "mouseleave");
    E(F, "submit");
    E(F, "touchstart");
    E(F, "touchend");
    E(F, "touchmove");
    E(F, "auxclick");
    E(F, "change");
    E(F, "compositionstart");
    E(F, "compositionupdate");
    E(F, "compositionend");
    E(F, "input");
    E(F, "textinput");
    E(F, "copy");
    E(F, "cut");
    E(F, "paste");
    E(F, "mousedown");
    E(F, "mouseup");
    E(F, "wheel");
    E(F, "contextmenu");
    E(F, "dragover");
    E(F, "dragenter");
    E(F, "dragleave");
    E(F, "drop");
    E(F, "dragstart");
    E(F, "dragend");
    E(F, "pointerdown");
    E(F, "pointerup");
    var Ia, Ja;
    "onwebkitanimationend" in G && (Ia = "webkitAnimationEnd");
    E(F, "animationend", Ia);
    "onwebkittransitionend" in G && (Ja = "webkitTransitionEnd");
    E(F, "transitionend", Ja);
    var Ka = function (a) {
            return {
                trigger: function (b) {
                    var e = a.h(b.type);
                    e || (E(a, b.type), e = a.h(b.type));
                    var c = b.target || b.srcElement;
                    e && e.call(c.ownerDocument.documentElement, b)
                },
                bind: function (b) {
                    a.b = b;
                    a.g && (0 < a.g.length && b(a.g), a.g = null)
                }
            }
        }(F),
        X = ["BOQ_wizbind"],
        Y = window || d;
    X[0] in Y || "undefined" == typeof Y.execScript || Y.execScript("var " + X[0]);
    for (var Z; X.length && (Z = X.shift());) X.length || void 0 === Ka ? Y[Z] && Y[Z] !== Object.prototype[Z] ? Y = Y[Z] : Y = Y[Z] = {} : Y[Z] = Ka;
}).call(this);