webpackJsonp([23],{633:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s(840),o=s(841),a=s(13),r=a(i.a,o.a,null,null,null);t.default=r.exports},840:function(e,t,s){"use strict";function i(e){if(Array.isArray(e)){for(var t=0,s=Array(e.length);t<e.length;t++)s[t]=e[t];return s}return Array.from(e)}var o=s(183),a=s(182),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var i in s)Object.prototype.hasOwnProperty.call(s,i)&&(e[i]=s[i])}return e};t.a={name:"service",props:["id"],components:{ContentHeader:o.a,cSwitch:a.a},data:function(){return{name:"Service 상세",originItems:{},items:{serviceName:"",companyName:"",serviceTypeCode:[],serviceTypeList:[],serviceDomainList:[],cnameUseYn:!1,cnameDomainName:"",sslCertUseYn:!1,sslCert:"",sslCertKey:"",sslCertExpireDate:"",serviceUseYn:!1,modifyHistReason:""},code:{serviceTypeCode:[],serviceTypeCodeAll:[],domainProtocolCode:[],domainHashingTypeCode:[]},history:{fields:{createId:{label:"등록/수정자",class:"text-left"},histBeginDateTime:{label:"등록/수정일시"},modifyHistReason:{label:"변경이력",class:"text-left"},histMgmtId:{label:"보기"}},items:[],pageInfo:{page:1,size:10,totalCount:1}},serviceItems:{command:"ADD",serviceTypeCode:[],modifyHistReason:"서비스 타입 수정"},serviceUseYnItems:{serviceUseYn:null,modifyHistReason:"서비스 사용 여부 변경"},isLoad:{serviceTypeCode:!0,domainProtocolCode:!0,domainHashingTypeCode:!0},isEdit:!1,isModalHistory:!1,isModalServiceType:!1,isModalUseYn:!1,modal:{open:!1,type:"done",msg:"",action:function(){}},inValidServiceForm:!1,inValidRemoveServiceType:!1,inValidUseForm:!1,inValidForm:!1}},computed:{serviceTypeCode:{get:function(){var e=this;return this.items.serviceTypeCode.length>0?this.items.serviceTypeCode.map(function(t){return e.code.serviceTypeCode.find(function(e){return e.code===t})}):[]},set:function(e){this.items.serviceTypeCode=e.length>0?e.map(function(e){return e.code}):[]}},isProcessComplete:function(){return null!==this.items.processStateCode&&""!==this.items.processStateCode&&"PROCESS_STATE_02"===this.items.processStateCode},valid:function(){return{serviceTypeCode:this.items.serviceTypeCode.length&&this.serviceItems.serviceTypeCode.length&&!this.inValidRemoveServiceType}},feedback:function(){return{serviceTypeCode:this.inValidRemoveServiceType?"사용 설정된 PoP이 존재하여 삭제할 수 없습니다. 삭제 후, 다시 시도해주세요.":0===this.serviceItems.serviceTypeCode.length?"변경된 사항이 없습니다.":0===this.items.serviceTypeCode.length?this.$valid.msg.select:""}}},created:function(){var e=this,t=this.$route.query.histories;this.detailUrl=void 0!==t?"/services/"+this.id+"/histories/"+t:"/services/"+this.id,t&&document.querySelector("body.app").classList.add("history-mode");var s=function(t){return e.isLoad.serviceTypeCode=!1,e.code.serviceTypeCodeAll=t.data.items,e.code.serviceTypeCode=t.data.items.filter(function(e){return 4===e.code.split("_")[2].length}),e.$https.get("/system/commonCode",{q:{groupCode:"DOMAIN_PROTOCOL"}})},i=function(t){return e.isLoad.domainProtocolCode=!1,e.code.domainProtocolCode=t.data.items,e.$https.get("/system/commonCode",{q:{groupCode:"HASHING_TYPE"}})},o=function(t){return e.isLoad.domainHashingTypeCode=!1,e.code.domainHashingTypeCode=t.data.items,e.$https.get(e.detailUrl)};(function(){return e.$https.get("/system/commonCode",{q:{groupCode:"SERVICE_TYPE"}})})().then(s).then(i).then(o).then(this.fetchDetail)},methods:{fetchDetail:function(e){var t=this;this.items=e.data.items,this.items.serviceDomainList=this.items.serviceDomainList.map(function(e){return r({},e,{domainProtocolCode:t.code.domainProtocolCode.find(function(t){return t.code===e.domainProtocolCode}),domainHashingTypeCode:t.code.domainHashingTypeCode.find(function(t){return t.code===e.domainHashingTypeCode}),serviceTypeCode:t.code.serviceTypeCodeAll.find(function(t){return t.code===e.serviceTypeCode})})}),this.originItems=JSON.parse(JSON.stringify(this.items))},onEdit:function(){this.isEdit=!0},onView:function(){this.isEdit=!1,this.items=JSON.parse(JSON.stringify(this.originItems))},onSubmit:function(){var e=this,t=r({},this.items,{serviceDomainList:this.items.serviceDomainList.length?this.items.serviceDomainList.map(function(e){var t=e.serviceTypeCode,s=e.domainProtocolCode,i=e.domainHashingTypeCode,o=t.code;return{serviceTypeCode:4===t.code.split("_")[2].length?o.slice(0,o.length-2):o,domainProtocolCode:s.code,domainHashingTypeCode:i.code}}):[]});this.validate(t)&&this.$https.put("/services/"+this.id,t).then(function(t){e.$router.go(e.$router.currentRoute)}).catch(function(e){console.log(e)})},onDelete:function(){this.modal={open:!0,type:"error",msg:"정말로 삭제하시겠습니까?",action:this.onDeleteData}},onDeleteData:function(){var e=this;this.$https.delete("/services/"+this.id).then(function(t){e.$router.push({name:"Service 관리"})}).catch(function(e){console.log(e)})},onSubmitService:function(){var e=this,t=this.$valid.all(this.serviceItems)&&this.items.serviceTypeCode.length>0;this.inValidServiceForm=!t,t&&this.$https.put("/services/"+this.id+"/types",this.serviceItems).then(function(){e.$router.go(e.$router.currentRoute)}).catch(function(t){console.log(t),e.onResetService()})},onResetService:function(){this.isModalServiceType=!1,this.resetServiceType(),this.serviceItems={command:"ADD",serviceTypeCode:[],modifyHistReason:"서비스 타입 수정"}},resetServiceType:function(){this.serviceItems.serviceTypeCode=[],this.items.serviceTypeCode=[].concat(i(this.originItems.serviceTypeCode))},onSubmitUseYn:function(){var e=this;this.serviceUseYnItems.serviceUseYn=this.items.serviceUseYnItems;var t=this.$valid.all(this.serviceUseYnItems);this.inValidUseForm=!t,t&&this.$https.put("/services/"+this.id+"/use",this.serviceUseYnItems).then(function(){e.isModalUseYn=!1}).catch(function(t){console.log(t),e.onResetUseYn()})},onResetUseYn:function(){this.isModalUseYn=!1,this.items.serviceUseYn=this.originItems.serviceUseYn,this.serviceUseYnItems={serviceUseYn:this.items.serviceUseYn,modifyHistReason:"서비스 사용 여부 변경"}},validate:function(e){var t=e.cnameDomainName,s=e.sslCert,i=e.sslCertKey,o=e.sslCertExpireDate,a=e.modifyHistReason,n={modifyHistReason:a};this.items.cnameUseYn&&(n=r({},n,{cnameDomainName:t})),this.items.sslCertUseYn&&(n=r({},n,{sslCert:s,sslCertKey:i,sslCertExpireDate:o}));var l=this.$valid.all(n);return this.inValidForm=!l,l},getHistoryLink:function(e){return"#/service/service/"+this.id+"?histories="+e},showHistory:function(){var e=this;this.isModalHistory=!this.isModalHistory,this.$https.get("/services/"+this.id+"/histories").then(function(t){e.history.items=t.data.items})},onSelectType:function(e){this.serviceItems.serviceTypeCode.push(e.code)},onRemoveType:function(e){var t=this;this.$https.get("services/"+this.id+"/types",{serviceType:e.code}).then(function(s){t.inValidRemoveServiceType=!("Success"===s.data.result),t.inValidRemoveServiceType?t.items.serviceTypeCode=[].concat(i(t.originItems.serviceTypeCode)):t.serviceItems.serviceTypeCode.push(e.code)})}}}},841:function(e,t,s){"use strict";var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"animated fadeIn"},[s("content-header",{attrs:{title:e.items.serviceName,name:e.name}}),e._v(" "),s("div",{staticClass:"collapse-title"},[s("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formDefault",modifiers:{formDefault:!0}}],staticClass:"btn-collapse"},[s("i",{staticClass:"fa"}),e._v("\n      기본정보\n    ")])],1),e._v(" "),s("b-collapse",{attrs:{id:"formDefault",visible:""}},[s("b-form",{staticClass:"formView",attrs:{validated:e.inValidForm,novalidate:""}},[s("b-form-fieldset",{attrs:{label:"Company",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.companyName,type:"text",plaintext:""}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Service Name",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.serviceName,plaintext:"",type:"text"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Service Type",horizontal:!0}},[e._l(e.items.serviceTypeList,function(t){return s("div",{staticClass:"badge-list"},[t?s("span",{staticClass:"badge sm"},[e._v("\n            "+e._s(t.serviceTypeName)+"\n          ")]):e._e()])}),e._v(" "),e.isEdit?e._e():s("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{variant:"in-table-icon",title:"Service Type 수정"},on:{click:function(t){e.isModalServiceType=!e.isModalServiceType}}},[s("i",{staticClass:"fa fa-pencil"})])],2),e._v(" "),s("b-form-fieldset",{attrs:{label:"Domain",horizontal:!0}},[e.items.serviceDomainList.length&&e.isEdit?s("b-table",{staticClass:"sub",attrs:{"show-empty":"",items:e.items.serviceDomainList,fields:{serviceTypeCode:{label:"&nbsp;",class:"index"},domainProtocolCode:{label:"Domain<i class='require'>*</i>",class:"text-left"},domainHashingTypeCode:{label:"Hasing type<i class='require'>*</i>",class:"w-25"}}},scopedSlots:e._u([{key:"serviceTypeCode",fn:function(t){return[e._v("\n            "+e._s(t.value.codeValChar1)+"\n          ")]}},{key:"domainProtocolCode",fn:function(t){return[s("multiselect",{staticClass:"protocol noEmpty",attrs:{label:"codeName",allowEmpty:!1,showLabels:!1,searchable:!1,options:e.code.domainProtocolCode,loading:e.isLoad.domainProtocolCode,placeholder:"://"},model:{value:t.item.domainProtocolCode,callback:function(e){t.item.domainProtocolCode=e},expression:"row.item.domainProtocolCode"}}),e._v(" "),s("span",{staticClass:"font-text-alone"},[s("strong",{staticClass:"text-primary"},[e._v(e._s(e._f("lowercase")(t.item.serviceTypeCode.codeValChar1))+"."+e._s(e.items.serviceName))]),e._v(".vessels.com\n            ")])]}},{key:"domainHashingTypeCode",fn:function(t){return[s("multiselect",{staticClass:"noEmpty",attrs:{label:"codeName",allowEmpty:!1,showLabels:!1,searchable:!1,options:e.code.domainHashingTypeCode,loading:e.isLoad.domainHashingTypeCode},model:{value:t.item.domainHashingTypeCode,callback:function(e){t.item.domainHashingTypeCode=e},expression:"row.item.domainHashingTypeCode"}})]}}])}):e._e(),e._v(" "),e.items.serviceDomainList.length&&!e.isEdit?s("div",{staticClass:"form-in-view"},e._l(e.items.serviceDomainList,function(t,i){return s("b-form-fieldset",{key:i,attrs:{label:t.serviceTypeName,horizontal:!0}},[s("span",{staticClass:"font-text-alone"},[e._v("\n              "+e._s(t.domainProtocolName)),s("strong",{staticClass:"text-primary"},[e._v(e._s(e._f("lowercase")(t.serviceTypeName))+"."+e._s(e.items.serviceName))]),e._v(".vessels.com\n            ")])])})):e._e()],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"CNAME 사용여부",horizontal:!0}},[e.isEdit?s("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"사용",off:"미사용"},model:{value:e.items.cnameUseYn,callback:function(t){e.items.cnameUseYn=t},expression:"items.cnameUseYn"}}):s("span",{staticClass:"badge",class:{primary:e.items.cnameUseYn}},[e._v(e._s(e.items.cnameUseYn?"사용":"미사용")+"\n        ")])],1),e._v(" "),e.items.cnameUseYn?s("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("template",{slot:"label"},[e._v("\n          CNAME 도메인"),e.isEdit?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("b-form-input",{attrs:{type:"text",plaintext:!e.isEdit,required:""},model:{value:e.items.cnameDomainName,callback:function(t){e.items.cnameDomainName=t},expression:"items.cnameDomainName"}})],2):e._e(),e._v(" "),s("b-form-fieldset",{attrs:{label:"SSL 인증서",horizontal:!0}},[e.isEdit?s("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"사용",off:"미사용"},model:{value:e.items.sslCertUseYn,callback:function(t){e.items.sslCertUseYn=t},expression:"items.sslCertUseYn"}}):s("span",{staticClass:"badge",class:{primary:e.items.sslCertUseYn}},[e._v(e._s(e.items.sslCertUseYn?"사용":"미사용")+"\n        ")])],1),e._v(" "),e.items.sslCertUseYn?s("b-form-fieldset",{attrs:{horizontal:!0}},[s("template",{slot:"label"},[e._v("\n          SSL 인증서"),e.isEdit?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("div",{staticClass:"form-in-view"},[s("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("template",{slot:"label"},[e._v("\n              Cert"),e.isEdit?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("b-form-textarea",{attrs:{"no-resize":!e.isEdit,disabled:!e.isEdit,rows:"6",required:""},model:{value:e.items.sslCert,callback:function(t){e.items.sslCert=t},expression:"items.sslCert"}})],2),e._v(" "),s("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("template",{slot:"label"},[e._v("\n              Key"),e.isEdit?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("b-form-textarea",{attrs:{"no-resize":!e.isEdit,disabled:!e.isEdit,rows:"6",required:""},model:{value:e.items.sslCertKey,callback:function(t){e.items.sslCertKey=t},expression:"items.sslCertKey"}})],2),e._v(" "),s("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("template",{slot:"label"},[e._v("\n              만료일"),e.isEdit?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("b-form-input",{attrs:{type:"date",plaintext:!e.isEdit,required:""},model:{value:e.items.sslCertExpireDate,callback:function(t){e.items.sslCertExpireDate=t},expression:"items.sslCertExpireDate"}})],2)],1)],2):e._e(),e._v(" "),s("b-form-fieldset",{attrs:{label:"사용여부",horizontal:!0}},[s("span",{staticClass:"badge",class:{primary:e.items.serviceUseYn}},[e._v(e._s(e.items.serviceUseYn?"사용":"미사용")+"\n        ")]),e._v(" "),e.isEdit?e._e():s("b-button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{variant:"in-table-icon",title:"Service 사용여부 수정"},on:{click:function(t){e.isModalUseYn=!e.isModalUseYn}}},[s("i",{staticClass:"fa fa-pencil"})])],1),e._v(" "),e.isEdit?s("b-form-fieldset",{attrs:{label:"변경이력<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("b-form-textarea",{attrs:{rows:6,required:""},model:{value:e.items.modifyHistReason,callback:function(t){e.items.modifyHistReason=t},expression:"items.modifyHistReason"}})],1):e._e()],1)],1),e._v(" "),e.isEdit?e._e():s("div",{staticClass:"collapse-title"},[s("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formHistory",modifiers:{formHistory:!0}}],staticClass:"btn-collapse"},[s("i",{staticClass:"fa"}),e._v("\n      처리이력\n    ")])],1),e._v(" "),e.isEdit?e._e():s("b-collapse",{attrs:{id:"formHistory",visible:""}},[s("b-form",{staticClass:"formView"},[s("div",{staticClass:"form-row"},[s("b-form-fieldset",{attrs:{label:"등록일시",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.createDateTime,plaintext:"",type:"text"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"등록자",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.createId,plaintext:"",type:"text"}})],1)],1),e._v(" "),s("div",{staticClass:"form-row"},[e.items.modifyDateTime?s("b-form-fieldset",{attrs:{label:"수정일",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.modifyDateTime,plaintext:"",type:"text"}})],1):e._e(),e._v(" "),s("b-form-fieldset",{attrs:{label:"수정자",horizontal:!0}},[s("b-form-input",{attrs:{value:e.items.modifyId,plaintext:"",type:"text"}})],1)],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"배포상태",horizontal:!0}},[s("input",{staticClass:"form-control-plaintext",staticStyle:{width:"50px"},attrs:{type:"text",readonly:"readonly"},domProps:{value:e.items.processStateCodeName}}),e._v(" "),s("a",{staticClass:"btn btn-in-table",attrs:{href:"#/workflow/service/"+e.items.processId,target:"_blank"}},[e._v(e._s(e.items.processId))])])],1)],1),e._v(" "),e.isEdit?s("div",{staticClass:"page-btn"},[s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:e.onView}},[e._v("취소")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onSubmit}},[e._v("저장")])],1):s("div",{staticClass:"page-btn"},[e.isProcessComplete?s("span",[s("b-button",{staticClass:"float-left",attrs:{type:"button",variant:"outline-secondary"},on:{click:e.onDelete}},[e._v("삭제")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:e.showHistory}},[e._v("이력관리")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Service 관리"}}},[e._v("목록")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onEdit}},[e._v("수정")])],1):s("span",[s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:e.showHistory}},[e._v("이력관리")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Service 관리"}}},[e._v("목록")])],1)]),e._v(" "),s("b-modal",{attrs:{id:"serviceModal",size:"lg"},on:{hide:e.onResetService},model:{value:e.isModalServiceType,callback:function(t){e.isModalServiceType=t},expression:"isModalServiceType"}},[s("template",{slot:"modal-title"},[e._v("\n      "+e._s(e.items.serviceName)+"\n      "),s("small",[e._v(" > Service Type")])]),e._v(" "),s("b-form",{staticClass:"formView",attrs:{validated:e.inValidServiceForm,novalidate:""}},[s("b-form-fieldset",{attrs:{label:"구분",horizontal:!0}},[s("b-form-radio-group",{attrs:{options:[{text:"추가",value:"ADD"},{text:"삭제",value:"DELETE"}]},on:{change:e.resetServiceType},model:{value:e.serviceItems.command,callback:function(t){e.serviceItems.command=t},expression:"serviceItems.command"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{"invalid-feedback":e.feedback.serviceTypeCode,horizontal:!0}},[s("template",{slot:"label"},[e._v("\n          Service Type "),"DELETE"===e.serviceItems.command?s("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),s("multiselect",{staticClass:"multiple",class:{"is-invalid":!e.valid.serviceTypeCode},attrs:{role:"ADD"===e.serviceItems.command?"addMode":"delMode","track-by":"code",label:"codeName",multiple:!0,searchable:!1,showLabels:!1,closeOnSelect:!1,options:e.code.serviceTypeCode,loading:e.isLoad.serviceTypeCode},on:{select:e.onSelectType,remove:e.onRemoveType},model:{value:e.serviceTypeCode,callback:function(t){e.serviceTypeCode=t},expression:"serviceTypeCode"}})],2),e._v(" "),s("b-form-fieldset",{attrs:{label:"변경이력<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("b-form-textarea",{attrs:{rows:6,required:""},model:{value:e.serviceItems.modifyHistReason,callback:function(t){e.serviceItems.modifyHistReason=t},expression:"serviceItems.modifyHistReason"}})],1)],1),e._v(" "),s("div",{slot:"modal-footer"},[s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onSubmitService}},[e._v("저장")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:e.onResetService}},[e._v("취소")])],1)],2),e._v(" "),s("b-modal",{attrs:{size:"lg"},on:{hide:e.onResetUseYn},model:{value:e.isModalUseYn,callback:function(t){e.isModalUseYn=t},expression:"isModalUseYn"}},[s("template",{slot:"modal-title"},[e._v("\n      "+e._s(e.items.serviceName)+"\n      "),s("small",[e._v(" > 사용 여부")])]),e._v(" "),s("b-form",{staticClass:"formView",attrs:{validated:e.inValidUseForm,novalidate:""}},[s("b-form-fieldset",{attrs:{label:"사용 여부",horizontal:!0}},[s("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"사용",off:"미사용"},model:{value:e.items.serviceUseYn,callback:function(t){e.items.serviceUseYn=t},expression:"items.serviceUseYn"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"변경이력<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[s("b-form-textarea",{attrs:{rows:6,required:""},model:{value:e.serviceUseYnItems.modifyHistReason,callback:function(t){e.serviceUseYnItems.modifyHistReason=t},expression:"serviceUseYnItems.modifyHistReason"}})],1)],1),e._v(" "),s("div",{slot:"modal-footer"},[s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onSubmitUseYn}},[e._v("저장")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:e.onResetUseYn}},[e._v("취소")])],1)],2),e._v(" "),s("b-modal",{attrs:{size:"lg",title:"이력관리"},model:{value:e.isModalHistory,callback:function(t){e.isModalHistory=t},expression:"isModalHistory"}},[s("section",{staticClass:"board"},[s("b-table",{attrs:{hover:"","show-empty":"",items:e.history.items,fields:e.history.fields,"current-page":e.history.pageInfo.page,"per-page":e.history.pageInfo.size},scopedSlots:e._u([{key:"histMgmtId",fn:function(t){return[s("a",{attrs:{href:e.getHistoryLink(t.value),target:"_blank"}},[e._v("보기")])]}}])})],1),e._v(" "),s("b-pagination",{staticClass:"mt-2",attrs:{"total-rows":e.history.pageInfo.totalCount,"per-page":e.history.pageInfo.size},model:{value:e.history.pageInfo.page,callback:function(t){e.history.pageInfo.page=t},expression:"history.pageInfo.page"}}),e._v(" "),s("div",{slot:"modal-footer"},[s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:function(t){e.isModalHistory=!1}}},[e._v("확인")])],1)],1),e._v(" "),s("b-modal",{class:"modal-"+e.modal.type,attrs:{title:"Message",size:"sm"},model:{value:e.modal.open,callback:function(t){e.modal.open=t},expression:"modal.open"}},[s("div",{staticClass:"d-block text-center"},[s("p",[e._v(e._s(e.modal.msg))])]),e._v(" "),s("div",{staticClass:"mx-auto",slot:"modal-footer"},[s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.modal.action}},[e._v("확인")]),e._v(" "),s("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:function(t){e.modal.open=!1}}},[e._v("취소")])],1)])],1)},o=[],a={render:i,staticRenderFns:o};t.a=a}});