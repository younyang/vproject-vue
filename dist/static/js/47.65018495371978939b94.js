webpackJsonp([47],{1152:function(t,e,i){"use strict";var s=i(181),a=i(180),o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s])}return t};e.a={name:"service",props:["id"],components:{ContentHeader:s.a,cSwitch:a.a},data:function(){return{name:"Application 상세",originItems:{},items:{createId:null,modifyId:null,operatorId:null,operatorName:null,companyName:null,deptName:null,email:null,operatorStateCode:null,operatorStateName:null,operatorState:null,deleteDateTime:null,accountLockYn:null,operatorGroupList:[],groupList:[],operatorServiceList:[],serviceList:[]},code:{groupList:[],serviceList:[]},isLoad:{groupCode:!0,serviceCode:!0},isEdit:!1,isModalHistory:!1,modal:{open:!1,type:"done",msg:"",action:function(){}},inValidForm:!1,groupSelectPlatform:!1,serviceSelectAll:!1}},computed:{serviceList:{get:function(){var t=this;return this.items.serviceList.length>0?this.items.serviceList.map(function(e){return t.code.serviceCode.find(function(t){return t.serviceId===e})}):[]},set:function(t){this.items.serviceList=t.length>0?t.map(function(t){return t.serviceId}):[]}},groupList:{get:function(){var t=this;return this.items.groupList.length>0?this.items.groupList.map(function(e){return t.code.groupList.find(function(t){return t.groupId===e})}):[]},set:function(t){this.items.groupList=t.length>0?t.map(function(t){return t.groupId}):[]}},valid:function(){return{operatorName:null!==this.items.operatorName,deptName:null!==this.items.deptName,email:null!==this.items.email,cellphoneNumber:null!==this.items.cellphoneNumber,groupList:!this.groupList.length,serviceList:!this.serviceList.length}}},created:function(){var t=this,e="/setting/management/operators/"+this.id;this.$https.get(e).then(function(e){t.items=o({},t.items,e.data.items);var i=[],s=[];t.items.operatorGroupList.forEach(function(t){i.push(t.groupId)}),t.items.operatorServiceList.forEach(function(t){s.push(t.serviceId)}),t.items.groupList=i,t.items.serviceList=s,"OPERATOR_STATE_02"===t.items.operatorStateCode?(t.items.operatorState=!0,t.items.deleteDateTime="-"):(t.items.operatorState=!1,t.items.deleteDateTime=t.items.modifyDateTime),t.originItems=JSON.parse(JSON.stringify(t.items))}),this.$https.get("/setting/operators/services").then(function(e){t.isLoad.serviceCode=!1,t.code.serviceCode=e.data.items,t.code.serviceCode.push({serviceId:0,serviceName:"전체"})}),this.$https.get("/setting/operators/groups").then(function(e){t.isLoad.groupCode=!1,t.code.groupList=e.data.items})},methods:{fetchDetail:function(t){},onEdit:function(){this.isEdit=!0},onView:function(){this.isEdit=!1,this.items=JSON.parse(JSON.stringify(this.originItems))},onSubmit:function(){var t=this,e={operatorName:this.items.operatorName,deptName:this.items.deptName,email:this.items.email,cellphoneNumber:this.items.cellphoneNumber,groupList:this.items.groupList,serviceList:this.items.serviceList},i=this.$valid.all(e);if(this.inValidForm=!i,i){0==this.items.serviceList[0]?(this.items.operatorServiceList=[],this.code.serviceCode.forEach(function(e){0==e.serviceId||t.items.operatorServiceList.push(e.serviceId)})):this.items.operatorServiceList=this.items.serviceList,this.items.operatorGroupList=this.items.groupList,this.items.operatorState?this.items.operatorStateCode="OPERATOR_STATE_02":this.items.operatorStateCode="OPERATOR_STATE_03",this.$https.put("/setting/management/operators/"+this.id,this.items).then(function(){t.$router.go(t.$router.currentRoute)}).catch(function(t){console.log(t)})}},validate:function(t){},getHistoryLink:function(t){return"#/apis/application/"+this.id+"?histories="+t},showHistory:function(){var t=this;this.isModalHistory=!this.isModalHistory,this.$https.get("/apiManagement/apps/"+this.id+"/histories").then(function(e){t.history.items=e.data.items})},serviceSelect:function(t){0==t.serviceId&&this.code.serviceCode.forEach(function(t){t.$isDisabled=!0})},serviceRemove:function(t){0==t.serviceId&&this.code.serviceCode.forEach(function(t){t.$isDisabled=!1})},groupSelect:function(t){1==t.groupId&&(this.groupSelectPlatform=!0,this.serviceList=[{serviceId:0,serviceName:"전체"}])},groupRemove:function(t){1==t.groupId&&(this.groupSelectPlatform=!1)}}}},1153:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"animated fadeIn"},[i("div",{staticClass:"collapse-title"},[i("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formDefault",modifiers:{formDefault:!0}}],staticClass:"btn-collapse"},[i("i",{staticClass:"fa"}),t._v("\n      기본정보\n    ")])],1),t._v(" "),i("b-collapse",{attrs:{id:"formDefault",visible:""}},[i("b-form",{staticClass:"formView",attrs:{validated:t.inValidForm,novalidate:""}},[i("b-form-fieldset",{attrs:{horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          ID"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:t.items.loginId,callback:function(e){t.$set(t.items,"loginId",e)},expression:"items.loginId"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          이름"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter Name",plaintext:!t.isEdit,required:""},model:{value:t.items.operatorName,callback:function(e){t.$set(t.items,"operatorName",e)},expression:"items.operatorName"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          회사명"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",plaintext:"",required:""},model:{value:t.items.companyName,callback:function(e){t.$set(t.items,"companyName",e)},expression:"items.companyName"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          부서"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter deptName",plaintext:!t.isEdit,required:""},model:{value:t.items.deptName,callback:function(e){t.$set(t.items,"deptName",e)},expression:"items.deptName"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          이메일"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter email",plaintext:!t.isEdit,required:""},model:{value:t.items.email,callback:function(e){t.$set(t.items,"email",e)},expression:"items.email"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{label:"전화번호",horizontal:!0}},[i("b-form-input",{attrs:{type:"text",placeholder:"Enter telephoneNumber",plaintext:!t.isEdit},model:{value:t.items.telephoneNumber,callback:function(e){t.$set(t.items,"telephoneNumber",e)},expression:"items.telephoneNumber"}})],1),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.require,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          휴대폰"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),i("b-form-input",{attrs:{type:"text",placeholder:"Enter cellphoneNumber",plaintext:!t.isEdit,required:""},model:{value:t.items.cellphoneNumber,callback:function(e){t.$set(t.items,"cellphoneNumber",e)},expression:"items.cellphoneNumber"}})],2),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          그룹"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),t.isEdit?i("multiselect",{staticClass:"multiple",class:{invalid:t.valid.groupList},attrs:{label:"groupName","track-by":"groupId",multiple:!0,showLabels:!1,options:t.code.groupList,loading:t.isLoad.groupCode,placeholder:"Select group"},on:{select:t.groupSelect,remove:t.groupRemove},model:{value:t.groupList,callback:function(e){t.groupList=e},expression:"groupList"}}):i("div",{staticClass:"badge-list"},t._l(t.items.operatorGroupList,function(e){return i("span",{staticClass:"badge sm"},[t._v("\n            "+t._s(e.groupName)+"\n          ")])}))],2),t._v(" "),i("b-form-fieldset",{attrs:{"invalid-feedback":t.$valid.msg.select,horizontal:!0}},[i("template",{slot:"label"},[t._v("\n          서비스"),t.isEdit?i("i",{staticClass:"require"},[t._v("*")]):t._e()]),t._v(" "),t.isEdit?i("multiselect",{staticClass:"multiple",class:{invalid:t.valid.serviceList},attrs:{label:"serviceName","track-by":"serviceId",multiple:!0,showLabels:!1,options:t.code.serviceCode,loading:t.isLoad.serviceCode,placeholder:"Select service",disabled:t.groupSelectPlatform},on:{select:t.serviceSelect,remove:t.serviceRemove},model:{value:t.serviceList,callback:function(e){t.serviceList=e},expression:"serviceList"}}):i("div",{staticClass:"badge-list"},t._l(t.items.operatorServiceList,function(e){return i("span",{staticClass:"badge sm"},[t._v("\n            "+t._s(e.serviceName)+"\n          ")])}))],2),t._v(" "),i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"상태",horizontal:!0}},[t.isEdit?i("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"정상",off:"탈퇴"},model:{value:t.items.operatorState,callback:function(e){t.$set(t.items,"operatorState",e)},expression:"items.operatorState"}}):i("span",{staticClass:"badge",class:{primary:t.items.operatorState}},[t._v(t._s(t.items.operatorState?"정상":"탈퇴")+"\n          ")])],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"계정 잠김 여부",horizontal:!0}},[t.isEdit?i("c-switch",{staticClass:"v-switch",attrs:{type:"text",on:"잠김",off:"정상"},model:{value:t.items.accountLockYn,callback:function(e){t.$set(t.items,"accountLockYn",e)},expression:"items.accountLockYn"}}):i("span",{staticClass:"badge",class:{primary:t.items.accountLockYn}},[t._v(t._s(t.items.accountLockYn?"잠김":"정상")+"\n          ")])],1)],1)],1)],1),t._v(" "),t.isEdit?t._e():i("div",{staticClass:"collapse-title"},[i("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formHistory",modifiers:{formHistory:!0}}],staticClass:"btn-collapse"},[i("i",{staticClass:"fa"}),t._v("\n      처리이력\n    ")])],1),t._v(" "),t.isEdit?t._e():i("b-collapse",{attrs:{id:"formHistory",visible:""}},[i("b-form",{staticClass:"formView"},[i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"가입신청일시",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.createDateTime,plaintext:"",type:"text"}})],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"탈퇴일시",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.deleteDateTime,plaintext:"",type:"text"}})],1)],1),t._v(" "),i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"승인일시",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.createDateTime,plaintext:"",type:"text"}})],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"승인자",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.joinApprovalId,plaintext:"",type:"text"}})],1)],1),t._v(" "),i("div",{staticClass:"form-row"},[i("b-form-fieldset",{attrs:{label:"수정일시",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.modifyDateTime,plaintext:"",type:"text"}})],1),t._v(" "),i("b-form-fieldset",{attrs:{label:"수정자",horizontal:!0}},[i("b-form-input",{attrs:{value:t.items.modifyId,plaintext:"",type:"text"}})],1)],1)])],1),t._v(" "),t.isEdit?i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary"},on:{click:t.onView}},[t._v("취소")]),t._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:t.onSubmit}},[t._v("저장")])],1):i("div",{staticClass:"page-btn"},[i("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Operator 관리"}}},[t._v("목록")]),t._v(" "),"OPERATOR_STATE_03"!==this.items.operatorStateCode?i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:t.onEdit}},[t._v("수정")]):t._e()],1)],1)},a=[],o={render:s,staticRenderFns:a};e.a=o},659:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i(1152),a=i(1153),o=i(15),r=o(s.a,a.a,null,null,null);e.default=r.exports}});