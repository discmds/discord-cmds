(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{309:function(t,e,n){"use strict";var i=n(0);e.a=new i.a},310:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},313:function(t,e,n){"use strict";n(308),n(95),n(96);var i=[{label:"v5 (stable)",version:"5.x",aliases:["5","stable"]},{label:"v4",version:"4.x",aliases:["4"]}],a=i[0];e.a={data:function(){return{branches:i,defaultBranch:a,selectedBranch:a.version}},mounted:function(){this.selectedBranch=localStorage.getItem("branch-version")||a.version},methods:{getBranch:function(t){return this.branches.find((function(e){return e.aliases.includes(t)||e.version===t}))},updateBranch:function(t){this.selectedBranch=t}}}},314:function(t,e,n){var i=n(25),a="["+n(310)+"]",r=RegExp("^"+a+a+"*"),o=RegExp(a+a+"*$"),s=function(t){return function(e){var n=String(i(e));return 1&t&&(n=n.replace(r,"")),2&t&&(n=n.replace(o,"")),n}};t.exports={start:s(1),end:s(2),trim:s(3)}},321:function(t,e,n){var i=n(1),a=n(322);i({global:!0,forced:parseInt!=a},{parseInt:a})},322:function(t,e,n){var i=n(4),a=n(314).trim,r=n(310),o=i.parseInt,s=/^[+-]?0[Xx]/,c=8!==o(r+"08")||22!==o(r+"0x16");t.exports=c?function(t,e){var n=a(String(t));return o(n,e>>>0||(s.test(n)?16:10))}:o},331:function(t,e,n){n(1)({target:"Date",stat:!0},{now:function(){return(new Date).getTime()}})},332:function(t,e,n){var i=n(19),a=Date.prototype,r=a.toString,o=a.getTime;new Date(NaN)+""!="Invalid Date"&&i(a,"toString",(function(){var t=o.call(this);return t==t?r.call(this):"Invalid Date"}))},356:function(t,e,n){},388:function(t,e,n){"use strict";n(356)},399:function(t,e,n){"use strict";n.r(e);n(331),n(332),n(321);var i=n(329),a=n.n(i),r=n(309),o={mixins:[n(313).a],data:function(){return{hideUntil:null}},computed:{showNotice:function(){return a.a.satisfies(a.a.coerce("4.x"),this.selectedBranch)&&(!this.hideUntil||Date.now()>parseInt(this.hideUntil))}},mounted:function(){r.a.$on("branch-update",this.updateBranch),this.hideUntil=localStorage.getItem("oldversion-notice-expiration")},destroyed:function(){r.a.$off("branch-update",this.updateBranch)},methods:{dismiss:function(){var t=Date.now()+6048e5;this.hideUntil=t,localStorage.setItem("oldversion-notice-expiration",t)}}},s=(n(388),n(45)),c=Object(s.a)(o,(function(){var t=this.$createElement,e=this._self._c||t;return this.showNotice?e("div",{staticClass:"oldversion-notice"},[this._v("\n\tIt's possible that you can't see the whole guide now.\n\tWe no longer provide support, maintain bug fixes or new features for v4 of gcommands. "),e("a",{attrs:{href:"/guide/additional/fromv4tov5"}},[this._v("Please update your bot to version 5.")])]):this._e()}),[],!1,null,null,null);e.default=c.exports}}]);