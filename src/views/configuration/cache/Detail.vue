<template>
  <div class="animated fadeIn">
    <b-card>
      <!-- Service 선택 -->
      <b-form-fieldset
        label="Service"
        :label-cols="3"
        :horizontal="true">
        <b-form-input
          :value="items.serviceName"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- PoP 선택 -->
      <b-form-fieldset
        label="PoP"
        :label-cols="3"
        :horizontal="true">
        <b-form-input
          :value="items.popName"
          type="text"
          plaintext
        ></b-form-input>
        <span v-if="items.bandwidth !== null" class="form-sub-text">(Bandwidth : {{ items.bandwidth }} GB)</span>
      </b-form-fieldset>

      <!-- Set2 사용여부 -->
      <b-form-fieldset
        label="Set2사용여부 <i class='require'>*</i>"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          v-if="isEdit"
          type="icon"
          variant="success"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          :pill="true"
          @change="onChangeSet2"
          v-model="items.setApplyYn"
        ></c-switch>
        <b-badge
          v-else
          pill
          :variant="items.setApplyYn ? 'success' : 'secondary'">
          {{ items.setApplyYn ? '사용' : '미사용' }}
        </b-badge>
        <span class="form-sub-text">(적용 시간 : 02:00:00 ~ 04:59:00)</span>
      </b-form-fieldset>
    </b-card>


    <b-card
      v-if="items.cacheThrottlingCases.length > 0"
      v-for="(cache, index) in items.cacheThrottlingCases"
      :key="index"
    >
      <div slot="header">
        <i class='fa fa-angle-right'></i> <strong>CASE {{ cache.caseSeq }} :</strong> {{ cache.caseName }}

        <b-button
          v-if="!isEdit"
          type="button"
          variant="outline-secondary"
          class="float-right"
          @click="showHistory(cache.caseSeq)"
        >이력관리</b-button>
      </div>

      <section class="board" v-if="cache.cacheThrottlingComps.length > 0">
        <b-table
          striped
          bordered
          show-empty
          foot-clone
          :items="cache.cacheThrottlingComps"
          :fields="caseFields"
        >
          <template slot="bandwidth1" scope="row">
            <span v-if="isEdit">
              <b-form-checkbox
                v-model="row.item.band1UseYn"
                @change="onChecked(row.item, '1')"
              ></b-form-checkbox>
              <b-form-input
                v-model="row.item.bandwidth1"
                type="number"
                min="0"
                size="sm"
                class="inline"
                style="width:80px"
                :disabled="!row.item.band1UseYn"
              ></b-form-input>
              GB 제한
            </span>
            <span v-else>{{ row.value > 0 ? `${row.value} GB 제한` : '--' }}</span>
          </template>

          <template slot="bandwidth2" scope="row">
            <span v-if="isEdit">
              <b-form-checkbox
                v-model="row.item.band2UseYn"
                :disabled="!items.setApplyYn"
                @change="onChecked(row.item, '2')"
              ></b-form-checkbox>
              <b-form-input
                v-model="row.item.bandwidth2"
                type="number"
                min="0"
                size="sm"
                class="inline"
                style="width:80px"
                :disabled="!row.item.band2UseYn"
              ></b-form-input>
              GB 제한
            </span>
            <span v-else>{{ row.value > 0 ? `${row.value} GB 제한` : '--' }}</span>
          </template>

          <template slot="FOOT_serviceTypeCodeName" scope="data">
            Total
          </template>
          <template slot="FOOT_bandwidth1" scope="data">
              <span
                class="warning text-danger"
                v-if="total[index].bandwidth1 > items.bandwidth"
              >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</span>
            <span :class="{'text-danger' : total[index].bandwidth1 > items.bandwidth }">{{ total[index].bandwidth1 }}</span>
          </template>
          <template slot="FOOT_bandwidth2" scope="data">
              <span
                class="warning text-danger"
                v-if="total[index].bandwidth2 > items.bandwidth"
              >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</span>
            <span :class="{'text-danger' : total[index].bandwidth2 > items.bandwidth }">{{ total[index].bandwidth2 }}</span>
          </template>
        </b-table>
      </section>
      <!-- 배포 일시 / 상태 -->
      <b-form-fieldset
        v-if="!isEdit"
        label="배포 일시 / 상태"
        :label-cols="3"
        :horizontal="true">
        {{ items.createDateTime }}
        <b-form-input
          :value="deploy.status ? '성공' : '실패'"
          style="width:30px"
          plaintext
          type="text"></b-form-input>
        (<a href="#">{{ deploy.count }}</a>)
      </b-form-fieldset>
    </b-card>

    <b-card v-if="isEdit">
      <!-- 변경이력 -->
      <b-form-fieldset
        label="변경이력"
        :label-cols="3"
        :horizontal="true">
        <b-form-textarea
          v-model="items.modifyHistReason"
          :rows="6">
        </b-form-textarea>
      </b-form-fieldset>
    </b-card>

    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.history
        :block="true">
        처리이력
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="history" v-if="!isEdit">
      <b-card>
        <!-- 등록일 -->
        <b-form-fieldset
          label="등록일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 등록자 -->
        <b-form-fieldset
          label="등록자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정일 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정자 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit" :disabled="!onCheckBandwidth()">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Cache Throttling 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
        >
          <template slot="histMgmtId" scope="row">
            <a :href="getHistoryLink(row.value, row.item.caseSeq)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
      </div>
    </b-modal>

    <!-- Message Modal -->
    <b-modal title="Message" size="sm" v-model="isModalMessage" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" variant="danger" @click="onDeleteData"><i class="fa fa-dot-circle-o"></i> 삭제</b-button>
        <b-button type="button" variant="secondary" @click="isModalMessage = false"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'cache',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        originItems: {},
        items: {
          popId: 20,
          popName: null,
          serviceId: 4,
          serviceName: null,
          bandwidth: null,
          popBandwidth: null,
          setApplyYn: null,
          modifyHistReason: null,
          cacheThrottlingCases: []
        },

        caseFields: {
          serviceTypeCodeName: {label: 'Service Type'},
          bandwidth1: {label: 'Set1 (Basic)', 'class': 'text-right'},
          bandwidth2: {label: 'Set2', 'class': 'text-right'}
        },

        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: []
        },
        isEdit: false,
        isModalHistory: false,
        isModalMessage: false,
        modalMessage: '',

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
      total (){
        const items = this.items.cacheThrottlingCases.length > 0 ?
          this.items.cacheThrottlingCases.map(({ cacheThrottlingComps }) => {
            return {
              bandwidth1: cacheThrottlingComps
                .map(({bandwidth1}) => bandwidth1)
                .reduce((p, n) => parseInt(p) + parseInt(n)),
              bandwidth2: cacheThrottlingComps
                .map(({bandwidth2}) => bandwidth2)
                .reduce((p, n) => parseInt(p) + parseInt(n))
            }
          }) : [{ bandwidth1: 0, bandwidth2: 0 }];

        return items;
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const caseSeq = this.$route.query.caseSeq;
      const detailUrl = historyId !== undefined ? `/policy/cacheThrottlings/${this.id}/case/${caseSeq}/histories/${historyId}`
        : `/policy/cacheThrottlings/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = {
            ...this.items,
            ...res.data.items,
            bandwidth: res.data.items.popBandwidth
          };
          this.setCacheCaseData();
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        const {
          popId,
          serviceId,
          bandwidth,
          setApplyYn,
          modifyHistReason
        } = this.items;

        const cacheCase = this.items.cacheThrottlingCases.map(obj => {
          const cacheThrottlingComps = obj.cacheThrottlingComps.length > 0 ?
            obj.cacheThrottlingComps.map(({ serviceTypeCode, bandwidth1, bandwidth2 }) => ({
              serviceTypeCode,
              bandwidth1: parseInt(bandwidth1),
              bandwidth2: parseInt(bandwidth2)
            }))
            : [];
          return {
            ...obj,
            cacheThrottlingComps
          }
        });

        this.$https.put(`/policy/cacheThrottlings/${this.id}`, {
            popId,
            serviceId,
            bandwidth,
            setApplyYn,
            cacheThrottlingCases: cacheCase,
            modifyHistReason
          })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.isModalMessage = true;
      },

      onDeleteData (){
        this.$https.delete(`/policy/cacheThrottlings/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Cache Throttling 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onCheckBandwidth (){
        let isCheckBandwidth = true;
        this.total.forEach(({ bandwidth1, bandwidth2}) => {
          if (bandwidth1 > this.items.bandwidth || bandwidth2 > this.items.bandwidth){
            isCheckBandwidth = false;
          }
        });
        return isCheckBandwidth;
      },

      onChecked (item, type){
        const useYn = `band${type}UseYn`;
        const bandwidth = `bandwidth${type}`;
        if (!item[useYn]) {
          item[bandwidth] = 0;
        }
      },

      onChangeSet2 (applyYn){
        const cases = this.items.cacheThrottlingCases;

        if (!applyYn && cases.length > 0){
          cases.forEach(({ cacheThrottlingComps }) => {
            if (cacheThrottlingComps.length > 0 ){
              cacheThrottlingComps.forEach(ob => {
                ob.band2UseYn = false;
                ob.bandwidth2 = 0;
              })
            }
          });
        }
      },

      setCacheCaseData (){
        this.items.cacheThrottlingCases = this.items.cacheThrottlingCases.map(obj => {
          const cacheThrottlingComps = obj.cacheThrottlingComps.length > 0 ?
            obj.cacheThrottlingComps.map(ob => ({
              ...ob,
              band1UseYn: ob.bandwidth1 > 0,
              band2UseYn: ob.bandwidth2 > 0
            }))
            : [];
          return {
            ...obj,
            cacheThrottlingComps
          }
        });
      },

      getHistoryLink (rowId, caseSeq){
        return `#/configuration/cache/${this.id}?histories=${rowId}&caseSeq=${caseSeq}`
      },

      showHistory (caseSeq) {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/cacheThrottlings/${this.id}/case/${caseSeq}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
