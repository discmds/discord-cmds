(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{309:function(e,n,t){"use strict";var a=t(0);n.a=new a.a},313:function(e,n,t){"use strict";t(308),t(95),t(96);var a=[{label:"v5 (stable)",version:"5.x",aliases:["5","stable"]},{label:"v4",version:"4.x",aliases:["4"]}],s=a[0];n.a={data:function(){return{branches:a,defaultBranch:s,selectedBranch:s.version}},mounted:function(){this.selectedBranch=localStorage.getItem("branch-version")||s.version},methods:{getBranch:function(e){return this.branches.find((function(n){return n.aliases.includes(e)||n.version===e}))},updateBranch:function(e){this.selectedBranch=e}}}},394:function(e,n,t){"use strict";t.r(n);var a=t(329),s=t.n(a),i=t(309),r={name:"Branch",mixins:[t(313).a],props:{version:{type:String,required:!0},inline:{type:Boolean,default:!1}},computed:{displayContent:function(){return s.a.satisfies(s.a.coerce(this.version),this.selectedBranch)}},mounted:function(){i.a.$on("branch-update",this.updateBranch)},destroyed:function(){i.a.$off("branch-update",this.updateBranch)}},c=t(45),o=Object(c.a)(r,(function(){var e=this.$createElement;return(this._self._c||e)("span",{directives:[{name:"show",rawName:"v-show",value:this.displayContent,expression:"displayContent"}],style:{display:this.inline?"inline-block":"block"}},[this._t("default")],2)}),[],!1,null,null,null);n.default=o.exports}}]);