webpackJsonp([58],{596:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s(787),r=s(788),i=s(15),o=i(a.a,r.a,null,null,null);e.default=o.exports},787:function(t,e,s){"use strict";var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=s[a])}return t};e.a={name:"userInfo",data:function(){return{items:{loginId:null,operatorName:null,companyName:null,deptName:null,email:null,cellphoneNumber:"",telephoneNumber:"",operatorGroupList:[],operatorServiceList:[]},password:"",passwordCheck:"",isChangePassword:!1,inValidForm:!1,isModalAlert:!1}},computed:{valid:function(){var t=/^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{9,16}$/;return{password:this.password.length>0&&t.test(this.password),passwordCheck:this.passwordCheck.length>0&&this.password===this.passwordCheck}},feedback:function(){var t=/^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{9,16}$/;return{password:this.password.length&&!t.test(this.password)?"비밀번호는 9~16자로 영문+숫자+특수문자가 포함되어야 합니다.":0===this.password.length?this.$valid.msg.require:"",passwordCheck:this.passwordCheck.length&&this.password!==this.passwordCheck?this.$valid.msg.passwordCheck:0===this.passwordCheck.length?this.$valid.msg.require:""}}},created:function(){var t=this;this.$https.get("/setting/operators/main").then(function(e){console.log(e.data.items),t.items=e.data.items})},methods:{onSubmit:function(){var t=this,e=this.items,s=e.operatorName,r=e.deptName,i=e.email,o=e.telephoneNumber,l=e.cellphoneNumber,n={operatorName:s,deptName:r,email:i,cellphoneNumber:l};this.isChangePassword&&(n=a({},n,{password:this.password}));var d=this.$valid.all(n);this.inValidForm=!d,d&&this.$https.put("/setting/operators/main",a({},n,{telephoneNumber:o})).then(function(){t.isModalAlert=!t.isModalAlert}).catch(function(t){console.log(t)})}}}},788:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"animated fadeIn"},[s("b-form",{staticClass:"formView",attrs:{validated:t.inValidForm,novalidate:""}},[s("b-form-fieldset",{attrs:{label:"ID",horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.loginId,plaintext:"",type:"text"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"비밀번호",horizontal:!0}},[s("b-button",{attrs:{type:"button",variant:"in-table"},on:{click:function(e){t.isChangePassword=!t.isChangePassword}}},[t._v(t._s(t.isChangePassword?"변경 취소":"변경"))])],1),t._v(" "),t.isChangePassword?s("div",[s("b-form-fieldset",{attrs:{description:"※ 9~16자 이내  영문자+숫자+특수문자 조합 필수","invalid-feedback":t.feedback.password,horizontal:!0}},[s("template",{slot:"label"},[t._v("\n          변경 비밀번호"),s("i",{staticClass:"require"},[t._v("*")])]),t._v(" "),s("b-form-input",{attrs:{type:"password",state:t.valid.password,required:""},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],2),t._v(" "),s("b-form-fieldset",{attrs:{"invalid-feedback":t.feedback.passwordCheck,horizontal:!0}},[s("template",{slot:"label"},[t._v("\n          변경 비밀번호 확인"),s("i",{staticClass:"require"},[t._v("*")])]),t._v(" "),s("b-form-input",{attrs:{type:"password",state:t.valid.passwordCheck,required:""},model:{value:t.passwordCheck,callback:function(e){t.passwordCheck=e},expression:"passwordCheck"}})],2)],1):t._e(),t._v(" "),s("b-form-fieldset",{attrs:{label:"회사명",horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.companyName,plaintext:"",type:"text"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"부서<i class='require'>*</i>","invalid-feedback":t.$valid.msg.require,horizontal:!0}},[s("b-form-input",{attrs:{type:"text",required:""},model:{value:t.items.deptName,callback:function(e){t.$set(t.items,"deptName",e)},expression:"items.deptName"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"이메일<i class='require'>*</i>","invalid-feedback":t.$valid.msg.require,horizontal:!0}},[s("b-form-input",{attrs:{type:"text",required:""},model:{value:t.items.email,callback:function(e){t.$set(t.items,"email",e)},expression:"items.email"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"전화번호",horizontal:!0}},[s("b-form-input",{attrs:{type:"text"},model:{value:t.items.telephoneNumber,callback:function(e){t.$set(t.items,"telephoneNumber",e)},expression:"items.telephoneNumber"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"휴대폰<i class='require'>*</i>","invalid-feedback":t.$valid.msg.require,horizontal:!0}},[s("b-form-input",{attrs:{type:"text",required:""},model:{value:t.items.cellphoneNumber,callback:function(e){t.$set(t.items,"cellphoneNumber",e)},expression:"items.cellphoneNumber"}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"그룹",horizontal:!0}},[t.items.operatorGroupList.length?s("div",{staticClass:"badge-list"},t._l(t.items.operatorGroupList,function(e){return s("span",{staticClass:"badge sm"},[t._v("\n          "+t._s(e.groupName)+"\n        ")])})):s("span",{staticClass:"form-text-alone"},[t._v("--")])]),t._v(" "),s("b-form-fieldset",{attrs:{label:"서비스",horizontal:!0}},[t.items.operatorServiceList.length?s("div",{staticClass:"badge-list"},t._l(t.items.operatorServiceList,function(e){return s("span",{staticClass:"badge sm"},[t._v("\n          "+t._s(e.serviceName)+"\n        ")])})):s("span",{staticClass:"form-text-alone"},[t._v("--")])])],1),t._v(" "),s("div",{staticClass:"page-btn"},[s("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Dashboard"}}},[t._v("취소")]),t._v(" "),s("b-button",{attrs:{type:"button",variant:"primary"},on:{click:t.onSubmit}},[t._v("저장")])],1),t._v(" "),s("b-modal",{staticClass:"modal-done",attrs:{title:"Message",size:"sm"},model:{value:t.isModalAlert,callback:function(e){t.isModalAlert=e},expression:"isModalAlert"}},[s("div",{staticClass:"d-block text-center"},[s("p",[t._v("회원 정보 수정이 완료되었습니다.")])]),t._v(" "),s("div",{staticClass:"mx-auto",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("b-button",{attrs:{type:"button",variant:"primary",to:{name:"Dashboard"}}},[t._v("확인")])],1)])],1)},r=[],i={render:a,staticRenderFns:r};e.a=i}});