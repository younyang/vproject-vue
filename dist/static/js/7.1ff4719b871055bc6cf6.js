webpackJsonp([7],{457:function(t,e,s){"use strict";function a(t){s(900)}Object.defineProperty(e,"__esModule",{value:!0});var i=s(902),o=s(903),c=s(11),n=a,r=c(i.a,o.a,n,null,null);e.default=r.exports},900:function(t,e,s){var a=s(901);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);s(420)("351eae88",a,!0)},901:function(t,e,s){e=t.exports=s(419)(!0),e.push([t.i,".detailStatus{border:1px solid #000}.detailStatus .pop{background:#ddd;border-right:1px solid #000}.statusBoxWrap{margin:0 -10px}.detailStatus .statusBoxWrap{margin:0}.statusBox{margin:10px;border:1px solid #000;padding:15px;text-align:center}.statusBox>h6{font-size:12px}.statusBox>span{font-size:11px}.processBox{margin:10px;border:1px solid #000;text-align:center;min-width:100px;background:#fff}.processBox>div{padding:15px;height:100%;cursor:pointer}","",{version:3,sources:["/Users/younjinkim/WebstormProjects/vueproject/src/views/workflow/service/Detail.vue"],names:[],mappings:"AAGA,cACE,qBAAuB,CACxB,AACD,mBACE,gBAAiB,AACjB,2BAA6B,CAC9B,AACD,eACE,cAAgB,CACjB,AACD,6BACE,QAAU,CACX,AACD,WACE,YAAa,AACb,sBAAuB,AACvB,aAAc,AACd,iBAAmB,CACpB,AACD,cACE,cAAgB,CACjB,AACD,gBACE,cAAgB,CACjB,AACD,YACE,YAAa,AACb,sBAAuB,AACvB,kBAAmB,AACnB,gBAAiB,AACjB,eAAiB,CAClB,AACD,gBACE,aAAc,AACd,YAAa,AACb,cAAgB,CACjB",file:"Detail.vue",sourcesContent:["\n.timeInfo {\n}\n.detailStatus {\n  border: 1px solid #000;\n}\n.detailStatus .pop {\n  background: #ddd;\n  border-right: 1px solid #000;\n}\n.statusBoxWrap {\n  margin: 0 -10px;\n}\n.detailStatus .statusBoxWrap {\n  margin: 0;\n}\n.statusBox {\n  margin: 10px;\n  border: 1px solid #000;\n  padding: 15px;\n  text-align: center;\n}\n.statusBox > h6 {\n  font-size: 12px;\n}\n.statusBox > span {\n  font-size: 11px;\n}\n.processBox {\n  margin: 10px;\n  border: 1px solid #000;\n  text-align: center;\n  min-width: 100px;\n  background: #fff;\n}\n.processBox > div {\n  padding: 15px;\n  height: 100%;\n  cursor: pointer;\n}\n"],sourceRoot:""}])},902:function(t,e,s){"use strict";var a=s(139),i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=s[a])}return t};e.a={name:"serviceProcessing",props:["id"],components:{cSwitch:a.a},data:function(){return{name:"Service Processing 상세",originItems:{},items:{processId:null,taskIds:null,processSectionCodeName:null,processStateCodeName:null,processBeginDatetime:null,processEndDatetime:null,processTaskList:[{interlockTargetCode:"",interlockTargetCodeName:""}]},taskList:[],activeItems:{processTask:{},taskActivityList:[],edgeDetailList:null,edgeSummaryList:null,searchConditionServiceList:null,searchConditionServiceTypeList:null},summaryFields:{},summaryItems:[],summaryActiveItems:{},detailItems:[{popId:null,popName:null,popTotalQty:null,popEndQty:null,activityEdgePopList:[]}],searchItem:{serviceId:null,serviceTypeCode:null,taskActivityStateCode:null},taskName:null,isEdgeSummary:!1,edgeTabIndex:0,code:{taskStateCode:[],serviceId:[],serviceTypeCode:[]},queryParams:{},isLoad:{taskStateCode:!1},isEdit:!1}},computed:{serviceId:{get:function(){var t=this;return this.code.serviceId.find(function(e){return e.serviceId===t.searchItem.serviceId})||null},set:function(t){this.searchItem.serviceId=null!==t?t.serviceId:null}},serviceTypeCode:{get:function(){var t=this;return this.code.serviceTypeCode.find(function(e){return e.serviceTypeCode===t.searchItem.serviceTypeCode})||null},set:function(t){this.searchItem.serviceTypeCode=null!==t?t.serviceTypeCode:null}}},created:function(){var t=this;this.$https.get("/system/commonCode",{q:{groupCode:"TASK_ACTIVE_STATE"}}).then(function(e){t.isLoad.taskStateCode=!1,t.code.taskStateCode=e.data.items}),this.$https.get("/serviceprocess/"+this.id).then(function(e){t.items=i({},t.items,e.data.items),t.items.processTaskList=t.items.processTaskList.map(function(e){return i({},e,{taskStateCode:t.code.taskStateCode.find(function(t){return t.code===e.taskStateCode})||null})}),t.taskList=t.items.taskIds.split(","),t.activeStep(0)})},methods:{activeStep:function(t){this.fetchActivity(this.taskList[t])},fetchActivity:function(t){var e=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.queryParams=i({},this.queryParams,s),this.$https.get("/serviceprocess/"+this.id+"/tasks/"+t+"/activities",this.queryParams).then(function(t){e.activeItems=t.data.items,e.activeItems.taskActivityList=null!==e.activeItems.taskActivityList?e.activeItems.taskActivityList:[],e.setActiveItems()})},fetchEdge:function(t){var e=0===this.edgeTabIndex?"SUMMARY":"DETAIL";this.fetchActivity(t,{taskActivityViewType:e})},setActiveItems:function(){this.setTaskName(this.activeItems.processTask.interlockTargetCode),this.isEdgeSummary=null!==this.activeItems.edgeSummaryList||null!==this.activeItems.edgeDetailList,null!==this.activeItems.edgeSummaryList?this.setSummary():null!==this.activeItems.edgeDetailList&&this.setDetail()},setTaskName:function(t){this.taskName="INTERLOCK_TARGET_01"===t?"D":"INTERLOCK_TARGET_02"===t?"HR":"INTERLOCK_TARGET_03"===t?"LR":"INTERLOCK_TARGET_04"===t?"E":null},setSummary:function(){var t=this.activeItems.edgeSummaryList[0],e=t.activityEdgeServiceTypeList||[],s={};e.forEach(function(t,e){s["typeCode_"+e]=t.serviceTypeCodeName}),this.summaryFields=i({serviceName:{label:"Service"}},s,{serviceTotalQty:{label:"Total"},serviceStateCodeName:{label:"상태"}}),this.summaryItems=this.activeItems.edgeSummaryList.map(function(t){return t.activityEdgeServiceTypeList.forEach(function(e,s){t["typeCode_"+s]='<a class="typeData" data-service="'+t.serviceId+'" data-type="'+e.serviceTypeCode+'">'+e.successQty+"/"+e.totalQty+"</a>"}),i({},t)})},setDetail:function(){this.detailItems=this.activeItems.edgeDetailList,0===this.code.serviceId.length&&(this.code.serviceId=this.activeItems.searchConditionServiceList),0===this.code.serviceTypeCode.length&&(this.code.serviceTypeCode=this.activeItems.searchConditionServiceTypeList)},onClickProcess:function(t,e){"INTERLOCK_TARGET_01"===t&&this.$router.push({name:"Domain Processing 관리"}),this.setTaskName(t),this.queryParams={},this.activeStep(e)},onChangeService:function(t){this.searchItem.serviceId=null!==t?t.serviceId:null},onChangeServiceType:function(t){this.searchItem.serviceTypeCode=null!==t?t.serviceTypeCode:null},onChangeStatus:function(t,e){if(this.searchItem.taskActivityStateCode=null!==t?t.code:null,!this.isEdgeSummary){var s=e.split("taskSelect_")[1],a=null!==t?{taskActivityStateCode:t.code}:{};this.fetchActivity(s,a)}},statusClass:function(t){var e="string"==typeof t?t.split("STATE_")[1]:"";return"01"===e?"":"02"===e?"bg-primary":"03"===e?"bg-success":"03"===e?"bg-danger":"bg-secondary"}}}},903:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"animated fadeIn"},[s("div",{staticClass:"collapse-title"},[s("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.formDefault",modifiers:{formDefault:!0}}],attrs:{variant:"secondary",block:!0}},[t._v("\n      기본정보\n      "),s("i",{staticClass:"fa fa-angle-down"})])],1),t._v(" "),s("b-collapse",{attrs:{id:"formDefault",visible:""}},[s("b-card",[s("b-form-fieldset",{attrs:{label:"PID","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.id,type:"text",plaintext:""}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"TID","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.taskIds,type:"text",plaintext:""}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"Process","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.processSectionCodeName,type:"text",plaintext:""}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"상태","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.processStateCodeName,type:"text",plaintext:""}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"시작","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.processBeginDatetime,type:"text",plaintext:""}})],1),t._v(" "),s("b-form-fieldset",{attrs:{label:"종료","label-cols":3,horizontal:!0}},[s("b-form-input",{attrs:{value:t.items.processEndDatetime,type:"text",plaintext:""}})],1)],1)],1),t._v(" "),s("div",{staticClass:"collapse-title"},[s("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.detail",modifiers:{detail:!0}}],attrs:{variant:"secondary",block:!0}},[t._v("\n      상세\n      "),s("i",{staticClass:"fa fa-angle-down"})])],1),t._v(" "),s("b-collapse",{attrs:{id:"detail",visible:""}},[s("b-card",[s("div",{staticClass:"d-flex justify-content-center"},t._l(t.items.processTaskList,function(e,a){return s("div",{staticClass:"processBox",on:{click:function(s){t.onClickProcess(e.interlockTargetCode,a)}}},[s("div",{class:t.statusClass(e.taskStateCode)},[s("h5",[t._v(t._s(e.interlockTargetCodeName))]),t._v(" "),"TASK_STATE_02"===t.items.taskStateCode?s("i",{staticClass:"fa fa-cog fa-spin"}):t._e(),t._v(" "),"DNS"!==e.interlockTargetCodeName?s("div",{staticClass:"activeCount"},[s("span",[t._v(t._s(e.interlockSuccessQty))]),t._v(" /\n              "),s("span",[t._v(t._s(e.interlockTotalQty))])]):t._e()])])}))]),t._v(" "),s("b-card",[s("div",{slot:"header"},[s("i",{staticClass:"fa fa-angle-right"}),t._v(" "+t._s(t.activeItems.processTask.interlockTargetCodeName)+"\n      ")]),t._v(" "),s("div",{staticClass:"timeInfo"},[s("span",[t._v("시작: "+t._s(t.activeItems.processTask.taskBeginDatetime))]),t._v(" /\n        "),s("span",{staticClass:"ml-2"},[t._v("종료: "+t._s(t.activeItems.processTask.taskEndDatetime))])]),t._v(" "),"E"===t.taskName?s("div",{staticClass:"searchInfo"},[t.isEdgeSummary?s("b-tabs",{on:{input:function(e){t.fetchEdge(t.activeItems.processTask.taskId)}},model:{value:t.edgeTabIndex,callback:function(e){t.edgeTabIndex=e},expression:"edgeTabIndex"}},[s("b-tab",{attrs:{title:"summary",active:""}},[s("section",{staticClass:"board"},[s("b-table",{attrs:{striped:"",bordered:"",hover:"","show-empty":"",items:t.summaryItems,fields:t.summaryFields}})],1)]),t._v(" "),s("b-tab",{attrs:{title:"detail"}},[s("div",{staticClass:"row searchBox"},[s("div",{staticClass:"col-3"},[s("b-form-fieldset",{attrs:{label:"Service","label-cols":5,horizontal:!0}},[s("multiselect",{staticClass:"sm",attrs:{id:"taskSelect_"+t.activeItems.processTask.taskId,showLabels:!1,searchable:!1,options:t.code.serviceId,label:"serviceName","track-by":"serviceId",placeholder:"전체"},on:{input:t.onChangeService},model:{value:t.serviceId,callback:function(e){t.serviceId=e},expression:"serviceId"}})],1)],1),t._v(" "),s("div",{staticClass:"col-3"},[s("b-form-fieldset",{attrs:{label:"Service Type","label-cols":7,horizontal:!0}},[s("multiselect",{staticClass:"inline sm",attrs:{id:"taskSelect_"+t.activeItems.processTask.taskId,showLabels:!1,searchable:!1,options:t.code.serviceTypeCode,label:"serviceTypeCodeName","track-by":"serviceTypeCode",placeholder:"전체"},on:{input:t.onChangeServiceType},model:{value:t.serviceTypeCode,callback:function(e){t.serviceTypeCode=e},expression:"serviceTypeCode"}})],1)],1),t._v(" "),s("div",{staticClass:"col-3"},[s("b-form-fieldset",{attrs:{label:"상태","label-cols":3,horizontal:!0}},[s("multiselect",{staticClass:"inline sm",attrs:{id:"taskSelect_"+t.activeItems.processTask.taskId,showLabels:!1,searchable:!1,options:t.code.taskStateCode,loading:t.isLoad.taskStateCode,label:"codeName","track-by":"code",placeholder:"전체"},on:{input:t.onChangeStatus}})],1)],1),t._v(" "),s("div",{staticClass:"col-3"},[s("b-button",{attrs:{type:"button",size:"sm",variant:"outline-secondary"},on:{click:function(e){t.fetchActivity(t.activeItems.processTask.taskId,t.searchItem)}}},[t._v("검색")])],1)]),t._v(" "),t._l(t.detailItems,function(e,a){return s("div",{staticClass:"detailStatus d-flex"},[s("div",{staticClass:"pop"},[s("h6",[t._v(t._s(e.popName))]),t._v(" "),s("strong",[t._v(t._s(e.popEndQty))]),t._v(" /\n                "),s("span",[t._v(t._s(e.popTotalQty))])]),t._v(" "),s("div",{staticClass:"statusBoxWrap d-flex flex-wrap"},t._l(e.activityEdgePopList,function(e,a){return s("div",{staticClass:"statusBox",class:t.statusClass(e.taskActivityStateCode)},[s("h6",[t._v(t._s(e.hostName))])])}))])})],2)],1):t._e()],1):t._e(),t._v(" "),"HR"===t.taskName||"LR"===t.taskName?s("div",[s("div",{staticClass:"searchInfo"},[s("div",{staticClass:"row searchBox"},[s("div",{staticClass:"col-3"},[s("b-form-fieldset",{attrs:{label:"상태","label-cols":3,horizontal:!0}},[s("multiselect",{staticClass:"inline sm",attrs:{id:"taskSelect_"+t.activeItems.processTask.taskId,showLabels:!1,searchable:!1,options:t.code.taskStateCode,label:"codeName","track-by":"code",placeholder:"전체"},on:{input:t.onChangeStatus}})],1)],1),t._v(" "),s("div",{staticClass:"col-3"},[s("b-button",{attrs:{type:"button",size:"sm",variant:"outline-secondary"},on:{click:function(e){t.fetchActivity(t.activeItems.processTask.taskId,{taskActivityStateCode:t.searchItem.taskActivityStateCode})}}},[t._v("검색")])],1)])]),t._v(" "),s("div",{staticClass:"statusBoxWrap d-flex flex-wrap"},t._l(t.activeItems.taskActivityList,function(e,a){return s("div",{staticClass:"statusBox",class:t.statusClass(e.taskActivityStateCode)},[s("h6",[t._v(t._s(e.popName))]),t._v(" "),s("span",[t._v(t._s(e.hostName))])])}))]):t._e()])],1),t._v(" "),s("div",{staticClass:"page-btn"},[s("b-button",{attrs:{type:"button",size:"sm",variant:"secondary",to:{name:"Service Processing 관리"}}},[s("i",{staticClass:"fa fa-list"}),t._v(" 목록")])],1)],1)},i=[],o={render:a,staticRenderFns:i};e.a=o}});