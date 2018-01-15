webpackJsonp([41],{428:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(599),s=i(600),n=i(11),o=n(a.a,s.a,null,null,null);e.default=o.exports},599:function(t,e,i){"use strict";var a=i(140),s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(t[a]=i[a])}return t};e.a={name:"cache",props:["id"],components:{cSwitch:a.a},data:function(){return{originItems:{},items:{popId:20,popName:null,serviceId:4,serviceName:null,bandwidth:null,popBandwidth:null,setApplyYn:null,modifyHistReason:null,cacheThrottlingCases:[]},caseFields:{serviceTypeCodeName:{label:"Service Type"},bandwidth1:{label:"Set1 (Basic)",class:"text-right"},bandwidth2:{label:"Set2",class:"text-right"}},history:{fields:{createId:{label:"등록/수정자",class:"text-left"},histBeginDateTime:{label:"등록/수정일시"},modifyHistReason:{label:"변경이력",class:"text-left"},histMgmtId:{label:"보기"}},items:[]},isEdit:!1,isModalHistory:!1,isModalMessage:!1,modalMessage:"",deploy:{status:!0,count:11234}}},computed:{total:function(){return this.items.cacheThrottlingCases.length>0?this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps;return{bandwidth1:e.map(function(t){var e=t.bandwidth1;return""!==e?e:0}).reduce(function(t,e){return t+e}),bandwidth2:e.map(function(t){var e=t.bandwidth2;return""!==e?e:0}).reduce(function(t,e){return t+e})}}):[{bandwidth1:0,bandwidth2:0}]}},created:function(){var t=this,e=this.$route.query.histories,i=this.$route.query.caseSeq,a=void 0!==e?"/policy/cacheThrottlings/"+this.id+"/case/"+i+"/histories/"+e:"/policy/cacheThrottlings/"+this.id;e&&document.querySelector("body.app").classList.add("history-mode"),this.$https.get(a).then(function(e){t.items=s({},t.items,e.data.items,{bandwidth:e.data.items.popBandwidth}),t.setCacheCaseData(),t.originItems=JSON.parse(JSON.stringify(t.items))})},methods:{onEdit:function(){this.isEdit=!0},onView:function(){this.isEdit=!1,this.items=JSON.parse(JSON.stringify(this.originItems))},onSubmit:function(){var t=this,e=this.items,i=e.popId,a=e.serviceId,n=e.bandwidth,o=e.setApplyYn,l=e.modifyHistReason,r=this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps.length>0?t.cacheThrottlingComps.map(function(t){return{serviceTypeCode:t.serviceTypeCode,bandwidth1:t.bandwidth1,bandwidth2:t.bandwidth2}}):[];return s({},t,{cacheThrottlingComps:e})});this.$https.put("/policy/cacheThrottlings/"+this.id,{popId:i,serviceId:a,bandwidth:n,setApplyYn:o,cacheThrottlingCases:r,modifyHistReason:l}).then(function(){t.$router.go(t.$router.currentRoute)}).catch(function(t){console.log(t)})},onDelete:function(){this.modalMessage="정말 삭제하시겠습니까?",this.isModalMessage=!0},onDeleteData:function(){var t=this;this.$https.delete("/policy/cacheThrottlings/"+this.id).then(function(){t.$router.push({name:"Cache Throttling 관리"})}).catch(function(t){console.log(t)})},onCheckBandwidth:function(){var t=this,e=!0;return this.total.forEach(function(i){var a=i.bandwidth1,s=i.bandwidth2;(a>t.items.bandwidth||s>t.items.bandwidth)&&(e=!1)}),e},onChecked:function(t,e){var i="band"+e+"UseYn",a="bandwidth"+e;t[i]||(t[a]=0)},onChangeSet2:function(t){var e=this.items.cacheThrottlingCases;!t&&e.length>0&&e.forEach(function(t){var e=t.cacheThrottlingComps;e.length>0&&e.forEach(function(t){t.band2UseYn=!1,t.bandwidth2=0})})},setCacheCaseData:function(){this.items.cacheThrottlingCases=this.items.cacheThrottlingCases.map(function(t){var e=t.cacheThrottlingComps.length>0?t.cacheThrottlingComps.map(function(t){return s({},t,{band1UseYn:t.bandwidth1>0,band2UseYn:t.bandwidth2>0})}):[];return s({},t,{cacheThrottlingComps:e})})},setDefault:function(t,e){t[e]=""!==t[e]?parseInt(t[e]):0},getHistoryLink:function(t,e){return"#/configuration/cache/"+this.id+"?histories="+t+"&caseSeq="+e},showHistory:function(t){var e=this;this.isModalHistory=!this.isModalHistory,this.$https.get("/policy/cacheThrottlings/"+this.id+"/case/"+t+"/histories").then(function(t){e.history.items=t.data.items})}}}},600:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"animated fadeIn"},[i("b-card",[i("b-form-fieldset",{attrs:{label:"Service","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.serviceName,type:"text",plaintext:""}})],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"PoP","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.popName,type:"text",plaintext:""}}),t._v(" "),null!==t.items.bandwidth?i("span",{staticClass:"form-sub-text"},[t._v("(Bandwidth : "+t._s(t.items.bandwidth)+" GB)")]):t._e()],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"Set2사용여부 <i class='require'>*</i>","label-cols":3,horizontal:!0}},[t.isEdit?i("c-switch",t._b({attrs:{type:"icon",variant:"success",pill:!0},on:{change:t.onChangeSet2},model:{value:t.items.setApplyYn,callback:function(e){t.items.setApplyYn=e},expression:"items.setApplyYn"}},"c-switch",{on:"",off:""},!1)):i("b-badge",{attrs:{pill:"",variant:t.items.setApplyYn?"success":"secondary"}},[t._v("\n        "+t._s(t.items.setApplyYn?"사용":"미사용")+"\n      ")]),t._v(" "),i("span",{staticClass:"form-sub-text"},[t._v("(적용 시간 : 02:00:00 ~ 04:59:00)")])],1)],1),t._v(" "),t._l(t.items.cacheThrottlingCases,function(e,a){return t.items.cacheThrottlingCases.length>0?i("b-card",{key:a},[i("div",{slot:"header"},[i("i",{staticClass:"fa fa-angle-right"}),t._v(" "),i("strong",[t._v("CASE "+t._s(e.caseSeq)+" :")]),t._v(" "+t._s(e.caseName)+"\n\n      "),t.isEdit?t._e():i("b-button",{staticClass:"float-right",attrs:{type:"button",variant:"outline-secondary"},on:{click:function(i){t.showHistory(e.caseSeq)}}},[t._v("이력관리")])],1),t._v(" "),e.cacheThrottlingComps.length>0?i("section",{staticClass:"board"},[i("b-table",{attrs:{striped:"",bordered:"","show-empty":"","foot-clone":"",items:e.cacheThrottlingComps,fields:t.caseFields},scopedSlots:t._u([{key:"bandwidth1",fn:function(e){return[t.isEdit?i("span",[i("b-form-checkbox",{on:{change:function(i){t.onChecked(e.item,"1")}},model:{value:e.item.band1UseYn,callback:function(t){e.item.band1UseYn=t},expression:"row.item.band1UseYn"}}),t._v(" "),i("cleave",{staticClass:"form-control",staticStyle:{width:"80px"},attrs:{options:{numeral:!0,numeralPositiveOnly:!0,numeralDecimalScale:0},disabled:!e.item.band1UseYn},on:{input:function(i){t.setDefault(e.item,"bandwidth1")}},model:{value:e.item.bandwidth1,callback:function(i){e.item.bandwidth1=t._n(i)},expression:"row.item.bandwidth1"}}),t._v(" GB 제한\n          ")],1):i("span",[t._v(t._s(e.value>0?e.value+" GB 제한":"--"))])]}},{key:"bandwidth2",fn:function(e){return[t.isEdit?i("span",[i("b-form-checkbox",{attrs:{disabled:!t.items.setApplyYn},on:{change:function(i){t.onChecked(e.item,"2")}},model:{value:e.item.band2UseYn,callback:function(t){e.item.band2UseYn=t},expression:"row.item.band2UseYn"}}),t._v(" "),i("cleave",{staticClass:"form-control",staticStyle:{width:"80px"},attrs:{options:{numeral:!0,numeralPositiveOnly:!0,numeralDecimalScale:0},disabled:!e.item.band2UseYn},on:{input:function(i){t.setDefault(e.item,"bandwidth2")}},model:{value:e.item.bandwidth2,callback:function(i){e.item.bandwidth2=t._n(i)},expression:"row.item.bandwidth2"}}),t._v(" GB 제한\n          ")],1):i("span",[t._v(t._s(e.value>0?e.value+" GB 제한":"--"))])]}},{key:"FOOT_serviceTypeCodeName",fn:function(e){return[t._v("\n          Total\n        ")]}},{key:"FOOT_bandwidth1",fn:function(e){return[t.total[a].bandwidth1>t.items.bandwidth?i("span",{staticClass:"warning text-danger"},[t._v("설정 가능한 최대 Bandwidth "+t._s(t.items.bandwidth)+" GB를 초과하였습니다")]):t._e(),t._v(" "),i("span",{class:{"text-danger":t.total[a].bandwidth1>t.items.bandwidth}},[t._v(t._s(t.total[a].bandwidth1))])]}},{key:"FOOT_bandwidth2",fn:function(e){return[t.total[a].bandwidth2>t.items.bandwidth?i("span",{staticClass:"warning text-danger"},[t._v("설정 가능한 최대 Bandwidth "+t._s(t.items.bandwidth)+" GB를 초과하였습니다")]):t._e(),t._v(" "),i("span",{class:{"text-danger":t.total[a].bandwidth2>t.items.bandwidth}},[t._v(t._s(t.total[a].bandwidth2))])]}}])})],1):t._e(),t._v(" "),t.isEdit?t._e():i("b-form-fieldset",{attrs:{label:"배포 일시 / 상태","label-cols":3,horizontal:!0}},[t._v("\n      "+t._s(t.items.createDateTime)+"\n      "),i("b-form-input",{staticStyle:{width:"30px"},attrs:{value:t.deploy.status?"성공":"실패",plaintext:"",type:"text"}}),t._v("\n      ("),i("a",{attrs:{href:"#"}},[t._v(t._s(t.deploy.count))]),t._v(")\n    ")],1)],1):t._e()}),t._v(" "),t.isEdit?i("b-card",[i("b-form-fieldset",{attrs:{label:"변경이력","label-cols":3,horizontal:!0}},[i("b-form-textarea",{attrs:{rows:6},model:{value:t.items.modifyHistReason,callback:function(e){t.items.modifyHistReason=e},expression:"items.modifyHistReason"}})],1)],1):t._e(),t._v(" "),t.isEdit?t._e():i("div",{staticClass:"collapse-title"},[i("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.history",modifiers:{history:!0}}],attrs:{variant:"secondary",block:!0}},[t._v("\n      처리이력\n      "),i("i",{staticClass:"fa fa-angle-down"})])],1),t._v(" "),t.isEdit?t._e():i("b-collapse",{attrs:{id:"history"}},[i("b-card",[i("b-form-fieldset",{attrs:{label:"등록일","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.createDateTime,plaintext:"",type:"text"}})],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"등록자","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.createId,plaintext:"",type:"text"}})],1),t._v(" "),t.items.modifyDateTime?i("b-form-fieldset",{attrs:{label:"수정일","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.modifyDateTime,plaintext:"",type:"text"}})],1):t._e(),t._v(" "),t.items.modifyDateTime?i("b-form-fieldset",{attrs:{label:"수정자","label-cols":3,horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.modifyId,plaintext:"",type:"text"}})],1):t._e()],1)],1),t._v(" "),t.isEdit?i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:t.onView}},[t._v("취소")]),t._v(" "),i("b-button",{attrs:{type:"button",variant:"primary",disabled:!t.onCheckBandwidth()},on:{click:t.onSubmit}},[t._v("저장")])],1):i("div",{staticClass:"page-btn"},[i("b-button",{staticClass:"float-left",attrs:{type:"button",variant:"outline-secondary"},on:{click:t.onDelete}},[t._v("삭제")]),t._v(" "),i("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Cache Throttling 관리"}}},[t._v("목록")]),t._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:t.onEdit}},[t._v("수정")])],1),t._v(" "),i("b-modal",{attrs:{size:"lg",title:"이력관리"},model:{value:t.isModalHistory,callback:function(e){t.isModalHistory=e},expression:"isModalHistory"}},[i("section",{staticClass:"board"},[i("b-table",{attrs:{striped:"",bordered:"",hover:"","show-empty":"",items:t.history.items,fields:t.history.fields},scopedSlots:t._u([{key:"histMgmtId",fn:function(e){return[i("a",{attrs:{href:t.getHistoryLink(e.value,e.item.caseSeq),target:"_blank"}},[t._v("보기")])]}}])})],1),t._v(" "),i("div",{slot:"modal-footer"},[i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:function(e){t.isModalHistory=!1}}},[i("i",{staticClass:"fa fa-dot-circle-o"}),t._v(" 확인")])],1)]),t._v(" "),i("b-modal",{staticClass:"modal-danger",attrs:{title:"Message",size:"sm"},model:{value:t.isModalMessage,callback:function(e){t.isModalMessage=e},expression:"isModalMessage"}},[i("div",{staticClass:"d-block text-center"},[i("h5",[t._v(t._s(t.modalMessage))])]),t._v(" "),i("div",{slot:"modal-footer"},[i("b-button",{attrs:{type:"button",variant:"danger"},on:{click:t.onDeleteData}},[i("i",{staticClass:"fa fa-dot-circle-o"}),t._v(" 삭제")]),t._v(" "),i("b-button",{attrs:{type:"button",variant:"secondary"},on:{click:function(e){t.isModalMessage=!1}}},[i("i",{staticClass:"fa fa-ban"}),t._v(" 취소")])],1)])],2)},s=[],n={render:a,staticRenderFns:s};e.a=n}});