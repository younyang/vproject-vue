webpackJsonp([53],{1124:function(e,t,i){"use strict";var s=i(180),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e};t.a={name:"services",components:{cSwitch:s.a},data:function(){return{items:{serviceTypeName:"",rankSize:null,rankCount:null,hashDivisor:null,serviceTypeUseYn:!0,serviceTypeProtocolList:[]},code:{serviceTypeProtocolList:[],protocolList:[]},isLoad:{serviceTypeProtocolList:!0},serviceTypeNameExists:null,inValidForm:!1}},computed:{serviceTypeProtocolList:{get:function(){var e=this;return this.items.serviceTypeProtocolList.length>0?this.items.serviceTypeProtocolList.map(function(t){return e.code.serviceTypeProtocolList.find(function(e){return e.code===t.protocolCode})}):[]},set:function(e){this.items.serviceTypeProtocolList=e.length>0?e.map(function(e){return{protocolCode:e.code}}):[]}},valid:function(){return{serviceTypeName:null===this.items.serviceTypeName||0===this.items.serviceTypeName.length?null:this.items.serviceTypeName.length>0&&/^[A-Za-z0-9]*$/.test(this.items.serviceTypeName),serviceTypeProtocolList:this.items.serviceTypeProtocolList.length}},feedback:function(){return{serviceTypeName:!/^[A-Za-z0-9]*$/.test(this.items.serviceTypeName)&&this.items.serviceTypeName.length>0?"영문, 숫자만 입력하십시오.":null===this.serviceTypeNameExists&&this.items.serviceTypeName.length>0?"중복확인은 필수입니다.":"not"===this.serviceTypeNameExists?"입력된 항목이 없습니다.":"fail"===this.serviceTypeNameExists?"이미 등록된 Service Name이 있습니다.":0===this.items.serviceTypeName.length?this.$valid.msg.require:""}}},created:function(){var e=this;this.$https.get("/system/commonCode",{q:{groupCode:"PROTOCOL"}}).then(function(t){e.isLoad.serviceTypeProtocolList=!1,e.code.serviceTypeProtocolList=t.data.items.map(function(e){return e.codeName=e.codeName.toUpperCase(),e})})},methods:{fetchNameExists:function(){var e=this;if(!this.items.serviceTypeName)return void(this.serviceTypeNameExists="not");this.$https.get("/servicetype/name",{serviceTypeName:this.items.serviceTypeName}).then(function(t){e.serviceTypeNameExists="Success"===t.data.result?"success":"fail"})},onSubmit:function(){var e=this,t=r({},this.items);this.items.modifyHistReason="등록",this.validate(t)&&this.$https.put("/servicetype/type1",t).then(function(t){e.$router.push({name:"ServiceType 상세",params:{id:t.data.items.serviceTypeId}})}).catch(function(e){console.log(e)})},validate:function(e){var t=(e.serviceTypeName,e.serviceTypeProtocolList,e.rankSize,e.rankCount,e.hashDivisor,e.serviceTypeUseYn,e),i=this.$valid.all(t);return this.inValidForm=!i,i}}}},1125:function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"animated fadeIn"},[i("b-form",{staticClass:"formView",attrs:{validated:e.inValidForm,novalidate:""}},[i("b-form-fieldset",{attrs:{description:"","invalid-feedback":e.feedback.serviceTypeName,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n        Name"),i("i",{staticClass:"require"},[e._v("*")])]),e._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"",state:e.valid.serviceTypeName,required:""},on:{input:function(t){e.serviceTypeNameExists=null}},model:{value:e.items.serviceTypeName,callback:function(t){e.$set(e.items,"serviceTypeName",t)},expression:"items.serviceTypeName"}}),e._v(" "),i("b-button",{attrs:{variant:"in-table"},on:{click:e.fetchNameExists}},[e._v("중복확인")]),e._v(" "),null!==e.serviceTypeNameExists?i("span",{staticClass:"ico ml-2 mid"},["success"===e.serviceTypeNameExists?i("i",{staticClass:"fa fa-check-circle"}):e._e(),e._v(" "),"fail"===e.serviceTypeNameExists?i("i",{staticClass:"fa fa-times-circle"}):e._e()]):e._e()],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n        Protocol"),i("i",{staticClass:"require"},[e._v("*")])]),e._v(" "),i("multiselect",{staticClass:"multiple",class:{invalid:!e.valid.serviceTypeProtocolList},attrs:{"track-by":"code",label:"codeName",multiple:!0,showLabels:!1,options:e.code.serviceTypeProtocolList,loading:e.isLoad.serviceTypeProtocolList,placeholder:"Select service type protocol"},model:{value:e.serviceTypeProtocolList,callback:function(t){e.serviceTypeProtocolList=t},expression:"serviceTypeProtocolList"}})],2),e._v(" "),i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"Rank Size<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("b-form-input",{attrs:{type:"number",min:"1",max:"99999999999",required:""},model:{value:e.items.rankSize,callback:function(t){e.$set(e.items,"rankSize",t)},expression:"items.rankSize"}})],1),e._v(" "),i("b-form-fieldset",{attrs:{label:"Rank Count<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("b-form-input",{attrs:{type:"number",min:"1",max:"99999999999",required:""},model:{value:e.items.rankCount,callback:function(t){e.$set(e.items,"rankCount",t)},expression:"items.rankCount"}})],1)],1),e._v(" "),i("b-form-fieldset",{attrs:{label:"hashDivisor<i class='require'>*</i>","invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("b-form-input",{attrs:{type:"text",required:""},model:{value:e.items.hashDivisor,callback:function(t){e.$set(e.items,"hashDivisor",t)},expression:"items.hashDivisor"}})],1),e._v(" "),i("b-form-fieldset",{attrs:{label:"사용여부",horizontal:!0}},[i("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"사용",off:"미사용"},model:{value:e.items.serviceTypeUseYn,callback:function(t){e.$set(e.items,"serviceTypeUseYn",t)},expression:"items.serviceTypeUseYn"}})],1)],1),e._v(" "),i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"ServiceType 관리"}}},[e._v("취소")]),e._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onSubmit}},[e._v("저장")])],1)],1)},r=[],a={render:s,staticRenderFns:r};t.a=a},646:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(1124),r=i(1125),a=i(15),o=a(s.a,r.a,null,null,null);t.default=o.exports}});