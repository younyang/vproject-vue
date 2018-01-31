webpackJsonp([42],{607:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(783),a=n(784),s=n(13),o=s(i.a,a.a,null,null,null);e.default=o.exports},783:function(t,e,n){"use strict";var i=n(182),a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};e.a={name:"cache",components:{cSwitch:i.a},data:function(){return{items:{popId:null,serviceId:null,bandwidth:null,setApplyYn:!1,modifyHistReason:"등록",cacheThrottlingCases:[]},caseFields:{serviceTypeCodeName:{label:"Service Type",class:"serviceType"},bandwidth1:{label:"Set1 (Basic)",class:"bandwidth"},bandwidth2:{label:"Set2",class:"bandwidth"}},code:{popId:[],serviceId:[]},isLoad:{popId:!1,serviceId:!0},inValidForm:!1}},computed:{popId:{get:function(){var t=this;return this.code.popId.find(function(e){return e.popId===t.items.popId})||null},set:function(t){this.items.popId=null!==t?t.popId:null}},serviceId:{get:function(){var t=this;return this.code.serviceId.find(function(e){return e.serviceId===t.items.serviceId})||null},set:function(t){this.items.serviceId=null!==t?t.serviceId:null}},total:function(){return this.items.cacheThrottlingCases.length>0?this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps;return{bandwidth1:e.map(function(t){var e=t.bandwidth1;return""!==e?e:0}).reduce(function(t,e){return t+e}),bandwidth2:e.map(function(t){var e=t.bandwidth2;return""!==e?e:0}).reduce(function(t,e){return t+e})}}):[{bandwidth1:0,bandwidth2:0}]}},created:function(){var t=this;this.$https.get("/policy/services").then(function(e){t.isLoad.serviceId=!1,t.code.serviceId=e.data.items})},methods:{onSubmit:function(){var t=this,e=this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps.length>0?t.cacheThrottlingComps.map(function(t){var e=t.serviceTypeCode,n=t.bandwidth1,i=t.bandwidth2;return{serviceTypeCode:e,bandwidth1:parseInt(n),bandwidth2:parseInt(i)}}):[];return a({},t,{cacheThrottlingComps:e})}),n=a({},this.items,{cacheThrottlingCases:e});this.$https.post("/policy/cacheThrottlings",n).then(function(e){t.$router.push({name:"Cache Throttling 상세",params:{id:e.data.items}})}).catch(function(t){console.log(t)})},onSearchPoP:function(t){var e=this,n=t.serviceId;this.code.popId=[],this.items=a({},this.items,{popId:null,bandwidth:null,setApplyYn:!1,cacheThrottlingCases:[]}),this.isLoad.popId=!0,this.$https.get("/policy/cacheThrottlings/services/"+n+"/pops").then(function(t){e.isLoad.popId=!1,e.code.popId=t.data.items})},onSearchBandwidth:function(t){var e=this,n=this.items.serviceId,i=t.popId;this.$https.get("/policy/cacheThrottlings/bandwidth/service/"+n+"/pop/"+i).then(function(t){e.items.bandwidth=t.data.items.popBandwidth,e.items.cacheThrottlingCases=t.data.items.cacheThrottlingCases,e.items.cacheThrottlingCases.length>0&&e.setCacheCaseData()})},onCheckBandwidth:function(){var t=this,e=!0;return this.total.forEach(function(n){var i=n.bandwidth1,a=n.bandwidth2;(i>t.items.bandwidth||a>t.items.bandwidth)&&(e=!1)}),e},onChecked:function(t,e){var n="band"+e+"UseYn",i="bandwidth"+e;t[n]||(t[i]=0)},onChangeSet2:function(t){var e=this.items.cacheThrottlingCases;!t&&e.length>0&&e.forEach(function(t){var e=t.cacheThrottlingComps;e.length>0&&e.forEach(function(t){t.band2UseYn=!1,t.bandwidth2=0})})},setCacheCaseData:function(){this.items.cacheThrottlingCases=this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps.length>0?t.cacheThrottlingComps.map(function(t){return a({},t,{band1UseYn:t.bandwidth1>0,band2UseYn:t.bandwidth2>0})}):[];return a({},t,{cacheThrottlingComps:e})})},setDefault:function(t,e){t[e]=""!==t[e]?parseInt(t[e]):0}}}},784:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"animated fadeIn"},[n("b-form",{staticClass:"formView"},[n("b-form-fieldset",{attrs:{label:"Service 선택<i class='require'>*</i>",horizontal:!0}},[n("multiselect",{staticClass:"noEmpty inline",staticStyle:{width:"50%"},attrs:{id:"serviceId",allowEmpty:!1,showLabels:!1,searchable:!1,options:t.code.serviceId,loading:t.isLoad.serviceId,label:"serviceName",placeholder:"선택"},on:{select:t.onSearchPoP},model:{value:t.serviceId,callback:function(e){t.serviceId=e},expression:"serviceId"}})],1),t._v(" "),n("b-form-fieldset",{attrs:{label:"PoP 선택<i class='require'>*</i>",horizontal:!0}},[n("multiselect",{staticClass:"noEmpty inline",staticStyle:{width:"50%"},attrs:{id:"popId",allowEmpty:!1,showLabels:!1,searchable:!1,options:t.code.popId,loading:t.isLoad.popId,label:"popName",placeholder:"선택"},on:{select:t.onSearchBandwidth},model:{value:t.popId,callback:function(e){t.popId=e},expression:"popId"}}),t._v(" "),n("small",{staticClass:"form-text-alone text-muted"},[t._v("(Bandwidth : "+t._s(t.items.bandwidth)+" GB)")])],1),t._v(" "),n("b-form-fieldset",{attrs:{label:"Set2사용여부<i class='require'>*</i>",horizontal:!0}},[n("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"사용",off:"미사용"},on:{change:t.onChangeSet2},model:{value:t.items.setApplyYn,callback:function(e){t.items.setApplyYn=e},expression:"items.setApplyYn"}}),t._v(" "),n("small",{staticClass:"form-text-alone text-muted"},[t._v("(적용 시간 : 02:00:00 ~ 04:59:00)")])],1)],1),t._v(" "),t._l(t.items.cacheThrottlingCases,function(e,i){return t.items.cacheThrottlingCases.length>0?n("div",{key:i,staticClass:"cache-content"},[n("h3",{staticClass:"cache-title"},[n("i",{staticClass:"fa fa-arrow-right"}),t._v(" "),n("strong",[t._v("CASE "+t._s(e.caseSeq)+"/")]),t._v(t._s(e.caseName)+"\n    ")]),t._v(" "),e.cacheThrottlingComps.length?n("section",{staticClass:"board"},[n("b-table",{attrs:{"show-empty":"","foot-clone":"",items:e.cacheThrottlingComps,fields:t.caseFields},scopedSlots:t._u([{key:"bandwidth1",fn:function(e){return[n("b-form-checkbox",{on:{change:function(n){t.onChecked(e.item,"1")}},model:{value:e.item.band1UseYn,callback:function(t){e.item.band1UseYn=t},expression:"row.item.band1UseYn"}}),t._v(" "),n("cleave",{staticClass:"form-control",staticStyle:{width:"80px"},attrs:{options:{numeral:!0,numeralPositiveOnly:!0,numeralDecimalScale:0},disabled:!e.item.band1UseYn},on:{input:function(n){t.setDefault(e.item,"bandwidth1")}},model:{value:e.item.bandwidth1,callback:function(n){e.item.bandwidth1=t._n(n)},expression:"row.item.bandwidth1"}}),t._v(" GB 제한\n        ")]}},{key:"bandwidth2",fn:function(e){return[n("b-form-checkbox",{attrs:{disabled:!t.items.setApplyYn},on:{change:function(n){t.onChecked(e.item,"2")}},model:{value:e.item.band2UseYn,callback:function(t){e.item.band2UseYn=t},expression:"row.item.band2UseYn"}}),t._v(" "),n("cleave",{staticClass:"form-control",staticStyle:{width:"80px"},attrs:{options:{numeral:!0,numeralPositiveOnly:!0,numeralDecimalScale:0},disabled:!e.item.band2UseYn},on:{input:function(n){t.setDefault(e.item,"bandwidth2")}},model:{value:e.item.bandwidth2,callback:function(n){e.item.bandwidth2=t._n(n)},expression:"row.item.bandwidth2"}}),t._v(" GB 제한\n        ")]}},{key:"FOOT_serviceTypeCodeName",fn:function(e){return[n("span",{staticClass:"total-title"},[t._v("Total")])]}},{key:"FOOT_bandwidth1",fn:function(e){return[t.total[i].bandwidth1>t.items.bandwidth?n("small",{staticClass:"invalid"},[t._v("설정 가능한 최대 Bandwidth "+t._s(t.items.bandwidth)+" GB를 초과하였습니다")]):t._e(),t._v(" "),n("span",{staticClass:"total-text",class:{"text-danger":t.total[i].bandwidth1>t.items.bandwidth}},[t._v(t._s(t.total[i].bandwidth1)+" GB 제한")])]}},{key:"FOOT_bandwidth2",fn:function(e){return[t.total[i].bandwidth2>t.items.bandwidth?n("small",{staticClass:"invalid"},[t._v("설정 가능한 최대 Bandwidth "+t._s(t.items.bandwidth)+" GB를 초과하였습니다")]):t._e(),t._v(" "),n("span",{staticClass:"total-text",class:{"text-danger":t.total[i].bandwidth2>t.items.bandwidth}},[t._v(t._s(t.total[i].bandwidth2)+" GB 제한")])]}}])})],1):t._e()]):t._e()}),t._v(" "),n("div",{staticClass:"page-btn"},[n("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Cache Throttling 관리"}}},[t._v("취소")]),t._v(" "),n("b-button",{attrs:{type:"button",variant:"primary",disabled:!t.onCheckBandwidth()},on:{click:t.onSubmit}},[t._v("저장 및 배포")])],1)],2)},a=[],s={render:i,staticRenderFns:a};e.a=s}});