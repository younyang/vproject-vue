webpackJsonp([10],{439:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s(724),i=s(725),a=s(11),n=a(o.a,i.a,null,null,null);t.default=n.exports},724:function(e,t,s){"use strict";var o=s(140);t.a={name:"services",components:{cSwitch:o.a},data:function(){return{items:{accountId:null,serviceName:"",serviceTypeCode:[],serviceDomainList:[],cnameUseYn:!0,cnameDomainName:"",sslCertUseYn:!0,sslCert:"",sslCertKey:"",sslCertExpireDate:"",serviceUseYn:!0},code:{accountId:[],serviceTypeCode:[],domainProtocolCode:[],domainHashingTypeCode:[]},isLoad:{accountId:!0,serviceTypeCode:!0,domainProtocolCode:!0,domainHashingTypeCode:!0},isModalMessage:!1,modalMessage:"",state:{serviceName:!0}}},computed:{accountId:{get:function(){var e=this;return this.code.accountId.find(function(t){return t.accountId===e.items.accountId})||null},set:function(e){this.items.accountId=null!==e?e.accountId:null}},serviceTypeCode:{get:function(){var e=this;return this.items.serviceTypeCode.length>0?this.items.serviceTypeCode.map(function(t){return e.code.serviceTypeCode.find(function(e){return e.code===t})}):[]},set:function(e){this.items.serviceTypeCode=e.length>0?e.map(function(e){return e.code}):[]}},serviceDomainList:function(){var e=this;return this.items.serviceDomainList.length>0?this.items.serviceDomainList.map(function(t){var s=e.getCodeObj(t.serviceTypeCode);return Object.assign({},t,{domainProtocolCode:e.code.domainProtocolCode.find(function(e){return e.code===t.domainProtocolCode}),domainHashingTypeCode:e.code.domainHashingTypeCode.find(function(e){return e.code===t.domainHashingTypeCode}),serviceCodeVal:s.codeValChar1,serviceCodeName:s.codeName})}):[]}},created:function(){var e=this;this.$https.get("/services/accounts").then(function(t){e.isLoad.accountId=!1,e.code.accountId=t.data.items}),this.$https.get("/system/commonCode",{q:{groupCode:"SERVICE_TYPE"}}).then(function(t){e.isLoad.serviceTypeCode=!1,e.code.serviceTypeCode=t.data.items.filter(function(e){var t=e.code,s=e.codeName,o=e.codeValChar1;return!(4===t.split("_")[2].length&&s===o)})}),this.$https.get("/system/commonCode",{q:{groupCode:"DOMAIN_PROTOCOL"}}).then(function(t){e.isLoad.domainProtocolCode=!1,e.code.domainProtocolCode=t.data.items}),this.$https.get("/system/commonCode",{q:{groupCode:"HASHING_TYPE"}}).then(function(t){e.isLoad.domainHashingTypeCode=!1,e.code.domainHashingTypeCode=t.data.items})},methods:{onSubmit:function(){var e=this;this.items.serviceDomainList=this.serviceDomainList.map(function(e){return{serviceTypeCode:e.serviceTypeCode,domainProtocolCode:null!==e.domainProtocolCode?e.domainProtocolCode.code:null,domainHashingTypeCode:null!==e.domainHashingTypeCode?e.domainHashingTypeCode.code:null}}),this.items.modifyHistReason="등록",this.$https.post("/services",this.items).then(function(t){e.$router.push({name:"Service 상세",params:{id:t.data.items}})}).catch(function(e){console.log(e)})},fetchNameExists:function(){var e=this;this.$https.get("/services/name",{serviceName:this.items.serviceName}).then(function(t){var s="Success"===t.data.result;e.state.serviceName=s,e.modalMessage=s?"사용하실 수 있습니다.":"Service Name 이 중복입니다.",s||(e.items.serviceName=""),e.isModalMessage=!0})},getCodeObj:function(e){return this.code.serviceTypeCode.find(function(t){return t.code===e})||{}},getSelectLabel:function(e){return e.accountName+"/"+e.companyName},onSelectType:function(e){this.serviceDomainList.find(function(t){return t.serviceCodeVal===e.codeValChar1})||this.items.serviceDomainList.push({serviceTypeCode:e.code,domainProtocolCode:this.code.domainProtocolCode[0].code,domainHashingTypeCode:this.code.domainHashingTypeCode[0].code})},onRemoveType:function(e){this.items.serviceDomainList=this.item.serviceDomainList.filter(function(t){return t.serviceTypeCode!==e.code})}}}},725:function(e,t,s){"use strict";var o=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"animated fadeIn"},[s("b-form",[s("b-card",[s("b-form-fieldset",{attrs:{label:"Account *","label-cols":3,horizontal:!0}},[s("multiselect",{attrs:{options:e.code.accountId,showLabels:!1,"custom-label":e.getSelectLabel,loading:e.isLoad.accountId,placeholder:"Select account"},model:{value:e.accountId,callback:function(t){e.accountId=t},expression:"accountId"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Service Name *",description:"Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다.","label-cols":3,horizontal:!0}},[s("b-input-group",[s("b-form-input",{attrs:{type:"text",placeholder:"Enter service name"},model:{value:e.items.serviceName,callback:function(t){e.items.serviceName=t},expression:"items.serviceName"}}),e._v(" "),s("b-input-group-button",{staticClass:"ml-2",slot:"right"},[s("b-button",{attrs:{variant:"outline-secondary"},on:{click:e.fetchNameExists}},[e._v("중복확인")])],1)],1)],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Service Type *","label-cols":3,horizontal:!0}},[s("multiselect",{attrs:{multiple:!0,showLabels:!1,options:e.code.serviceTypeCode,label:"codeName",loading:e.isLoad.serviceTypeCode,"track-by":"code",placeholder:"Select service type"},on:{select:e.onSelectType,remove:e.onRemoveType},model:{value:e.serviceTypeCode,callback:function(t){e.serviceTypeCode=t},expression:"serviceTypeCode"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Domain","label-cols":3,horizontal:!0}},[s("ul",{staticClass:"icons-list"},e._l(e.serviceDomainList,function(t,o){return s("li",[s("i",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"bg-primary",attrs:{title:t.serviceCodeName}},[e._v(e._s(t.serviceCodeVal))]),e._v(" "),s("div",{staticClass:"desc"},[s("small",[e._v("Domain")]),e._v(" "),s("div",{staticClass:"title"},[s("multiselect",{staticClass:"inline sm protocol",attrs:{label:"codeName",allowEmpty:!0,showLabels:!1,searchable:!1,options:e.code.domainProtocolCode,loading:e.isLoad.domainProtocolCode,placeholder:"://"},model:{value:t.domainProtocolCode,callback:function(e){t.domainProtocolCode=e},expression:"domain.domainProtocolCode"}}),e._v("\n                "+e._s(e._f("lowercase")(t.serviceCodeVal))+"."+e._s(e.items.serviceName)+".vessels.com\n              ")],1)]),e._v(" "),s("div",{staticClass:"value"},[s("div",{staticClass:"small text-muted"},[e._v("Hashing Type")]),e._v(" "),s("multiselect",{staticClass:"inline sm",attrs:{label:"codeName",allowEmpty:!0,showLabels:!1,searchable:!1,options:e.code.domainHashingTypeCode,loading:e.isLoad.domainHashingTypeCode,placeholder:"Select"},model:{value:t.domainHashingTypeCode,callback:function(e){t.domainHashingTypeCode=e},expression:"domain.domainHashingTypeCode"}})],1)])}))]),e._v(" "),s("b-form-fieldset",{attrs:{label:"CNAME 사용여부","label-cols":3,horizontal:!0}},[s("c-switch",e._b({attrs:{type:"icon",variant:"success",pill:!0},model:{value:e.items.cnameUseYn,callback:function(t){e.items.cnameUseYn=t},expression:"items.cnameUseYn"}},"c-switch",{on:"",off:""},!1))],1),e._v(" "),e.items.cnameUseYn?s("b-form-fieldset",{attrs:{label:"CNAME 도메인","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{type:"text"},model:{value:e.items.cnameDomainName,callback:function(t){e.items.cnameDomainName=t},expression:"items.cnameDomainName"}})],1):e._e(),e._v(" "),s("b-form-fieldset",{attrs:{label:"SSL 인증서","label-cols":3,horizontal:!0}},[s("c-switch",e._b({attrs:{type:"icon",variant:"success",pill:!0},model:{value:e.items.sslCertUseYn,callback:function(t){e.items.sslCertUseYn=t},expression:"items.sslCertUseYn"}},"c-switch",{on:"",off:""},!1))],1),e._v(" "),e.items.sslCertUseYn?s("b-form-fieldset",{attrs:{label:"SSL 인증서","label-cols":3,horizontal:!0}},[s("div",{staticClass:"form-in-group"},[s("b-form-fieldset",{attrs:{label:"Cert","label-cols":2,horizontal:!0}},[s("b-form-textarea",{attrs:{rows:2,placeholder:"Cert"},model:{value:e.items.sslCert,callback:function(t){e.items.sslCert=t},expression:"items.sslCert"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"Key","label-cols":2,horizontal:!0}},[s("b-form-textarea",{attrs:{rows:2,placeholder:"Key"},model:{value:e.items.sslCertKey,callback:function(t){e.items.sslCertKey=t},expression:"items.sslCertKey"}})],1),e._v(" "),s("b-form-fieldset",{attrs:{label:"만료일","label-cols":2,horizontal:!0}},[s("b-form-input",{attrs:{type:"date"},model:{value:e.items.sslCertExpireDate,callback:function(t){e.items.sslCertExpireDate=t},expression:"items.sslCertExpireDate"}})],1)],1)]):e._e(),e._v(" "),s("b-form-fieldset",{attrs:{label:"사용여부","label-cols":3,horizontal:!0}},[s("c-switch",e._b({attrs:{type:"icon",variant:"success",pill:!0},model:{value:e.items.serviceUseYn,callback:function(t){e.items.serviceUseYn=t},expression:"items.serviceUseYn"}},"c-switch",{on:"",off:""},!1))],1),e._v(" "),s("div",{staticClass:"form-btn",slot:"footer"},[s("b-button",{attrs:{type:"button",size:"sm",variant:"primary"},on:{click:e.onSubmit}},[s("i",{staticClass:"fa fa-dot-circle-o"}),e._v(" 저장")]),e._v(" "),s("b-button",{attrs:{type:"button",size:"sm",variant:"secondary",to:{name:"Service 관리"}}},[s("i",{staticClass:"fa fa-ban"}),e._v(" 취소")])],1)],1)],1),e._v(" "),s("b-modal",{class:e.state.serviceName?"modal-primary":"modal-danger",attrs:{"hide-footer":"",title:"Message",size:"sm"},model:{value:e.isModalMessage,callback:function(t){e.isModalMessage=t},expression:"isModalMessage"}},[s("div",{staticClass:"d-block text-center"},[s("h5",[e._v(e._s(e.modalMessage))])]),e._v(" "),s("b-btn",{staticClass:"mt-4",attrs:{variant:e.state.serviceName?"outline-primary":"outline-danger",block:""},on:{click:function(t){e.isModalMessage=!1}}},[e._v("Close")])],1)],1)},i=[],a={render:o,staticRenderFns:i};t.a=a}});