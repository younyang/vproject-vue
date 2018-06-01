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

        <!-- ServerType -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            ServerType<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.serverType"
            type="text"
            placeholder="Enter Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 수신그룹 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            수신그룹<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.groupNames"
            type="text"
            plaintext
            required
          ></b-form-input>
        </b-form-fieldset>

        <!--알림방법 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            알림 방법<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.alarmTypeName"
            type="text"
            placeholder="Enter deptName"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            상태<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.alarmPolicyUseYn"
            type="text"
            placeholder="Enter deptName"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>
      </b-form>
      </b-form>
    </b-collapse>

    <!-- 알림 상세 정보 -->
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.alarmDetailInfo>
        <i class="fa"></i>
        알림 상세 정보
      </b-button>
    </div>
    <b-collapse id="alarmDetailInfo" visible>
      <b-form class="formView">
        <section class="board">
          <b-table
            show-empty
            :items="items.alarmPolicyCompList"
            :fields="fields"
          >
          <template slot="alarmPolicyId" slot-scope="row">
            {{row.value? 'check': 'notCheck'}}
            <span v-if="isEdit">
              <b-form-checkbox
                v-model="row.item.alarmPolicyId"
                :disabled="caseSeq !== cache.caseSeq"
                @change="onChecked(row.item, '1')"
              ></b-form-checkbox>
            </span>
          </template>
          </b-table>
        </section>
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
          <!-- 수정일 -->
          <b-form-fieldset
            label="수정일시"
            :horizontal="true">
            <b-form-input
              :value="items.modifyDatetime"
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
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Operator 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit" v-if="this.items.operatorStateCode !== 'OPERATOR_STATE_03'">수정</b-button>
    </div>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'service',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Application 상세',
        originItems: {},
        fields: {
          policyTypeCode: {label: '구분'},
          alarmPolicyId : {lavel: '체크'},
          policyTypeName: {label: '항목'},
          policyThreshold: {label: '임계치'},
          policyDurationTime: {label: '지속시간'},
        },
        items: {
          alarmPolicyId : null,
          serviceType : null,
          groupNames : [],
          alarmTypeName : null,
          alarmPolicyUseYn : null,
          modifyDatetime : null,
          modifyId : null,
          alarmPolicyCompList:[],
          alarmPolicyGroupList:[]
        },
        code: {
          groupList: [],
          serviceList: []
        },

        isLoad: {
          groupCode: true,
          serviceCode: true
        },

        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidForm: false,
        groupSelectPlatform: false,
        serviceSelectAll: false
      }
    },

    computed: {
      valid (){
        return {
        }
      }
    },


    created (){
      const detailUrl = `/monitoring/policies/${this.id}`;

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });
    },

    methods: {
      fetchDetail (res){
      },

      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){

      },

      validate (submitItems){
      },

    }
  }
</script>
