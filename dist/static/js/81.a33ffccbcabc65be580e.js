webpackJsonp([81],{1033:function(t,i,n){"use strict";i.a={name:"GTMIP",data:function(){return{fields:{serviceName:{label:"Service Name",class:"text-left",thStyle:{width:"180px"}},ip:{label:"IP 주소 : Port",class:"text-left"},action:{label:"관리",tdClass:"align-middle"}},items:[{serviceName:"btv",ip:[{ip:"111.222.333.111",port:"8080"},{ip:"1.255.56.234",port:"9090"}],isEdit:!1}],originItems:[]}},computed:{},created:function(){},methods:{onEdit:function(t){t.item.isEdit=!0},onView:function(t){t.item.isEdit=!1},onSubmit:function(t){},onAddIp:function(t){this.items[t].ip.push({ip:null,port:null})},onDelIp:function(t,i){this.items[t].ip.splice(i,1)}}}},1034:function(t,i,n){"use strict";var e=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"animated fadeIn"},[n("section",{staticClass:"board"},[n("b-table",{attrs:{"show-empty":"",items:t.items,fields:t.fields},scopedSlots:t._u([{key:"ip",fn:function(i){return[n("ul",{staticClass:"gtm-ip-list"},t._l(i.value,function(e,s){var a=e.ip,o=e.port;return n("li",[i.item.isEdit?n("div",{staticClass:"edit"},[n("b-form-input",{staticStyle:{width:"400px"},attrs:{value:a,type:"text"}}),t._v(" "),n("b-form-input",{staticStyle:{width:"120px"},attrs:{value:o,type:"text"}}),t._v(" "),n("span",{staticClass:"ico"},[0===s?n("button",{attrs:{type:"button"},on:{click:function(n){t.onAddIp(i.index)}}},[n("i",{staticClass:"fa fa-plus-circle"})]):t._e(),t._v(" "),s>0?n("button",{attrs:{type:"button"},on:{click:function(n){t.onDelIp(i.index,s)}}},[n("i",{staticClass:"fa fa-times-circle"})]):t._e()])],1):n("span",[t._v("\n              "+t._s(a)+" : "+t._s(o)+"\n            ")])])}))]}},{key:"action",fn:function(i){return[i.item.isEdit?n("span",[n("b-button",{attrs:{type:"button",variant:"in-table"},on:{click:function(n){t.onView(i)}}},[t._v("취소")]),t._v(" "),n("b-button",{attrs:{type:"button",variant:"in-table"},on:{click:function(n){t.onSubmit(i)}}},[t._v("저장")])],1):n("span",[n("b-button",{attrs:{type:"button",variant:"in-table"},on:{click:function(n){t.onEdit(i)}}},[t._v("수정")])],1)]}}])})],1)])},s=[],a={render:e,staticRenderFns:s};i.a=a},605:function(t,i,n){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=n(1033),s=n(1034),a=n(15),o=a(e.a,s.a,null,null,null);i.default=o.exports}});