webpackJsonp([9],{448:function(e,t,i){"use strict";function n(e){i(640)}Object.defineProperty(t,"__esModule",{value:!0});var s=i(642),o=i(646),a=i(11),r=n,c=a(s.a,o.a,r,null,null);t.default=c.exports},640:function(e,t,i){var n=i(641);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);i(423)("4ca7527d",n,!0)},641:function(e,t,i){t=e.exports=i(422)(!0),t.push([e.i,".preText{display:inline-block;min-width:80px}","",{version:3,sources:["/Users/younjinkim/WebstormProjects/vueproject/src/views/policy/PopPreference.vue"],names:[],mappings:"AACA,SACE,qBAAsB,AACtB,cAAgB,CACjB",file:"PopPreference.vue",sourcesContent:["\n.preText {\n  display: inline-block;\n  min-width: 80px;\n}\n"],sourceRoot:""}])},642:function(e,t,i){"use strict";var n=i(643),s=i(140),o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};t.a={name:"pop-preference",components:{SelectBox:n.a,cSwitch:s.a},data:function(){return{fields:{popName:{label:"PoP"},targetPopId1:{label:"1 *"},targetPopId2:{label:"2 *"},targetPopId3:{label:"3 *"},targetPopId4:{label:"4 *"},targetPopId5:{label:"5 *"},popPreferenceUseYn:{label:"사용여부"},action:{label:"관리"}},items:[],originItems:[],code:{serviceId:[],popList:[],serviceTypeCode:[]},isLoad:{serviceTypeCode:!0},history:{fields:{modifyId:{label:"등록/수정자",class:"text-left"},histBeginDateTime:{label:"등록/수정일시"},preference:{label:"PoP Preference",class:"text-left"},popPreferenceUseYn:{label:"사용여부"}},items:[]},service:{},isModalHistory:!1,isEdit:!1,serviceTypeCodeVal:[]}},computed:{},created:function(){this.fetchPoP()},methods:{fetchPoP:function(){var e=this;this.$https.get("/policy/pops").then(function(t){e.code.popList=t.data.items,e.fetchService()})},fetchService:function(){var e=this;this.$https.get("/policy/services").then(function(t){e.code.serviceId=t.data.items,e.service=t.data.items[0],e.fetchPreference(t.data.items[0])})},fetchPreference:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=t.serviceId;this.service=t,this.$https.get("/policy/popPreference",{q:{serviceId:i}}).then(function(t){e.items=t.data.items.map(function(t){var i={};return Object.keys(t).forEach(function(n){if(/^targetPopId\d/.test(n)){var s=e.code.popList.find(function(e){return e.popId===parseInt(t[n])});i[n]=s?{popId:s.popId,popName:s.popName}:null}}),o({},t,i,{isEdit:!1})}),e.originItems=JSON.parse(JSON.stringify(e.items))})},onEdit:function(e){this.isEdit=!0,e.item.isEdit=!0},onView:function(e){var t=this.originItems[e.index];Object.keys(t).forEach(function(i){e.item[i]=t[i]}),e.item.isEdit=!1},onSubmit:function(e){var t=this,i={};Object.keys(e.item).forEach(function(t){/^targetPopId\d/.test(t)&&(i[t]=e.item[t]?e.item[t].popId:null)});var n=o({popId:e.item.popId,serviceId:parseInt(this.service.serviceId),popPreferenceUseYn:e.item.popPreferenceUseYn,modifyHistReason:e.item.modifyHistReason||""},i);this.$https.put("/policy/popPreference",n).then(function(){e.item.isEdit=!1,t.items[e.index]=e.item,t.originItems[e.index]=o({},e.item)}).catch(function(i){console.log(i),t.onView(e)})},onOptionSelect:function(e,t,i){var n="targetPopId"+t.split("_")[2],s=this.code.popList.find(function(t){return t.popId===parseInt(e.popId)}),o=s.popId,a=s.popName;i[n]={popId:o,popName:a}},onOptionRemove:function(e,t,i){i["targetPopId"+t.split("_")[2]]=null},isOptionSelected:function(e,t){var i=[];return Object.keys(t).forEach(function(e){if(/^targetPopId\d/.test(e)){var n=t[e]?t[e].popId:null;i.push(n)}}),!!i.length&&i.find(function(t){return t==e.popId})},showHistory:function(e){var t=this,i=e.item.popId,n=this.service.serviceId;this.isModalHistory=!this.isModalHistory,this.$https.get("/policy/popPreference/hist",{q:{serviceId:n,popId:i}}).then(function(e){t.history.items=e.data.items})}}}},643:function(e,t,i){"use strict";var n=i(644),s=i(645),o=i(11),a=o(n.a,s.a,null,null,null);t.a=a.exports},644:function(e,t,i){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function e(t){if(Array.isArray(t))return t.map(e);if(t&&"object"===(void 0===t?"undefined":n(t))){for(var i={},s=Object.keys(t),o=0,a=s.length;o<a;o++){var r=s[o];i[r]=e(t[r])}return i}return t};t.a={name:"multiselect-share",props:{id:{default:null},value:{type:Object,default:null},options:{type:Array,required:!0},placeholder:{type:String,default:"Select"},shareModel:{default:null},trackBy:{type:String},label:{type:String},isSelected:{type:Function,default:function(e,t){var i=this,n=e[this.trackBy],s=t.map(function(e){return e[i.trackBy]});return!!s.length&&s.find(function(e){return e==n})}}},data:function(){return{isOpen:!1}},methods:{onSelect:function(e){this.$emit("select",s(e),this.id,this.shareModel),this.deactivate()},onRemove:function(e){this.$emit("remove",s(e),this.id,this.shareModel),this.deactivate()},getValue:function(){return this.value?this.value[this.label]:""},getOptionLabel:function(e){return e[this.label]},isOptionSelected:function(e){var t=this.shareModel?this.shareModel:this.options;return this.isSelected(e,t)},activate:function(){this.isOpen=!0,this.$el.focus()},deactivate:function(){this.isOpen=!1,this.$el.blur()},toggle:function(){this.isOpen?this.deactivate():this.activate()},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}}}}},645:function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"multiselect pops",class:{"multiselect--active":e.isOpen},attrs:{tabindex:"0"},on:{focus:function(t){e.activate()},blur:function(t){e.deactivate()},keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27))return null;e.deactivate()}}},[e._t("caret",[i("div",{staticClass:"multiselect__select",on:{mousedown:function(t){t.preventDefault(),t.stopPropagation(),e.toggle()}}})],{toggle:e.toggle}),e._v(" "),i("div",{ref:"tags",staticClass:"multiselect__tags"},[i("div",{directives:[{name:"show",rawName:"v-show",value:null!==e.value,expression:"value !== null"}],staticClass:"multiselect__tags-wrap"},[i("span",{staticClass:"multiselect__tag"},[i("span",[e._v(e._s(e.getValue()))]),e._v(" "),i("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{mousedown:function(t){t.preventDefault(),e.onRemove(e.value)}}})])]),e._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:null===e.value,expression:"value === null"}],staticClass:"multiselect__single",on:{mousedown:function(t){t.preventDefault(),e.toggle(t)}}},[e._v("\n        "+e._s(e.placeholder)+"\n      ")])]),e._v(" "),i("transition",{attrs:{name:"multiselect"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",on:{focus:e.activate,mousedown:function(e){e.preventDefault()}}},[i("ul",{staticClass:"multiselect__content",style:e.contentStyle},e._l(e.options,function(t,n){return i("li",{key:n,staticClass:"multiselect__element"},[i("span",{staticClass:"multiselect__option",class:{"multiselect__option--selected multiselect__option--disabled":e.isOptionSelected(t)},on:{click:function(i){i.stopPropagation(),e.onSelect(t)}}},[e._t("option",[i("span",[e._v(e._s(e.getOptionLabel(t)))])],{option:t})],2)])}))])])],2)},s=[],o={render:n,staticRenderFns:s};t.a=o},646:function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"animated fadeIn"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("b-card",[i("multiselect",{staticClass:"noEmpty",attrs:{value:e.service,label:"serviceName",allowEmpty:!1,showLabels:!1,searchable:!1,options:e.code.serviceId},on:{select:e.fetchPreference}})],1),e._v(" "),i("section",{staticClass:"board"},[i("b-table",{attrs:{striped:"",bordered:"","show-empty":"",items:e.items,fields:e.fields},scopedSlots:e._u([{key:"targetPopId1",fn:function(t){return[t.item.isEdit?i("span",[i("select-box",{attrs:{label:"popName",trackBy:"popId",id:"row_"+t.index+"_1",value:t.value,options:e.code.popList,shareModel:t.item,isSelected:e.isOptionSelected},on:{select:e.onOptionSelect,remove:e.onOptionRemove}})],1):i("span",[e._v(e._s(t.value?t.value.popName:""))])]}},{key:"targetPopId2",fn:function(t){return[t.item.isEdit?i("span",[i("select-box",{attrs:{label:"popName",trackBy:"popId",id:"row_"+t.index+"_2",value:t.value,options:e.code.popList,shareModel:t.item,isSelected:e.isOptionSelected},on:{select:e.onOptionSelect,remove:e.onOptionRemove}})],1):i("span",[e._v(e._s(t.value?t.value.popName:""))])]}},{key:"targetPopId3",fn:function(t){return[t.item.isEdit?i("span",[i("select-box",{attrs:{label:"popName",trackBy:"popId",id:"row_"+t.index+"_2",value:t.value,options:e.code.popList,shareModel:t.item,isSelected:e.isOptionSelected},on:{select:e.onOptionSelect,remove:e.onOptionRemove}})],1):i("span",[e._v(e._s(t.value?t.value.popName:""))])]}},{key:"targetPopId4",fn:function(t){return[t.item.isEdit?i("span",[i("select-box",{attrs:{label:"popName",trackBy:"popId",id:"row_"+t.index+"_2",value:t.value,options:e.code.popList,shareModel:t.item,isSelected:e.isOptionSelected},on:{select:e.onOptionSelect,remove:e.onOptionRemove}})],1):i("span",[e._v(e._s(t.value?t.value.popName:""))])]}},{key:"targetPopId5",fn:function(t){return[t.item.isEdit?i("span",[i("select-box",{attrs:{label:"popName",trackBy:"popId",id:"row_"+t.index+"_2",value:t.value,options:e.code.popList,shareModel:t.item,isSelected:e.isOptionSelected},on:{select:e.onOptionSelect,remove:e.onOptionRemove}})],1):i("span",[e._v(e._s(t.value?t.value.popName:""))])]}},{key:"popPreferenceUseYn",fn:function(t){return[t.item.isEdit?i("c-switch",e._b({attrs:{type:"icon",variant:"success",pill:!0},model:{value:t.item.popPreferenceUseYn,callback:function(e){t.item.popPreferenceUseYn=e},expression:"row.item.popPreferenceUseYn"}},"c-switch",{on:"",off:""},!1)):i("b-badge",{attrs:{pill:"",variant:t.item.popPreferenceUseYn?"success":"secondary"}},[e._v("\n              "+e._s(t.item.popPreferenceUseYn?"사용":"미사용")+"\n            ")])]}},{key:"action",fn:function(t){return[t.item.isEdit?i("span",[i("b-button",{attrs:{type:"button",variant:"danger"},on:{click:function(i){e.onView(t)}}},[e._v("취소")]),e._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:function(i){e.onSubmit(t)}}},[e._v("저장")])],1):i("span",[i("b-button",{attrs:{type:"button",variant:"outline-primary"},on:{click:function(i){e.showHistory(t)}}},[e._v("이력")]),e._v(" "),i("b-button",{attrs:{type:"button",variant:"primary"},on:{click:function(i){e.onEdit(t)}}},[e._v("수정")])],1)]}}])})],1)],1)]),e._v(" "),i("b-modal",{attrs:{size:"lg",title:"이력관리"},model:{value:e.isModalHistory,callback:function(t){e.isModalHistory=t},expression:"isModalHistory"}},[i("section",{staticClass:"board"},[i("b-table",{attrs:{striped:"",bordered:"",hover:"","show-empty":"",items:e.history.items,fields:e.history.fields},scopedSlots:e._u([{key:"preference",fn:function(t){return[i("span",{staticClass:"preText"},[e._v(e._s(t.item.targetPopIdName1))]),e._v(" -\n          "),i("span",{staticClass:"preText"},[e._v(e._s(t.item.targetPopIdName2))]),e._v(" -\n          "),i("span",{staticClass:"preText"},[e._v(e._s(t.item.targetPopIdName3))]),e._v(" -\n          "),i("span",{staticClass:"preText"},[e._v(e._s(t.item.targetPopIdName4))]),e._v(" -\n          "),i("span",{staticClass:"preText"},[e._v(e._s(t.item.targetPopIdName5))])]}},{key:"popPreferenceUseYn",fn:function(t){return[e._v("\n          "+e._s(t.value?"사용":"미사용")+"\n        ")]}}])})],1),e._v(" "),i("div",{slot:"modal-footer"},[i("b-button",{attrs:{type:"button",size:"sm",variant:"primary"},on:{click:function(t){e.isModalHistory=!1}}},[i("i",{staticClass:"fa fa-dot-circle-o"}),e._v(" 확인")])],1)])],1)},s=[],o={render:n,staticRenderFns:s};t.a=o}});