this.gbar_=this.gbar_||{};(function(_){var window=this;
try{
/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var Td,Ud,Vd,Zd,$d,ae,be,ce,de,ee,je;_.Sd=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}};Td=null;Ud=/^[\w+/_-]+[=]{0,2}$/;Vd=function(a){return(a=a.querySelector&&a.querySelector("script[nonce]"))&&(a=a.nonce||a.getAttribute("nonce"))&&Ud.test(a)?a:""};_.Wd=function(a){var b=_.xa(a);return"array"==b||"object"==b&&"number"==typeof a.length};
_.Xd=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};_.Yd=function(a,b){return 0==a.lastIndexOf(b,0)};Zd=/&/g;$d=/</g;ae=/>/g;be=/"/g;ce=/'/g;de=/\x00/g;ee=/[\x00&<>"']/;
_.fe=function(a,b){if(b)a=a.replace(Zd,"&amp;").replace($d,"&lt;").replace(ae,"&gt;").replace(be,"&quot;").replace(ce,"&#39;").replace(de,"&#0;");else{if(!ee.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(Zd,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace($d,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(ae,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(be,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(ce,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(de,"&#0;"))}return a};
_.ge=function(a){var b;(b=a.ownerDocument&&a.ownerDocument.defaultView)&&b!=_.p?b=Vd(b.document):(null===Td&&(Td=Vd(_.p.document)),b=Td);b&&a.setAttribute("nonce",b)};_.he=function(a,b){a.src=_.$a(b);_.ge(a)};_.ie=function(a){return a=_.fe(a,void 0)};je=!_.x||_.ic(9);_.ke=!_.Rb&&!_.x||_.x&&_.ic(9)||_.Rb&&_.gc("1.9.1");_.le=_.x&&!_.gc("9");_.me=_.x||_.Ob||_.Sb;
_.ne=function(a,b){this.width=a;this.height=b};_.h=_.ne.prototype;_.h.aspectRatio=function(){return this.width/this.height};_.h.Ac=function(){return!(this.width*this.height)};_.h.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};_.h.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};_.h.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};
var qe;_.oe=function(a,b){return(b||document).getElementsByTagName(String(a))};_.N=function(a,b){var c=b||document;if(c.getElementsByClassName)a=c.getElementsByClassName(a)[0];else{c=document;var d=b||c;a=d.querySelectorAll&&d.querySelector&&a?d.querySelector(a?"."+a:""):_.pe(c,"*",a,b)[0]||null}return a||null};
_.pe=function(a,b,c,d){a=d||a;b=b&&"*"!=b?String(b).toUpperCase():"";if(a.querySelectorAll&&a.querySelector&&(b||c))return a.querySelectorAll(b+(c?"."+c:""));if(c&&a.getElementsByClassName){a=a.getElementsByClassName(c);if(b){d={};for(var e=0,f=0,g;g=a[f];f++)b==g.nodeName&&(d[e++]=g);d.length=e;return d}return a}a=a.getElementsByTagName(b||"*");if(c){d={};for(f=e=0;g=a[f];f++)b=g.className,"function"==typeof b.split&&_.Na(b.split(/\s+/),c)&&(d[e++]=g);d.length=e;return d}return a};
_.re=function(a,b){_.Oa(b,function(c,d){c&&"object"==typeof c&&c.Qb&&(c=c.Gb());"style"==d?a.style.cssText=c:"class"==d?a.className=c:"for"==d?a.htmlFor=c:qe.hasOwnProperty(d)?a.setAttribute(qe[d],c):_.Yd(d,"aria-")||_.Yd(d,"data-")?a.setAttribute(d,c):a[d]=c})};qe={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
_.ue=function(a,b){var c=String(b[0]),d=b[1];if(!je&&d&&(d.name||d.type)){c=["<",c];d.name&&c.push(' name="',_.ie(d.name),'"');if(d.type){c.push(' type="',_.ie(d.type),'"');var e={};_.Qa(e,d);delete e.type;d=e}c.push(">");c=c.join("")}c=_.se(a,c);d&&("string"===typeof d?c.className=d:Array.isArray(d)?c.className=d.join(" "):_.re(c,d));2<b.length&&_.te(a,c,b,2);return c};
_.te=function(a,b,c,d){function e(k){k&&b.appendChild("string"===typeof k?a.createTextNode(k):k)}for(;d<c.length;d++){var f=c[d];if(!_.Wd(f)||_.Aa(f)&&0<f.nodeType)e(f);else{a:{if(f&&"number"==typeof f.length){if(_.Aa(f)){var g="function"==typeof f.item||"string"==typeof f.item;break a}if(_.za(f)){g="function"==typeof f.item;break a}}g=!1}(0,_.Ja)(g?_.Xd(f):f,e)}}};_.ve=function(a){return _.se(document,a)};
_.se=function(a,b){b=String(b);"application/xhtml+xml"===a.contentType&&(b=b.toLowerCase());return a.createElement(b)};_.we=function(a){for(var b;b=a.firstChild;)a.removeChild(b)};_.xe=function(a){return a&&a.parentNode?a.parentNode.removeChild(a):null};_.ye=function(a){return _.Aa(a)&&1==a.nodeType};_.ze=function(a){return 9==a.nodeType?a:a.ownerDocument||a.document};_.Ae=function(a,b,c){for(var d=0;a&&(null==c||d<=c);){if(b(a))return a;a=a.parentNode;d++}return null};

}catch(e){_._DumpException(e)}
try{
_.tj=function(a){_.z(this,a,0,-1,null,null)};_.v(_.tj,_.y);_.uj=function(a,b,c){a.rel=c;a.href=-1!=c.toLowerCase().indexOf("stylesheet")?_.ab(b):b instanceof _.Za?_.ab(b):b instanceof _.hb?_.ib(b):_.ib(_.ob(b))};
_.vj=function(a){return _.bb(_.A(a,4)||"")};

}catch(e){_._DumpException(e)}
try{
var wj=function(a,b,c){_.zd.log(46,{att:a,max:b,url:c})},yj=function(a,b,c){_.zd.log(47,{att:a,max:b,url:c});a<b?xj(a+1,b):_.M.log(Error("R`"+a+"`"+b),{url:c})},xj=function(a,b){if(zj){var c=_.ve("SCRIPT");c.async=!0;c.type="text/javascript";c.charset="UTF-8";_.he(c,zj);c.onload=_.Sd(wj,a,b,c.src);c.onerror=_.Sd(yj,a,b,c.src);_.zd.log(45,{att:a,max:b,url:c.src});_.oe("HEAD")[0].appendChild(c)}},Aj=function(a){_.z(this,a,0,-1,null,null)};_.v(Aj,_.y);
var Bj=_.G(_.vd,Aj,17)||new Aj,Cj,zj=(Cj=_.G(Bj,_.tj,1))?_.vj(Cj):null,Dj,Ej=(Dj=_.G(Bj,_.tj,2))?_.vj(Dj):null,Fj=function(){xj(1,2);if(Ej){var a=_.ve("LINK");a.setAttribute("type","text/css");_.uj(a,Ej,"stylesheet");_.oe("HEAD")[0].appendChild(a)}};
(function(){var a=_.wd();if(_.C(a,18))Fj();else{var b=_.A(a,19)||0;window.addEventListener("load",function(){window.setTimeout(Fj,b)})}})();

}catch(e){_._DumpException(e)}
})(this.gbar_);
// Google Inc.
