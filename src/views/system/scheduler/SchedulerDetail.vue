<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Scheduler Id -->
        <b-form-fieldset
          v-if="!isEdit"
          label="ID"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Scheduler Name -->
        <b-form-fieldset
          :invalid-feedback="feedback.scheduleName"
          :horizontal="true">
          <template slot="label">
            Scheduler Name<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            :value="items.scheduleName"
            type="text"
            placeholder="Enter Scheduler Name"
            :plaintext="!isReScheduleName"
            :state="valid.scheduleName"
            @input="scheduleNameExists = null"
            required
          ></b-form-input>
          <b-button v-if="isEdit && !isReScheduleName" variant="in-table" @click="fetchReName">재입력</b-button>
          <b-button v-if="isEdit && isReScheduleName" variant="in-table" @click="fetchNameExists">중복확인</b-button>
          <span class="ico ml-2 mid" v-if="scheduleNameExists !== null">
            <i v-if="scheduleNameExists === 'success'" class="fa fa-check-circle"></i>
            <i v-if="scheduleNameExists === 'fail'" class="fa fa-times-circle"></i>
          </span>
        </b-form-fieldset>

        <!-- Scheduler Class Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Class Name<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            :value="items.scheduleClassName"
            type="text"
            placeholder="Enter Class Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 실행주기 -->
        <b-form-fieldset
          label="실행주기"
          :horizontal="true">
          <b-form-radio-group
            v-if="isEdit"
            v-model="items.inputSectionCode"
            :options="code.inputSectionCode"
            name="inputSectionCode"
            value-field="code"
            text-field="codeName"
            @change="executionCycleChange"
          ></b-form-radio-group>
          <b-form-input
            v-if="!isEdit"
            :value="items.execCycle"
            type="text"
            plaintext
          ></b-form-input>
          <b-form-input
            v-if="isEdit && (items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_02')"
            :value="items.execCycle"
            type="text"
            placeholder="Enter Execution Cycle"
            required
          ></b-form-input>
          <div v-if="isEdit && (items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_01')">
            분
            <multiselect
              v-model="items.minuteSelect"
              label="codeName"
              class="noEmpty"
              style="width:50px"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.minuteSelect"
            ></multiselect>
            시
            <multiselect
              v-model="items.hourSelect"
              label="codeName"
              class="noEmpty"
              style="width:50px"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.hourSelect"
            ></multiselect>
            일
            <multiselect
              v-model="items.daySelect"
              label="codeName"
              class="noEmpty"
              style="width:50px"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.daySelect"
            ></multiselect>
            월
            <multiselect
              v-model="items.monthSelect"
              label="codeName"
              class="noEmpty"
              style="width:50px"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.monthSelect"
            ></multiselect>
            주
            <multiselect
              v-model="items.weekSelect"
              label="codeName"
              class="noEmpty"
              style="width:50px"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.weekSelect"
            ></multiselect>
          </div>
        </b-form-fieldset>

        <!-- 설명 -->
        <b-form-fieldset
          label="설명"
          :horizontal="true">
          <b-form-textarea
            v-model="items.scheduleDesc"
            :rows="6"
            :plaintext="!isEdit"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.useYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.useYn }"
          >{{ items.useYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            :rows="6"
            required
          ></b-form-textarea>
        </b-form-fieldset>

      </b-form>
    </b-collapse>

    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button class="btn-collapse" v-b-toggle.formHistory>
        <i class="fa"></i>
        처리이력
      </b-button>
    </div>
    <b-collapse id="formHistory" visible v-if="!isEdit">
      <b-form class="formView">
        <div class="form-row">
          <!-- 등록일 -->
          <b-form-fieldset
            label="등록일시"
            :horizontal="true">
            <b-form-input
              :value="items.createDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 등록자 -->
          <b-form-fieldset
            label="등록자"
            :horizontal="true">
            <b-form-input
              :value="items.createId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 수정일 -->
          <b-form-fieldset
            label="수정일시"
            :horizontal="true">
            <b-form-input
              :value="items.modifyDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 수정자 -->
          <b-form-fieldset
            label="수정자"
            :horizontal="true">
            <b-form-input
              :value="items.modifyId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>
      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Scheduler 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="scheduleHistId" slot-scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <b-pagination
        v-model="history.pageInfo.page"
        :total-rows="history.pageInfo.totalCount"
        :per-page="history.pageInfo.size"
        class="mt-2"
      ></b-pagination>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false">확인</b-button>
      </div>
    </b-modal>

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'referrer',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Scheduler 상세',
        originItems: {},
        items: {
          scheduleId : null,
          scheduleName : '',
          useYn : null,
          scheduleDesc: null,
          scheduleClassName: null,
          execCycle: null,
          modifyHistReason : "Scheduler 수정",
          secondSelect : '0',
          minuteSelect: {code:'*', codeName:'매분'},
          hourSelect: {code:'*', codeName:'매시간'},
          daySelect: {code:'*', codeName:'매일'},
          monthSelect: {code:'*', codeName:'매월'},
          weekSelect: {code:'?', codeName:'선택안함'}
        },
        code: {
          inputSectionCode: [],
          minuteSelect: [],
          hourSelect: [],
          daySelect: [],
          monthSelect: [],
          weekSelect: []
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            scheduleHistId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          inputSectionCode: true,
          minuteSelect: true,
          hourSelect: true,
          daySelect: true,
          monthSelect: true,
          weekSelect: true
        },
        isEdit: false,
        isModalHistory: false,
        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },
        scheduleNameExists: null,
        isReScheduleName: false,
        inValidForm: false
      }
    },

    computed: {
      inputSectionCode: {
        get () {
          return this.code.inputSectionCode.find(obj => obj.code === this.items.inputSectionCode) || null;
        },
        set (newValue) {
          this.items.inputSectionCode = newValue !== null ? newValue.code : null;
        }
      },
      minuteSelect: {
        get () {
          return this.code.minuteSelect.find(obj => obj.code === this.items.minuteSelect) || null;
        },
        set (newValue) {
          this.items.minuteSelect = newValue !== null ? newValue.code : null;
        }
      },
      hourSelect: {
        get () {
          return this.code.hourSelect.find(obj => obj.code === this.items.hourSelect) || null;
        },
        set (newValue) {
          this.items.hourSelect = newValue !== null ? newValue.code : null;
        }
      },
      daySelect: {
        get () {
          return this.code.daySelect.find(obj => obj.code === this.items.daySelect) || null;
        },
        set (newValue) {
          this.items.daySelect = newValue !== null ? newValue.code : null;
        }
      },
      monthSelect: {
        get () {
          return this.code.monthSelect.find(obj => obj.code === this.items.monthSelect) || null;
        },
        set (newValue) {
          this.items.monthSelect = newValue !== null ? newValue.code : null;
        }
      },
      weekSelect: {
        get () {
          return this.code.weekSelect.find(obj => obj.code === this.items.weekSelect) || null;
        },
        set (newValue) {
          this.items.weekSelect = newValue !== null ? newValue.code : null;
        }
      },
      // validation
      valid (){
        return {
          scheduleName: (this.scheduleNameExists === null && this.items.scheduleName.length === 0) ?
            this.scheduleNameExists :
            (this.items.scheduleName.length > 0 &&
            /^[A-Za-z0-9]*$/.test(this.items.scheduleName) &&
            this.scheduleNameExists === 'success')
        }
      },

      // validation feedback
      feedback (){
        return {
          scheduleName: (!(/^[A-Za-z0-9]*$/.test(this.items.scheduleName)) && this.items.scheduleName.length > 0) ?
            '영문, 숫자만 입력하십시오.'
            : (this.scheduleNameExists === null && this.items.scheduleName.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.scheduleNameExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.scheduleNameExists === 'fail') ?
            '이미 등록된 Scheduler Name이 있습니다.'
            : this.items.scheduleName.length === 0 ?
            this.$valid.msg.require : ''
        }
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/system/schedules/${this.id}/histories/${historyId}` : `/system/schedules/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // 분 셀렉트 박스 데이터 셋팅
      this.isLoad.minuteSelect = false;
      this.code.minuteSelect.push({code:'*', codeName: '매분'});
      for(var i=0; i<60; i++) {
        this.code.minuteSelect.push({code:i+'', codeName: i+'분'});
      }
      // 시 셀렉트 박스 테이터 셋팅
      this.isLoad.hourSelect = false;
      this.code.hourSelect.push({code:'*', codeName: '매시간'});
      for(var i=0; i<24; i++) {
        this.code.hourSelect.push({code:i+'', codeName: i+'시'});
      }
      // 일 셀렉트 박스 데이터 셋팅
      this.isLoad.daySelect = false;
      this.code.daySelect.push({code:'*', codeName: '매일'});
      for(var i=1; i<=31; i++) {
        this.code.daySelect.push({code:i+'', codeName: i+'일'});
      }
      // 월 셀렉트 박스 데이터 셋팅
      this.isLoad.monthSelect = false;
      this.code.monthSelect.push({code:'*', codeName: '매월'});
      for(var i=1; i<=12; i++) {
        this.code.monthSelect.push({code:i+'', codeName: i+'월'});
      }
      // 주 셀렉트 박스 데이터 셋팅
      this.isLoad.weekSelect = false;
      this.code.weekSelect.push({code:'?', codeName: '선택안함'});
      for(var i=1; i<=7; i++) {
        this.code.weekSelect.push({code:this.dayOfWeekValue(i), codeName: this.dayOfWeek(i)});
      }

      // 실행주기 code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'EXEC_CYCLE_INPUT_SECTION' }
      })
      .then((res) => {
        this.isLoad.inputSectionCode = false;
        this.code.inputSectionCode = res.data.items;
      });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items, referrerId: this.id };
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });
    },

    methods: {

      dayOfWeek(day) {
        var dayText;
        switch(day){
          case 1: dayText="일요일"; break;
          case 2: dayText="월요일"; break;
          case 3: dayText="화요일"; break;
          case 4: dayText="수요일"; break;
          case 5: dayText="목요일"; break;
          case 6: dayText="금요일"; break;
          case 7: dayText="토요일"; break;
        }
        return dayText;
      },

      dayOfWeekValue(day){
        var dayValue;
        switch(day){
          case 1: dayValue="SUN"; break;
          case 2: dayValue="MON"; break;
          case 3: dayValue="TUE"; break;
          case 4: dayValue="WED"; break;
          case 5: dayValue="THU"; break;
          case 6: dayValue="FRI"; break;
          case 7: dayValue="SAT"; break;
        }
        return dayValue;
      },

      setExecutionCycleSelect () {
        var execCycleArray = this.items.execCycle.split(" ");
        this.items.minuteSelect = this.code.minuteSelect.find(obj => obj.code === execCycleArray[1]);
        this.items.hourSelect = this.code.hourSelect.find(obj => obj.code === execCycleArray[2]);
        this.items.daySelect = this.code.daySelect.find(obj => obj.code === execCycleArray[3]);
        this.items.monthSelect = this.code.monthSelect.find(obj => obj.code === execCycleArray[4]);
        this.items.weekSelect = this.code.weekSelect.find(obj => obj.code === execCycleArray[5]);
      },

      setExecutionCycle(){
        if(this.items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_01') {
          var executionCycleValue = this.items.secondSelect + " "
            + this.items.minuteSelect.code + " "
            + this.items.hourSelect.code + " "
            + this.items.daySelect.code + " "
            + this.items.monthSelect.code + " "
            + this.items.weekSelect.code;
          this.items.execCycle = executionCycleValue;
        }
      },

      executionCycleChange() {
        if(this.items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_02') {
          this.setExecutionCycleSelect();
        } else {
          this.setExecutionCycle();
        }
      },

      onEdit (){
        this.setExecutionCycleSelect();
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.isReScheduleName = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      fetchReName() {
        this.isReScheduleName = true;
      },

      onSubmit (){

        // 실행주기 선택입력인 경우 데이터 가공
        this.setExecutionCycle();

        const validate = (this.$valid.all(this.items) && this.scheduleNameExists === 'success');
        this.inValidForm = !validate;

        if (validate){
          this.$https.put(`/system/schedules/${this.id}`, this.items)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
        }
      },

      onDelete (){
        this.modal = {
          open: true,
          type: 'error',
          msg: '정말로 삭제하시겠습니까?',
          action: this.onDeleteData
        };
      },

      onDeleteData (){
        this.$https.delete(`/system/schedules/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Scheduler 관리' });
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data.error.message);
          });
      },

      getHistoryLink (rowId){
        return `#/system/scheduler/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/system/schedules/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      fetchNameExists (){
        if (!this.items.scheduleName){
          this.scheduleNameExists = 'not';
          return;
        }
        this.$https.get('/system/schedules/scheduleName/exists', {
          scheduleName: this.items.scheduleName,
          scheduleId: `${this.id}`
        })
        .then((res) => {
          this.scheduleNameExists = res.data.result === 'Success' ? 'success' : 'fail';
        });
      }
    }
  }
</script>
