webpackJsonp([48],{1148:function(e,t,i){"use strict";var s=i(181),o=i(180),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e};t.a={name:"service",props:["id"],components:{ContentHeader:s.a,cSwitch:o.a},data:function(){return{name:"Application 상세",originItems:{},items:{createId:null,modifyId:null,operatorId:null,operatorName:null,companyCode:null,companyName:null,deptName:null,email:null,joinApplyDatetime:null,joinApprovalStateCodeName:null,joinApprovalStateCode:null,joinApprovalStateReason:null,joinApprovalState:null,operatorGroupList:[],groupList:[],operatorServiceList:[],serviceList:[]},code:{companyCode:[],groupList:[],serviceList:[],joinApprovalStateCode:[]},isLoad:{companyCode:!0,groupCode:!0,serviceCode:!0},isEdit:!1,isModalHistory:!1,isReason:!1,modal:{open:!1,type:"done",msg:"",action:function(){}},inValidForm:!1,groupSelectPlatform:!1,serviceSelectAll:!1}},computed:{companyCode:{get:function(){var e=this;return this.code.companyCode.find(function(t){return t.code===e.items.companyCode})||null},set:function(e){this.items.companyCode=null!==e?e.code:null}},serviceList:{get:function(){var e=this;return this.items.serviceList.length>0?this.items.serviceList.map(function(t){return e.code.serviceCode.find(function(e){return e.serviceId===t})}):[]},set:function(e){this.items.serviceList=e.length>0?e.map(function(e){return e.serviceId}):[]}},groupList:{get:function(){var e=this;return this.items.groupList.length>0?this.items.groupList.map(function(t){return e.code.groupList.find(function(e){return e.groupId===t})}):[]},set:function(e){this.items.groupList=e.length>0?e.map(function(e){return e.groupId}):[]}},valid:function(){return{operatorName:null!==this.items.operatorName,deptName:null!==this.items.deptName,email:null!==this.items.email,cellphoneNumber:null!==this.items.cellphoneNumber,groupList:!this.groupList.length,serviceList:!this.serviceList.length,joinApprovalState:null!==this.items.joinApprovalState,joinApprovalStateReason:null!==this.items.joinApprovalStateReason}}},created:function(){var e=this,t="/setting/approvals/"+this.id;this.$https.get(t).then(function(t){e.items=a({},e.items,t.data.items);var i=[],s=[];e.items.operatorGroupList.forEach(function(e){i.push(e.groupId)}),e.items.operatorServiceList.forEach(function(e){s.push(e.serviceId)}),e.items.groupList=i,e.items.serviceList=s,e.originItems=JSON.parse(JSON.stringify(e.items)),"JOIN_APPROVAL_STATE_01"===e.items.joinApprovalStateCode?e.isEdit=!0:e.isEdit=!1}),this.$https.get("/setting/operators/services").then(function(t){e.isLoad.serviceCode=!1,e.code.serviceCode=t.data.items,e.code.serviceCode.push({serviceId:0,serviceName:"전체"})}),this.$https.get("/setting/operators/groups").then(function(t){e.isLoad.groupCode=!1,e.code.groupList=t.data.items}),this.$https.get("/system/commonCode",{q:{groupCode:"JOIN_APPROVAL_STATE"}}).then(function(t){e.isLoad.joinApprovalStateCode=!1,e.code.joinApprovalStateCode=t.data.items.filter(function(e){return"JOIN_APPROVAL_STATE_01"!==e.code})}),this.$https.get("/system/commonCode",{q:{groupCode:"COMPANY"}}).then(function(t){e.isLoad.companyCode=!1,e.code.companyCode=t.data.items})},methods:{fetchDetail:function(e){},onSelectCase:function(e){"JOIN_APPROVAL_STATE_03"==e?this.isReason=!0:(this.isReason=!1,this.items.joinApprovalStateReason=" ")},onView:function(){this.isEdit=!1,this.items=JSON.parse(JSON.stringify(this.originItems))},onSubmit:function(){var e=this,t={operatorName:this.items.operatorName,deptName:this.items.deptName,email:this.items.email,cellphoneNumber:this.items.cellphoneNumber,groupList:this.items.groupList,serviceList:this.items.serviceList,joinApprovalState:this.items.joinApprovalState,joinApprovalStateReason:this.items.joinApprovalStateReason};console.log(t.joinApprovalStateReason);var i=this.$valid.all(t);if(this.inValidForm=!i,i){0==this.items.serviceList[0]?(this.items.operatorServiceList=[],this.code.serviceCode.forEach(function(t){0==t.serviceId||e.items.operatorServiceList.push(t.serviceId)})):this.items.operatorServiceList=this.items.serviceList,this.items.operatorGroupList=this.items.groupList,this.items.joinApprovalStateCode=this.items.joinApprovalState,console.log(this.items.joinApprovalState),this.$https.put("/setting/approvals/"+this.id,this.items).then(function(){e.$router.push({name:"Approval 관리"})}).catch(function(e){console.log(e)})}},validate:function(e){},serviceSelect:function(e){0==e.serviceId&&this.code.serviceCode.forEach(function(e){e.$isDisabled=!0})},serviceRemove:function(e){0==e.serviceId&&this.code.serviceCode.forEach(function(e){e.$isDisabled=!1})},groupSelect:function(e){1==e.groupId&&(this.groupSelectPlatform=!0,this.serviceList=[{serviceId:0,serviceName:"전체"}])},groupRemove:function(e){1==e.groupId&&(this.groupSelectPlatform=!1)}}}},1149:function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"animated fadeIn"},[i("div",{staticClass:"collapse-title"},[i("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formDefault",modifiers:{formDefault:!0}}],staticClass:"btn-collapse"},[i("i",{staticClass:"fa"}),e._v("\n      기본정보\n    ")])],1),e._v(" "),i("b-collapse",{attrs:{id:"formDefault",visible:""}},[i("b-form",{staticClass:"formView",attrs:{validated:e.inValidForm,novalidate:""}},[i("b-form-fieldset",{attrs:{horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          ID"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.loginId,callback:function(t){e.$set(e.items,"loginId",t)},expression:"items.loginId"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          이름"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter Name",plaintext:!e.isEdit,required:""},model:{value:e.items.operatorName,callback:function(t){e.$set(e.items,"operatorName",t)},expression:"items.operatorName"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          회사명"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),e.isEdit?i("multiselect",{attrs:{showLabels:!1,searchable:!1,options:e.code.companyCode,loading:e.isLoad.companyCode,label:"codeName","track-by":"code",placeholder:"전체"},model:{value:e.companyCode,callback:function(t){e.companyCode=t},expression:"companyCode"}}):e._e(),e._v(" "),e.isEdit?e._e():i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.companyName,callback:function(t){e.$set(e.items,"companyName",t)},expression:"items.companyName"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          부서"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter deptName",plaintext:!e.isEdit,required:""},model:{value:e.items.deptName,callback:function(t){e.$set(e.items,"deptName",t)},expression:"items.deptName"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          이메일"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter email",plaintext:!e.isEdit,required:""},model:{value:e.items.email,callback:function(t){e.$set(e.items,"email",t)},expression:"items.email"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{label:"전화번호",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",placeholder:"Enter telephoneNumber",plaintext:!e.isEdit},model:{value:e.items.telephoneNumber,callback:function(t){e.$set(e.items,"telephoneNumber",t)},expression:"items.telephoneNumber"}})],1),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          휴대폰"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter cellphoneNumber",plaintext:!e.isEdit,required:""},model:{value:e.items.cellphoneNumber,callback:function(t){e.$set(e.items,"cellphoneNumber",t)},expression:"items.cellphoneNumber"}})],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          그룹"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),e.isEdit?i("multiselect",{staticClass:"multiple",class:{invalid:e.valid.groupList},attrs:{label:"groupName","track-by":"groupId",multiple:!0,showLabels:!1,options:e.code.groupList,loading:e.isLoad.groupCode,placeholder:"Select group"},on:{select:e.groupSelect,remove:e.groupRemove},model:{value:e.groupList,callback:function(t){e.groupList=t},expression:"groupList"}}):i("div",{staticClass:"badge-list"},e._l(e.items.operatorGroupList,function(t){return i("span",{staticClass:"badge sm"},[e._v("\n            "+e._s(t.groupName)+"\n          ")])}))],2),e._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          서비스"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),e.isEdit?i("multiselect",{staticClass:"multiple",class:{invalid:e.valid.serviceList},attrs:{label:"serviceName","track-by":"serviceId",multiple:!0,showLabels:!1,options:e.code.serviceCode,loading:e.isLoad.serviceCode,placeholder:"Select service",disabled:e.groupSelectPlatform},on:{select:e.serviceSelect,remove:e.serviceRemove},model:{value:e.serviceList,callback:function(t){e.serviceList=t},expression:"serviceList"}}):i("div",{staticClass:"badge-list"},e._l(e.items.operatorServiceList,function(t){return i("span",{staticClass:"badge sm"},[e._v("\n            "+e._s(t.serviceName)+"\n          ")])}))],2)],1)],1),e._v(" "),i("div",{staticClass:"collapse-title"},[i("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formHistory",modifiers:{formHistory:!0}}],staticClass:"btn-collapse"},[i("i",{staticClass:"fa"}),e._v("\n      승인 관리\n    ")])],1),e._v(" "),i("b-collapse",{attrs:{id:"formHistory",visible:""}},[i("b-form",{staticClass:"formView",attrs:{validated:e.inValidForm}},[i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"가입신청일시",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.joinApplyDatetime,callback:function(t){e.$set(e.items,"joinApplyDatetime",t)},expression:"items.joinApplyDatetime"}})],1),e._v(" "),i("b-form-fieldset",{attrs:{label:"상태",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.joinApprovalStateCodeName,callback:function(t){e.$set(e.items,"joinApprovalStateCodeName",t)},expression:"items.joinApprovalStateCodeName"}})],1)],1),e._v(" "),i("div",{staticClass:"form-row"},[e.isEdit?e._e():i("b-form-fieldset",{attrs:{label:"반려일시",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.joinApprovalDatetime,callback:function(t){e.$set(e.items,"joinApprovalDatetime",t)},expression:"items.joinApprovalDatetime"}})],1),e._v(" "),e.isEdit?e._e():i("b-form-fieldset",{attrs:{label:"반려자",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:e.items.joinApprovalId,callback:function(t){e.$set(e.items,"joinApprovalId",t)},expression:"items.joinApprovalId"}})],1)],1),e._v(" "),e.isEdit?i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          처리"),i("i",{staticClass:"require"},[e._v("*")])]),e._v(" "),i("b-form-radio-group",{class:{invalid:!e.valid.joinApprovalState},attrs:{options:e.code.joinApprovalStateCode,name:"joinApprovalStateCode","value-field":"code","text-field":"codeName"},on:{change:e.onSelectCase},model:{value:e.items.joinApprovalState,callback:function(t){e.$set(e.items,"joinApprovalState",t)},expression:"items.joinApprovalState"}})],2):e._e(),e._v(" "),e.isReason||!e.isEdit?i("b-form-fieldset",{attrs:{"invalid-feedback":e.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[e._v("\n          반려사유"),e.isEdit?i("i",{staticClass:"require"},[e._v("*")]):e._e()]),e._v(" "),i("b-form-textarea",{attrs:{rows:3,required:"",plaintext:!e.isEdit},model:{value:e.items.joinApprovalStateReason,callback:function(t){e.$set(e.items,"joinApprovalStateReason",t)},expression:"items.joinApprovalStateReason"}})],2):e._e()],1)],1),e._v(" "),e.isEdit?i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Approval 관리"}}},[e._v("취소")]),e._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:e.onSubmit}},[e._v("저장")])],1):i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Approval 관리"}}},[e._v("목록")])],1)],1)},o=[],a={render:s,staticRenderFns:o};t.a=a},657:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(1148),o=i(1149),a=i(15),r=a(s.a,o.a,null,null,null);t.default=r.exports}});