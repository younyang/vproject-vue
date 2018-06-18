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
          <span
          v-if="!isEdit">
            {{items.serverType}}
          </span>
          <multiselect
            v-model="componentTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.componentTypeCode"
            :loading="isLoad.componentTypeCode"
            label="codeName"
            track-by="code"
            v-else
          ></multiselect>
        </b-form-fieldset>

        <!-- 수신그룹 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            수신그룹<i class="require" v-if="isEdit">*</i>
          </template>
          <div  v-if="!isEdit">
            <b-form-select
              multiple
              :select-size="4"
              v-model="items.selectGroupList"
              :options="items.selectGroup"
            ></b-form-select>
              <button title="추가" @click="" class="btn btn-outline-secondary" data-original-title="추가"></button>
              <button title="제거" @click="" class="btn btn-outline-secondary" data-original-title="제거"></button>
            <b-form-select
              multiple
              :select-size="10"
              v-model="items.possibleGroupList"
              :options="items.possibleGroup"
            ></b-form-select>
          </div>
          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in items.groupNames">
              {{ item }}
            </span>
          </div>
        </b-form-fieldset>

        <!--알림방법 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            알림 방법<i class="require" v-if="isEdit">*</i>
          </template>
          <span>
            {{ items.alarmTypeName }}
          </span>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            상태<i class="require" v-if="isEdit">*</i>
          </template>
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.alarmPolicyUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.alarmPolicyUseYn }">
            {{ items.alarmPolicyUseYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>
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
            <!-- 항목 -->
            <template slot="policyTypeName" slot-scope="row">
              <b-form-checkbox
                v-if="isEdit"
                v-model="row.item.alarmPolicyCompUseYn"
                @change="onChecked(row.item)"
              ></b-form-checkbox>
              <span v-if="row.item.alarmPolicyCompUseYn&&!isEdit"> &nbsp;*&nbsp;</span>
              <span v-else >&nbsp;&nbsp;&nbsp;</span>
              {{row.item.policyTypeName}}
            </template>
            <!-- 임계치 -->
            <template slot="policyThreshold" slot-scope="row">
              <span v-if="isEdit">
                <b-form-input
                  v-model="row.item.policyThreshold"
                  type="number"
                  style="width: 80px;"
                  placeholder="Enter deptName"
                  :disabled="!row.item.alarmPolicyCompUseYn"
                  required
                ></b-form-input>이상
              </span>
              <span v-else>{{ row.item.policyThreshold }} 이상</span>
            </template>
            <!-- 지속시간 -->
            <template slot="policyDurationTime" slot-scope="row">
              <span v-if="isEdit">
                <b-form-input
                  v-model="row.item.policyDurationTime"
                  type="number"
                  style="width: 80px;"
                  placeholder="Enter deptName"
                  :disabled="!row.item.alarmPolicyCompUseYn"
                  required
                ></b-form-input>{{row.item.policyDurationTimeUnitName}}
              </span>
              <span v-else>{{ row.item.policyDurationTime }} {{ row.item.policyDurationTimeUnitName }}</span>
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
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Notification 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
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
          policyTypeName: {label: '항목','class': 'text-left'},
          policyThreshold: {label: '임계치','class': 'text-left'},
          policyDurationTime: {label: '지속시간','class': 'text-left'},
        },
        items: {
          alarmPolicyId : null,
          serviceType : null,
          componentTypeCode : null,
          groupNames : null,
          alarmTypeName : null,
          alarmTypeCode : null,
          alarmPolicyUseYn : null,
          modifyDatetime : null,
          modifyId : null,
          alarmPolicyCompList : [],
          alarmPolicyGroupList : [],
          checkList : [],
          groupIds : [],
          selectGroupList : [],
          possibleGroupList : []
        },
        code: {
          componentTypeCode : [],
          groupId : []
        },

        isLoad: {
          componentTypeCode: false,
          groupId : false
        },

        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidForm: false
      }
    },

    computed: {
      componentTypeCode: {
        get () {
          return this.code.componentTypeCode.find(obj => obj.code === this.items.componentTypeCode) || null;
        },
        set (newValue) {
          this.items.componentTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      valid (){
        return {
        }
      }
    },


    created (){
      const detailUrl = `/monitoring/policies/${this.id}`;
      const checkList = [];
      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          res.data.items.alarmPolicyCompList.forEach(obj => {
            if(obj.alarmPolicyId){
              obj.alarmPolicyCompUseYn = true;
              checkList.push(obj);
            }else{
              obj.alarmPolicyCompUseYn = false;
            }
          });
          this.items.checkList = checkList;
          this.items = {
            ...this.items
            , ...res.data.items
          };
          this.items.groupNames = this.items.groupNames.split(',');
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });
      // ComponentTypeCode List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPONENT_TYPE' }
        })
        .then((res) => {
          console.log(res);
          this.isLoad.componentTypeCode = false;
          this.code.componentTypeCode = res.data.items;
        });
      //AlarmTypeCode (Email 고정)
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'ALARM_TYPE_CODE' }
        })
        .then((res) => {
          console.log(res);
          this.items.alarmTypeCode = res.data.items.filter(({code}) => {
            return code === 'ALARM_TYPE_CODE_01';
          });
        });
      //전체 Group 목록
      this.$https.get('/setting/operators/groups')
        .then((res) => {
          this.isLoad.groupId = false;
          this.code.groupId = res.data.items;
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
        // const {
        //   componentTypeCode,
        //   alarmTypeCode,
        //   alarmPolicyUseYn,
        //   checkList,
        //   groupIds
        // } = this.items;

        // const validate = this.$valid.all();
        // this.inValidForm = !(validate);
        // if(validate){
          this.$https.put(`/monitoring/policies/${this.id}`,this.items).then(() => {
            this.$router.go(this.$router.currentRoute);
          }).catch((error) => {
            console.log(error)
          })
        // }
      },

      validate (submitItems){

      },

      onChecked(item){
        if(!item.alarmPolicyCompUseYn){
          this.items.checkList.push(item);
        }else{
          this.items.checkList.forEach((obj, i) =>{
            if(obj.policyTypeCode === item.policyTypeCode){
              this.items.checkList.splice(i, 1)
            }
          })
        }
      },

      getSelectGroupNames () {


        return [
          {
            text:"zzzz",
            value:"1"
          },{
            text:"zzddddzz",
            value:"2"
          }
        ]
      },

      getPossibleGroupNames () {
        const possibleGroupList = [];
        this.code.groupId.forEach( obj => {
          possibleGroupList.push({
            text : obj.groupName,
            value : obj.groupId
          })
        });
        return possibleGroupList;
      },
    }
  }
</script>
