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
          <div class="processBox state" v-for="(item, index) in items.processTaskList">
            <h5>{{ item.interlockTargetCodeName }}</h5>
            <span>{{ item.interlockSuccessQty }}</span> /
            <span>{{ item.interlockTotalQty }}</span>
          </div>
        </div>
      </b-card>


      <b-card
        v-for="(item, index) in items.processTaskList"
        :key="item.taskId"
      >
        <div slot="header">
          <i class='fa fa-angle-right'></i> {{ item.interlockTargetCodeName }}
          <div class="card-actions">
            <b-button size="sm" class="btn-minimize">
              <i class="fa fa-pencil"></i>
              <span class="sr-only">재실행</span>
            </b-button>
          </div>
        </div>

        <div v-if="item.interlockTargetCode === 'INTERLOCK_TARGET_01'">
          DNS
        </div>

        <div v-if="item.interlockTargetCode === 'INTERLOCK_TARGET_02'">
          <div class="timeInfo">
            <span>시작: {{ item.taskBeginDatetime }}</span>
            <span class="ml-2">종료: {{ item.taskEndDatetime }}</span>
          </div>
          <div class="searchInfo">
            <b-form-fieldset
              label="상태"
              :label-cols="1"
              :horizontal="true">
              <multiselect
                :id="`taskSelect_${item.taskId}`"
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

          <div class="statusBoxWrap d-flex flex-wrap">
            <div
              class="statusBox"
              :class="statusClass(active.taskActivityStateCode)"
              v-for="(active, i) in activeItems[item.taskId]"
            >
              <h6>{{ active.popName }}</h6>
              <span>{{ active.transactionId }}</span>
            </div>
          </div>
        </div>

        <div v-if="item.interlockTargetCode === 'INTERLOCK_TARGET_03'">
          Low Referrer
        </div>

        <div v-if="item.interlockTargetCode === 'INTERLOCK_TARGET_04'">
          Edge
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
        activeItems: {},
        code: {
          taskStateCode: []
        },
        isLoad: {
          taskStateCode: false
        },
        isEdit: false
      }
    },

    computed: {
    },

    created (){
      // State Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'TASK_STATE' }
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
          this.originItems = JSON.parse(JSON.stringify(this.items));

          const taskIds = this.items.taskIds.split(',');
          taskIds.forEach(tid => { this.fetchActivity(tid) });
        });
    },

    methods: {
      fetchActivity (taskId, params = {}){
        this.$https.get(`/serviceprocess/${this.id}/tasks/${taskId}/activities`, params)
          .then((res) => {
            const activeList = res.data.items.taskActivityList !== null ? res.data.items.taskActivityList : [];

            this.activeItems = Object.assign({}, this.activeItems, { [taskId] : activeList });
          });
      },

      onChangeStatus (obj, id){
        const taskId = id.split('taskSelect_')[1];
        const codeObj = obj !== null ? { taskActivityStateCode: `TASK_ACTIVE_STATE_${obj.code.split('_')[2]}` } : {};
        this.fetchActivity(taskId, codeObj);
      },

      statusClass (code) {
        return code === 'TASK_ACTIVE_STATE_01' ? 'bg-secondary'
          : code === 'TASK_ACTIVE_STATE_02' ? 'bg-primary'
          : code === 'TASK_ACTIVE_STATE_03' ? 'bg-success'
          : 'bg-danger';
      }
    }
  }
</script>

<style>
  .timeInfo {

  }
  .statusBoxWrap {
    margin: 0 -10px;
  }
  .statusBox {
    margin: 10px;
    border: 1px solid #000;
    padding: 15px;
    text-align: center;
  }
  .processBox {
    margin: 10px;
    border: 1px solid #000;
    padding: 15px;
    text-align: center;
    min-width: 100px;
    background: #f7b900;
  }
</style>
