webpackJsonp([40],{1178:function(t,e,l){"use strict";var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var l=arguments[e];for(var a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a])}return t};e.a={name:"purge",props:["id"],data:function(){return{items:{processId:null,contentId:null,contentName:null,contentGenreName:null,contentServiceTypeCode:null,fileList:[{contentFilePath:null,contentFileName:null,contentFileSize:null}],contentTotalFileSize:null,processBeginDatetime:null,processEndDatetime:null,processStateCodeName:null},fields:{contentFilePath:{label:"File path",class:"text-left"},contentFileName:{label:"File name",class:"text-left"},contentFileSize:{label:"File size",class:"text-right"}}}},created:function(){var t=this;this.$https.get("/contentprocess/purges/"+this.id).then(function(e){t.items=a({},e.data.items)})}}},1179:function(t,e,l){"use strict";var a=function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{staticClass:"animated fadeIn"},[l("div",{staticClass:"collapse-title"},[l("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formDefault",modifiers:{formDefault:!0}}],staticClass:"btn-collapse"},[l("i",{staticClass:"fa"}),t._v("\n      기본정보\n    ")])],1),t._v(" "),l("b-collapse",{attrs:{id:"formDefault",visible:""}},[l("div",{staticClass:"formView"},[l("b-form-fieldset",{attrs:{label:"PID",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.processId,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"CID",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.contentId,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"Content",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.contentName,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"Genre",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.contentGenreName,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"File Info",horizontal:!0}},[l("b-table",{staticClass:"sub",attrs:{"show-empty":"",items:t.items.fileList,fields:t.fields},scopedSlots:t._u([{key:"contentFileSize",fn:function(e){return[t._v(t._s(e.value)+" MB")]}}])})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"Total_file_size",horizontal:!0}},[l("span",{staticClass:"form-text"},[t._v(t._s(t.items.contentTotalFileSize)+" MB")])]),t._v(" "),l("b-form-fieldset",{attrs:{label:"요청일시",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.processBeginDatetime,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"처리일시",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.processEndDatetime,type:"text",plaintext:""}})],1),t._v(" "),l("b-form-fieldset",{attrs:{label:"상태",horizontal:!0}},[l("b-form-input",{attrs:{value:t.items.processStateCodeName,type:"text",plaintext:""}})],1)],1)]),t._v(" "),l("div",{staticClass:"page-btn"},[l("b-button",{attrs:{type:"button",variant:"outline-secondary",to:{name:"Purge"}}},[t._v("목록")])],1)],1)},n=[],s={render:a,staticRenderFns:n};e.a=s},672:function(t,e,l){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=l(1178),n=l(1179),s=l(15),i=s(a.a,n.a,null,null,null);e.default=i.exports}});