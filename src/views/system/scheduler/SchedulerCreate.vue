<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- Scheduler Name -->
      <b-form-fieldset
        label="Scheduler Name<i class='require'>*</i>"
        :invalid-feedback="feedback.scheduleName"
        :horizontal="true">
        <b-form-input
          v-model="items.scheduleName"
          type="text"
          placeholder="Enter scheduler Name"
          :state="valid.scheduleName"
          @input="scheduleNameExists = null"
          required
        ></b-form-input>
        <b-button variant="in-table" @click="fetchNameExists">중복확인</b-button>
        <span class="ico ml-2 mid" v-if="scheduleNameExists !== null">
          <i v-if="scheduleNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="scheduleNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
      </b-form-fieldset>

      <!-- Class Name -->
      <b-form-fieldset
        label="Class Name<i class='require'>*</i>"
        :invalid-feedback="feedback.scheduleClassName"
        :horizontal="true">
        <b-form-input
          v-model="items.scheduleClassName"
          type="text"
          placeholder="Enter Class name"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- 실행주기 -->
      <b-form-fieldset
        label="실행주기<i class='require'>*</i>"
        :horizontal="true">
        <b-form-radio-group
          v-model="items.inputSectionCode"
          :options="code.inputSectionCode"
          name="inputSectionCode"
          value-field="code"
          text-field="codeName"
        ></b-form-radio-group>
        <b-form-input
          v-if="items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_02'"
          v-model="items.execCycle"
          type="text"
          placeholder="Enter execCycle"
          required
        ></b-form-input>
        <div v-if="items.inputSectionCode === 'EXEC_CYCLE_INPUT_SECTION_01'">
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
        ></b-form-textarea>
      </b-form-fieldset>

      <!-- 사용여부 -->
      <b-form-fieldset
        label="사용여부"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.popUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Scheduler 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'schedules',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          scheduleName: '',
          scheduleClassName: '',
          inputSectionCode: 'EXEC_CYCLE_INPUT_SECTION_01',
          execCycle : null,
          useYn : true,
          secondSelect : '0',
          minuteSelect: {code:'*', codeName: '매분'},
          hourSelect: {code:'*', codeName: '매시간'},
          daySelect: {code:'*', codeName: '매일'},
          monthSelect: {code:'*', codeName: '매월'},
          weekSelect: {code:'?', codeName: '선택안함'}
        },
        code: {
          inputSectionCode: [],
          minuteSelect: [],
          hourSelect: [],
          daySelect: [],
          monthSelect: [],
          weekSelect: []
        },
        isLoad: {
          inputSectionCode: true,
          minuteSelect: true,
          hourSelect: true,
          daySelect: true,
          monthSelect: true,
          weekSelect: true
        },

        scheduleNameExists: null,
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


      // 분 셀렉트 박스 데이터 셋팅
      this.isLoad.minuteSelect = false;
      this.code.minuteSelect.push({code:'*', codeName: '매분'});
      for(var i=0; i<60; i++) {
        this.code.minuteSelect.push({code:i, codeName: i+'분'});
      }
      // 시 셀렉트 박스 테이터 셋팅
      this.isLoad.hourSelect = false;
      this.code.hourSelect.push({code:'*', codeName: '매시간'});
      for(var i=0; i<24; i++) {
        this.code.hourSelect.push({code:i, codeName: i+'시'});
      }
      // 일 셀렉트 박스 데이터 셋팅
      this.isLoad.daySelect = false;
      this.code.daySelect.push({code:'*', codeName: '매일'});
      for(var i=1; i<=31; i++) {
        this.code.daySelect.push({code:i, codeName: i+'일'});
      }
      // 월 셀렉트 박스 데이터 셋팅
      this.isLoad.monthSelect = false;
      this.code.monthSelect.push({code:'*', codeName: '매월'});
      for(var i=1; i<=12; i++) {
        this.code.monthSelect.push({code:i, codeName: i+'월'});
      }
      // 주 셀렉트 박스 데이터 셋팅
      this.isLoad.weekSelect = false;
      this.code.weekSelect.push({code:'?', codeName: '선택안함'});
      for(var i=1; i<=7; i++) {
        this.code.weekSelect.push({code:this.dayOfWeekValue(i), codeName: this.dayOfWeek(i)});
      }

      // 실행주기 입력 타입 Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'EXEC_CYCLE_INPUT_SECTION' }
        })
        .then((res) => {
          this.isLoad.inputSectionCode = false;
          this.code.inputSectionCode = res.data.items;
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

      onSubmit (){

        this.setExecutionCycle();

        // History
        const validate = (this.$valid.all(this.items) && this.scheduleNameExists === 'success');
        this.inValidForm = !validate;

        // POST
        if (validate){
          this.$https.post('/system/schedules', this.items)
            .then((res) => {
              this.$router.push({ name: 'Scheduler 상세', params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
        }
      },

      fetchNameExists (){
        if (!this.items.scheduleName){
          this.scheduleNameExists = 'not';
          return;
        }
        this.$https.get('/system/schedules/scheduleName/exists', {
          scheduleName: this.items.scheduleName
        })
        .then((res) => {
          this.scheduleNameExists = res.data.result === 'Success' ? 'success' : 'fail';
        });
      }
    }
  }
</script>
