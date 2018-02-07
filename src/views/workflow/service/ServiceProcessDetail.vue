<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <div class="formView">
        <!-- PID -->
        <b-form-fieldset
          label="PID"
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
          :horizontal="true">
          <b-form-input
            :value="items.processStateCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 시작 -->
        <b-form-fieldset
          label="시작일시"
          :horizontal="true">
          <b-form-input
            :value="items.processBeginDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 종료 -->
        <b-form-fieldset
          label="종료일시"
          :horizontal="true">
          <b-form-input
            :value="items.processEndDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </div>
    </b-collapse>

    <!-- 상세 -->
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.detail>
        <i class="fa"></i>
        상세
      </b-button>
    </div>
    <b-collapse id="detail" visible>
      <b-card class="dashed mb-0">

        <!-- Process -->
        <div class="process-group">
          <div
            class="process-box"
            v-for="(item, index) in items.processTaskList"
            @click="onClickProcess(item.interlockTargetCode, index)"
          >
            <div :class="statusClass(item.taskStateCode)">
              <!-- Title -->
              <h5>{{ item.interlockTargetCodeName }}</h5>
              <!-- progress icon -->
              <i class="fa" :class="statusClass(item.taskStateCode)"></i>
              <!-- Activity Count -->
              <div class="activeCount" v-if="item.interlockTargetCodeName !== 'DNS'">
                <span class="success">{{ item.interlockSuccessQty }}</span> /
                <span>{{ item.interlockTotalQty }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="process-content">
          <h3 class="content-title"><i class="fa fa-circle"></i> {{ activeItems.processTask.interlockTargetCodeName }}</h3>

          <div class="timeInfo">
            <span class="mr-2"><strong>시작</strong>: {{ activeItems.processTask.taskBeginDatetime }}</span> /
            <span class="ml-2"><strong>종료</strong>: {{ activeItems.processTask.taskEndDatetime }}</span>
            <b-button
              v-if="activeItems.processTask.taskStateCode === 'TASK_STATE_04'"
              variant="primary"
              @click="onTaskReset(activeItems.processTask.taskId)"
              class="ml-2">재실행</b-button>
          </div>

          <!-- Task -->
          <div class="searchInfo">
            <!-- Edge(Summary) -->
            <b-tabs
              pills
              v-model="edgeTabIndex"
              v-if="taskName === 'E' && isEdgeSummary"
              @input="fetchEdge(activeItems.processTask.taskId)"
            >
              <!-- Edge(Summary) > List -->
              <b-tab title="Summary" active>
                <section class="board">
                  <b-table
                    show-empty
                    :items="summaryItems"
                    :fields="summaryFields"
                  >
                  </b-table>
                </section>
              </b-tab>

              <!-- Edge(Summary) > Detail -->
              <b-tab title="Detail">
                <b-form class="searchBox" inline>
                  <label>Service</label>
                  <multiselect
                    v-model="serviceId"
                    :id="`taskSelect_${activeItems.processTask.taskId}`"
                    :showLabels="false"
                    :searchable="false"
                    :options="code.serviceId"
                    class="inline"
                    label="serviceName"
                    track-by="serviceId"
                    placeholder="전체"
                  ></multiselect>

                  <label>Service Type</label>
                  <multiselect
                    v-model="serviceTypeCode"
                    :id="`taskSelect_${activeItems.processTask.taskId}`"
                    :showLabels="false"
                    :searchable="false"
                    :options="code.serviceTypeCode"
                    class="inline"
                    label="serviceTypeCodeName"
                    track-by="serviceTypeCode"
                    placeholder="전체"
                  ></multiselect>

                  <label>상태</label>
                  <multiselect
                    v-model="taskActivityStateCode"
                    :id="`taskSelect_${activeItems.processTask.taskId}`"
                    :showLabels="false"
                    :searchable="false"
                    :options="code.taskActivityStateCode"
                    class="inline"
                    label="codeName"
                    track-by="code"
                    placeholder="전체"
                  ></multiselect>

                  <div class="search-btn">
                    <b-button type="button" variant="outline-secondary" @click="resetActivity(activeItems.processTask.taskId)"><i class="icon-reload"></i></b-button>
                    <b-button type="button" variant="primary" @click="fetchActivity(activeItems.processTask.taskId, searchItem)"><i class="icon-magnifier"></i></b-button>
                  </div>
                </b-form>

                <div class="detailStatus d-flex" v-for="(detail, i) in detailItems">
                  <div class="pop">
                    <h6>{{ detail.popName }}</h6>
                    <strong>{{ detail.popEndQty }}</strong><span>/{{ detail.popTotalQty }}</span>
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
            <!--// Edge(Summary) -->

            <!-- HR/LR -->
            <div v-if="taskName === 'HR' || taskName === 'LR' || (taskName === 'E' && !isEdgeSummary)">
              <b-form class="searchBox" inline>
                <label>상태</label>
                <multiselect
                  v-model="taskActivityStateCode"
                  :id="`taskSelect_${activeItems.processTask.taskId}`"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.taskActivityStateCode"
                  class="inline"
                  label="codeName"
                  track-by="code"
                  placeholder="전체"
                ></multiselect>

                <div class="search-btn">
                  <b-button type="button" variant="outline-secondary" @click="resetActivity(activeItems.processTask.taskId)"><i class="icon-reload"></i></b-button>
                  <b-button
                    type="button"
                    variant="primary"
                    @click="fetchActivity(activeItems.processTask.taskId, { taskActivityStateCode: searchItem.taskActivityStateCode })"
                  ><i class="icon-magnifier"></i></b-button>
                </div>
              </b-form>

              <div class="statusBoxWrap d-flex flex-wrap">
                <div
                  class="statusBox"
                  :class="statusClass(active.taskActivityStateCode)"
                  v-for="(active, i) in activeItems.taskActivityList"
                >
                  <div class="names">
                    <h6>{{ active.popName }}</h6>
                    <span>{{ active.hostName }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!--// HR/LR -->

          </div>
        </div>
      </b-card>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" active-class="" variant="outline-secondary" :to="{ name: 'Service Processing 관리' }">목록</b-button>
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
          serviceId: [],
          serviceTypeCode: [],
          taskActivityStateCode: []
        },

        queryParams: {},
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
      },
      taskActivityStateCode: {
        get () {
          return this.code.taskActivityStateCode.find(obj => obj.code === this.searchItem.taskActivityStateCode) || null;
        },
        set (newValue) {
          this.searchItem.taskActivityStateCode = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
      // State Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'TASK_ACTIVE_STATE' }
        })
        .then((res) => {
          this.code.taskActivityStateCode = res.data.items;
        });

      // Detail Data
      this.$https.get(`/serviceprocess/${this.id}`)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
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

      resetActivity (taskId){
        Object.keys(this.searchItem).forEach((key) => {
          this.searchItem[key] = null;
        });
        this.fetchActivity(taskId, this.searchItem);
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
          typefields[`typeCode_${i}`] = {
            label: obj.serviceTypeCodeName,
            'class': 'text-right'
          };
        });

        this.summaryFields = {
          serviceName: {label: 'Service', 'class':'text-left'},
          ...typefields,
          serviceTotalQty: {label: 'Total', 'class':'text-right'},
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
            return;
            //this.$router.push({ name: 'Domain Processing 관리'})
        }
        this.setTaskName(task);
        this.queryParams = {};
        this.activeStep(index);

      },

      onTaskReset (taskId){
        this.$https.put(`/serviceprocess/${this.id}/tasks/${taskId}/retry`)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch(err => {
            console.log(err);
          })
      },

      statusClass (code) {
        const codeSplit = typeof code === 'string' ? code.split('STATE_')[1] : '';
        return codeSplit === '01' ? 'st-ready'
          : codeSplit === '02' ? 'st-process'
          : codeSplit === '03' ? 'st-success'
          : codeSplit === '04' ? 'st-danger'
          : '';
      }
    }
  }
</script>
