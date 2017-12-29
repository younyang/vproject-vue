<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        기본정보
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <!-- PID -->
        <b-form-fieldset
          label="PID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- TID -->
        <b-form-fieldset
          label="TID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.taskIds"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Process -->
        <b-form-fieldset
          label="Process"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processSectionCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          label="상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processStateCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 시작 -->
        <b-form-fieldset
          label="시작"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processBeginDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 종료 -->
        <b-form-fieldset
          label="종료"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processEndDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <!-- 상세 -->
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.detail
        :block="true">
        상세
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="detail" visible>

      <b-card>
        <div class="d-flex justify-content-center">
          <!-- Process Box Block -->
          <div
            class="processBox"
            v-for="(item, index) in items.processTaskList"
            @click="onClickProcess(item.interlockTargetCode, index)"
          >
            <div :class="statusClass(item.taskStateCode)">
              <!-- Title -->
              <h5>{{ item.interlockTargetCodeName }}</h5>

              <!-- progress icon -->
              <i v-if="items.taskStateCode === 'TASK_STATE_02'" class="fa fa-cog fa-spin"></i>

              <!-- Activity Count -->
              <div class="activeCount" v-if="item.interlockTargetCodeName !== 'DNS'">
                <span>{{ item.interlockSuccessQty }}</span> /
                <span>{{ item.interlockTotalQty }}</span>
              </div>
            </div>
          </div>
        </div>
      </b-card>


      <b-card>
        <div slot="header">
          <i class='fa fa-angle-right'></i> {{ activeItems.processTask.interlockTargetCodeName }}
        </div>
        <div class="timeInfo">
          <span>시작: {{ activeItems.processTask.taskBeginDatetime }}</span> /
          <span class="ml-2">종료: {{ activeItems.processTask.taskEndDatetime }}</span>
        </div>

        <div class="searchInfo" v-if="taskName === 'E'">
          <b-tabs
            v-model="edgeTabIndex"
            v-if="isEdgeSummary"
            @input="fetchEdge(activeItems.processTask.taskId)"
          >
            <b-tab title="summary" active>
              <section class="board">
                <b-table
                  striped
                  bordered
                  hover
                  show-empty
                  :items="summaryItems"
                  :fields="summaryFields"
                >
                </b-table>
              </section>
            </b-tab>
            <b-tab title="detail">
              <div class="row searchBox">
                <div class="col-3">
                  <b-form-fieldset
                    label="Service"
                    :label-cols="5"
                    :horizontal="true">
                    <multiselect
                      v-model="serviceId"
                      :id="`taskSelect_${activeItems.processTask.taskId}`"
                      :showLabels="false"
                      :searchable="false"
                      :options="code.serviceId"
                      class="sm"
                      label="serviceName"
                      track-by="serviceId"
                      placeholder="전체"
                      @input="onChangeService"
                    ></multiselect>
                  </b-form-fieldset>
                </div>
                <div class="col-3">
                  <b-form-fieldset
                    label="Service Type"
                    :label-cols="7"
                    :horizontal="true">
                    <multiselect
                      v-model="serviceTypeCode"
                      :id="`taskSelect_${activeItems.processTask.taskId}`"
                      :showLabels="false"
                      :searchable="false"
                      :options="code.serviceTypeCode"
                      class="inline sm"
                      label="serviceTypeCodeName"
                      track-by="serviceTypeCode"
                      placeholder="전체"
                      @input="onChangeServiceType"
                    ></multiselect>
                  </b-form-fieldset>
                </div>
                <div class="col-3">
                  <b-form-fieldset
                    label="상태"
                    :label-cols="3"
                    :horizontal="true">
                    <multiselect
                      :id="`taskSelect_${activeItems.processTask.taskId}`"
                      :showLabels="false"
                      :searchable="false"
                      :options="code.taskStateCode"
                      :loading="isLoad.taskStateCode"
                      class="inline sm"
                      label="codeName"
                      track-by="code"
                      placeholder="전체"
                      @input="onChangeStatus"
                    ></multiselect>
                  </b-form-fieldset>
                </div>
                <div class="col-3">
                  <b-button
                    type="button"
                    size="sm"
                    variant="outline-secondary"
                    @click="fetchActivity(activeItems.processTask.taskId, searchItem)"
                  >검색</b-button>
                </div>
              </div>

              <div class="detailStatus d-flex" v-for="(detail, i) in detailItems">
                <div class="pop">
                  <h6>{{ detail.popName }}</h6>
                  <strong>{{ detail.popEndQty }}</strong> /
                  <span>{{ detail.popTotalQty }}</span>
                </div>
                <div class="statusBoxWrap d-flex flex-wrap">
                  <div
                    class="statusBox"
                    :class="statusClass(status.taskActivityStateCode)"
                    v-for="(status, i) in detail.activityEdgePopList"
                  >
                    <h6>{{ status.hostName }}</h6>
                  </div>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>

        <div v-if="taskName === 'HR' || taskName === 'LR'">
          <div class="searchInfo">
            <div class="row searchBox">
              <div class="col-3">
                <b-form-fieldset
                  label="상태"
                  :label-cols="3"
                  :horizontal="true">
                  <multiselect
                    :id="`taskSelect_${activeItems.processTask.taskId}`"
                    :showLabels="false"
                    :searchable="false"
                    :options="code.taskStateCode"
                    class="inline sm"
                    label="codeName"
                    track-by="code"
                    placeholder="전체"
                    @input="onChangeStatus"
                  ></multiselect>
                </b-form-fieldset>
              </div>
              <div class="col-3">
                <b-button
                  type="button"
                  size="sm"
                  variant="outline-secondary"
                  @click="fetchActivity(activeItems.processTask.taskId, { taskActivityStateCode: searchItem.taskActivityStateCode })"
                >검색</b-button>
              </div>
            </div>
          </div>

          <div class="statusBoxWrap d-flex flex-wrap">
            <div
              class="statusBox"
              :class="statusClass(active.taskActivityStateCode)"
              v-for="(active, i) in activeItems.taskActivityList"
            >
              <h6>{{ active.popName }}</h6>
              <span>{{ active.hostName }}</span>
            </div>
          </div>
        </div>
      </b-card>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service Processing 관리' }"><i class="fa fa-list"></i> 목록</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'serviceProcessing',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Service Processing 상세',
        originItems: {},
        items: {
          processId: null,
          taskIds: null,
          processSectionCodeName: null,
          processStateCodeName: null,
          processBeginDatetime: null,
          processEndDatetime: null,
          processTaskList: [{
            interlockTargetCode: "",
            interlockTargetCodeName: "",
          }]
        },
        taskList: [],
        activeItems: {
          processTask: {},
          taskActivityList: [],
          edgeDetailList: null,
          edgeSummaryList: null,
          searchConditionServiceList: null,
          searchConditionServiceTypeList: null
        },
        summaryFields: {},
        summaryItems: [],
        summaryActiveItems: {},

        detailItems: [{
          popId: null,
          popName: null,
          popTotalQty: null,
          popEndQty: null,
          activityEdgePopList: []
        }],

        searchItem: {
          serviceId: null,
          serviceTypeCode: null,
          taskActivityStateCode: null
        },

        taskName: null,
        isEdgeSummary: false,

        edgeTabIndex: 0,

        code: {
          taskStateCode: [],
          serviceId: [],
          serviceTypeCode: [],
        },

        queryParams: {},
        isLoad: {
          taskStateCode: false
        },
        isEdit: false
      }
    },

    computed: {
      serviceId: {
        get () {
          return this.code.serviceId.find(obj => obj.serviceId === this.searchItem.serviceId) || null;
        },
        set (newValue) {
          this.searchItem.serviceId = newValue !== null ? newValue.serviceId : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.code.serviceTypeCode.find(obj => obj.serviceTypeCode === this.searchItem.serviceTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.serviceTypeCode = newValue !== null ? newValue.serviceTypeCode : null;
        }
      }
    },

    created (){
      // State Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'TASK_ACTIVE_STATE' }
        })
        .then((res) => {
          this.isLoad.taskStateCode = false;
          this.code.taskStateCode = res.data.items;
        });

      // Detail Data
      this.$https.get(`/serviceprocess/${this.id}`)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.items.processTaskList = this.items.processTaskList.map(obj => ({
            ...obj,
            taskStateCode: this.code.taskStateCode.find(({ code }) => code === obj.taskStateCode) || null
          }));

          this.taskList = this.items.taskIds.split(',');
          this.activeStep(0);
        });


    },

    methods: {
      activeStep (num) {
        this.fetchActivity(this.taskList[num])
      },

      fetchActivity (taskId, params = {}){
        this.queryParams = { ...this.queryParams, ...params };

        this.$https.get(`/serviceprocess/${this.id}/tasks/${taskId}/activities`, this.queryParams)
          .then((res) => {
            this.activeItems = res.data.items;
            this.activeItems.taskActivityList = this.activeItems.taskActivityList !== null ?
              this.activeItems.taskActivityList : []
            this.setActiveItems();
          });
      },

      fetchEdge (taskId){
        const viewType = this.edgeTabIndex === 0 ? 'SUMMARY' : 'DETAIL';
        this.fetchActivity(taskId, {taskActivityViewType: viewType})
      },

      setActiveItems (){
        // Task Name
        this.setTaskName(this.activeItems.processTask.interlockTargetCode)

        // Edge Summary
        this.isEdgeSummary = this.activeItems.edgeSummaryList !== null || this.activeItems.edgeDetailList !== null;

        if (this.activeItems.edgeSummaryList !== null){
          this.setSummary();
        } else if (this.activeItems.edgeDetailList !== null){
          this.setDetail();
        }
      },

      setTaskName (taskName){
        this.taskName = taskName === 'INTERLOCK_TARGET_01' ? 'D'
          : taskName === 'INTERLOCK_TARGET_02' ? 'HR'
          : taskName === 'INTERLOCK_TARGET_03' ? 'LR'
          : taskName === 'INTERLOCK_TARGET_04' ? 'E' : null;
      },

      setSummary (){
        const list = this.activeItems.edgeSummaryList[0];
        const typelist = list.activityEdgeServiceTypeList || [];
        const typefields = {};

        typelist.forEach((obj, i) => {
          typefields[`typeCode_${i}`] = obj.serviceTypeCodeName;
        });

        this.summaryFields = {
          serviceName: {label: 'Service'},
          ...typefields,
          serviceTotalQty: {label: 'Total'},
          serviceStateCodeName: {label: '상태'}
        };

        this.summaryItems = this.activeItems.edgeSummaryList.map(item => {
          item.activityEdgeServiceTypeList.forEach((obj, i) => {
            item[`typeCode_${i}`] = `<a class="typeData" data-service="${item.serviceId}" data-type="${obj.serviceTypeCode}">${obj.successQty}/${obj.totalQty}</a>`;
          });
          return { ...item }
        });
      },

      setDetail (){
        this.detailItems = this.activeItems.edgeDetailList;

        if (this.code.serviceId.length === 0){
          this.code.serviceId = this.activeItems.searchConditionServiceList;
        }
        if (this.code.serviceTypeCode.length === 0){
          this.code.serviceTypeCode = this.activeItems.searchConditionServiceTypeList;
        }
      },

      onClickProcess (task, index){
        if (task === 'INTERLOCK_TARGET_01'){
            this.$router.push({ name: 'Domain Processing 관리'})
        }
        this.setTaskName(task);
        this.queryParams = {};
        this.activeStep(index);

      },

      onChangeService (obj){
        this.searchItem.serviceId = obj !== null ? obj.serviceId : null;
      },

      onChangeServiceType (obj){
        this.searchItem.serviceTypeCode = obj !== null ? obj.serviceTypeCode : null;
      },

      onChangeStatus (obj, id){
        this.searchItem.taskActivityStateCode = obj !== null ? obj.code : null;
        if (!this.isEdgeSummary) {
          const taskId = id.split('taskSelect_')[1];
          const codeObj = obj !== null ? { taskActivityStateCode: obj.code } : {};
          this.fetchActivity(taskId, codeObj);
        }
      },

      statusClass (code) {
        const codeSplit = typeof code === 'string' ? code.split('STATE_')[1] : '';
        return codeSplit === '01' ? ''
          : codeSplit === '02' ? 'bg-primary'
          : codeSplit === '03' ? 'bg-success'
          : codeSplit === '03' ? 'bg-danger'
          : 'bg-secondary';
      }
    }
  }
</script>

<style>
  .timeInfo {

  }
  .searchBox {
    padding: 5px 0;
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }
  .detailStatus {
    border: 1px solid #000;
  }
  .detailStatus .pop {
    background: #ddd;
    border-right: 1px solid #000;
  }
  .statusBoxWrap {
    margin: 0 -10px;
  }
  .detailStatus .statusBoxWrap {
    margin: 0;
  }
  .statusBox {
    margin: 10px;
    border: 1px solid #000;
    padding: 15px;
    text-align: center;
  }
  .statusBox > h6 {
    font-size: 12px;
  }
  .statusBox > span {
    font-size: 11px;
  }
  .processBox {
    margin: 10px;
    border: 1px solid #000;
    text-align: center;
    min-width: 100px;
    background: #fff;
  }
  .processBox > div {
    padding: 15px;
    height: 100%;
    cursor: pointer;
  }
</style>
