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

        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            국사<i class="require">*</i>
          </template>
          <multiselect
            v-model="popId"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            track-by="popId"
          ></multiselect>
        </b-form-fieldset>

        <!-- ServerType -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            ServerType<i class="require">*</i>
          </template>
          <multiselect
            v-model="componentTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.componentTypeCode"
            :loading="isLoad.componentTypeCode"
            label="codeName"
            track-by="code"
          ></multiselect>
        </b-form-fieldset>
        <!-- 수신그룹 -->
        <b-form-fieldset
        description = "[!] Shift 버튼을 누른 상태에서 선택하면 여러 항목을 동시에 선택할 수 있습니다."
          :horizontal="true">
          <template slot="label">
            수신그룹<i class="require">*</i>
          </template>
            <button title="select전체선택" @click="selectAllGroup" class="btn btn-outline-secondary" data-original-title="전체선택">전체선택</button>
            <b-form-select
             style="width: 150px; height: 80px;"
              multiple
              :select-size="4"
              @change="removePossibleGroup"
              v-model="items.selectGroup"
              :options="items.selectGroupListEdit"
            ></b-form-select>
              <button title="추가" @click="updateSelectGroup" class="btn btn-outline-secondary" data-original-title="추가">◀</button>
              <button title="제거" @click="deleteSelectGroup" class="btn btn-outline-secondary" data-original-title="제거">▶</button>
            <b-form-select
              style="width: 150px; height: 80px;"
              multiple
              :select-size="10"
              @change="removeSelectGroup"
              v-model="items.possibleGroup"
              :options="items.possibleGroupListEdit"
            ></b-form-select>
            <button title="possible전체선택" @click="possibleAllGroup" class="btn btn-outline-secondary" data-original-title="전체선택">전체선택</button>
        </b-form-fieldset>

        <!--알림방법 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            알림 방법<i class="require">*</i>
          </template>
          <multiselect
            v-model="alarmTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.alarmTypeCode"
            :loading="isLoad.alarmTypeCode"
            label="codeName"
            track-by="code"
          ></multiselect>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            상태<i class="require">*</i>
          </template>
          <c-switch
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.alarmPolicyUseYn"
          ></c-switch>
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
              v-model="row.item.alarmPolicyCompUseYn"
              @change="onChecked(row.item)"
            ></b-form-checkbox>&nbsp;&nbsp;&nbsp;
            {{row.item.policyTypeName}}
          </template>
          <!-- 임계치 -->
          <template slot="policyWarningThreshold" slot-scope="row">
              <b-form-input
                v-model="row.item.policyWarningThreshold"
                type="number"
                style="width: 80px;"
                :disabled="!row.item.alarmPolicyCompUseYn"
                required
              ></b-form-input>이상
          </template>
          <!-- 지속시간 -->
          <template slot="policyWarningDurationTime" slot-scope="row">
              <b-form-input
                v-model="row.item.policyWarningDurationTime"
                type="number"
                style="width: 80px;"
                :disabled="!row.item.alarmPolicyCompUseYn"
                required
              ></b-form-input>{{row.item.policyWarningDurationTimeUnitName}}
          </template>

          <template slot="policyCriticalThreshold" slot-scope="row">
              <b-form-input
                v-model="row.item.policyCriticalThreshold"
                type="number"
                style="width: 80px;"
                :disabled="!row.item.alarmPolicyCompUseYn"
                required
              ></b-form-input>이상
          </template>
          <!-- 지속시간 -->
          <template slot="policyCriticalDurationTime" slot-scope="row">
              <b-form-input
                v-model="row.item.policyCriticalDurationTime"
                type="number"
                style="width: 80px;"
                :disabled="!row.item.alarmPolicyCompUseYn"
                required
              ></b-form-input>{{row.item.policyCriticalDurationTimeUnitName}}
          </template>
        </b-table>
      </section>
    </b-form>
  </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Notification 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'service',
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        fields: {
          policyTypeCode: {label: '구분'},
          policyTypeName: {label: '항목','class': 'text-left'},
          policyWarningThreshold: {label: '임계치','class': 'text-left'},
          policyWarningDurationTime: {label: '지속시간','class': 'text-left'},
          policyCriticalThreshold: {label: '임계치','class': 'text-left'},
          policyCriticalDurationTime: {label: '지속시간','class': 'text-left'},
        },
        items: {
          alarmPolicyId : null,
          serviceType : null,
          componentTypeCode : null,
          groupNames : null,
          alarmTypeCode : null,
          alarmPolicyUseYn : true,
          modifyDatetime : null,
          modifyId : null,
          alarmPolicyCompList : [],
          alarmPolicyGroupList : [],
          checkList : [],
          groupIds : [],
          selectGroup : [],
          possibleGroup : [],
          selectGroupList : [],
          possibleGroupList : [],
          selectGroupListEdit : [],
          possibleGroupListEdit : [],
          alarmTypeCode : [],
          popId : null
        },
        code: {
          componentTypeCode : [],
          groupId : [],
          alarmTypeCode : [],
          popId : []
        },

        isLoad: {
          componentTypeCode: true,
          groupId : true,
          alarmTypeCode : true,
          popId : true
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
      alarmTypeCode: {
        get () {
          return this.code.alarmTypeCode.find(obj => obj.code === this.items.alarmTypeCode) || null;
        },
        set (newValue) {
          this.items.alarmTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      }
    },


    created (){
      const checkList = [];
      // Detail Data
      this.$https.get('/monitoring/policies/check')
        .then((res) => {
          this.items.alarmPolicyCompList = res.data.items;
          res.data.items.forEach(obj => {
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
        });
      // ComponentTypeCode List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPONENT_TYPE' }
        })
        .then((res) => {
          this.isLoad.componentTypeCode = false;
          this.code.componentTypeCode = res.data.items;
        });
      //AlarmTypeCode (Email 고정)
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'ALARM_TYPE_CODE' }
        })
        .then((res) => {
          this.isLoad.alarmTypeCode = false;
          this.code.alarmTypeCode = res.data.items;
        });
      //전체 Group 목록
      this.$https.get('/setting/operators/groups')
        .then((res) => {
          this.isLoad.groupId = false;
          res.data.items.forEach( obj => {
            this.items.possibleGroupListEdit.push({
              text : obj.groupName,
              value : obj.groupId
            })
          });
        });
        // Pop 목록
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
          this.code.popId.push({
              popId:0,
              popName: '공통'
          })
        });
    },

    methods: {

      onSubmit (){
        this.items.groupIds = this.items.selectGroupList;
        if(this.items.groupIds.length !== 0){
          this.$https.post('/monitoring/policies', this.items)
            .then((res) => {
              this.$router.push({ name: 'Notification 관리'})
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
        }else{
          alert("수신 그룹을 추가하세요.");
        }

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

      selectAllGroup (){
        this.items.selectGroup.length == 0 ? this.items.selectGroup = this.items.selectGroupList : this.items.selectGroup = []
      },

      possibleAllGroup () {
        this.items.possibleGroup.length == 0 ? this.items.possibleGroup = this.items.possibleGroupList : this.items.possibleGroup = []
      },

      updateSelectGroup () {
        if(this.items.possibleGroup){
          const data = [];
          for(var i = 0; i < this.items.possibleGroupListEdit.length; i ++){
            this.items.possibleGroup.forEach(obj2=> {
              if(this.items.possibleGroupListEdit[i].value == obj2){
                this.items.selectGroupListEdit.push(this.items.possibleGroupListEdit[i]);
                this.items.possibleGroupListEdit.splice(i,1);
              }
            })
          }
          this.items.selectGroupList = [];
          this.items.selectGroupListEdit.filter(({value}) => {
            this.items.selectGroupList.push(value);
          })
          this.items.possibleGroupList = [];
          this.items.possibleGroupListEdit.filter(({value}) => {
            this.items.possibleGroupList.push(value);
          })
          this.items.selectGroup = [];
          this.items.possibleGroup = [];

        }
      },

      deleteSelectGroup () {
        if(this.items.selectGroup){
          const data = [];
          for(var i = 0; i < this.items.selectGroupListEdit.length; i ++){
            this.items.selectGroup.forEach(obj2=> {
              if(this.items.selectGroupListEdit[i].value == obj2){
                this.items.possibleGroupListEdit.push(this.items.selectGroupListEdit[i]);
                this.items.selectGroupListEdit.splice(i,1);
              }
            })
          }
          this.items.selectGroupList = [];
          this.items.selectGroupListEdit.filter(({value}) => {
            this.items.selectGroupList.push(value);
          })
          this.items.possibleGroupList = [];
          this.items.possibleGroupListEdit.filter(({value}) => {
            this.items.possibleGroupList.push(value);
          })
          this.items.selectGroup = [];
          this.items.possibleGroup = [];
        }

      },

      removeSelectGroup () {
        if(this.items.selectGroup) this.items.selectGroup = [];
      },

      removePossibleGroup () {
        if(this.items.possibleGroup) this.items.possibleGroup = [];
      }
    }
  }
</script>
