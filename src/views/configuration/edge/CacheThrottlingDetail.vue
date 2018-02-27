<template>
  <div class="animated fadeIn">
    <b-form class="formView">
      <!-- Service 선택 -->
      <b-form-fieldset
        label="Service"
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
        :horizontal="true">
        <b-form-input
          :value="items.popName"
          type="text"
          plaintext
        ></b-form-input>
        <small class="form-text-alone text-muted">(Bandwidth : {{ items.bandwidth }} GB)</small>
      </b-form-fieldset>

      <!-- Set2 사용여부 -->
      <b-form-fieldset
        label="Set2사용여부"
        :horizontal="true">
        <c-switch
          v-if="isEdit"
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.setApplyYn"
          @change="onChangeSet2"
        ></c-switch>
        <span
          v-else
          class="badge"
          :class="{'primary' : items.setApplyYn }">
          {{ items.setApplyYn ? '사용' : '미사용' }}
        </span>
        <small class="form-text-alone text-muted">(적용 시간 : 02:00:00 ~ 04:59:00)</small>
      </b-form-fieldset>
    </b-form>


    <div
      class="cache-content"
      v-if="items.cacheThrottlingCases.length > 0"
      v-for="(cache, index) in items.cacheThrottlingCases"
      :key="index"
    >
      <h3 class="cache-title">
        <label class="custom-control custom-radio" v-if="isEdit">
          <input
            type="radio"
            name="caseSeq"
            class="custom-control-input"
            :value="cache.caseSeq"
            v-model="caseSeq"
            @change="onSelectCase"
          >
          <span aria-hidden="true" class="custom-control-indicator"></span>
        </label>
        <i class="fa fa-arrow-right" v-else></i>
        <strong>CASE {{ cache.caseSeq }}/</strong>{{ cache.caseName }}

        <b-button
          v-if="!isEdit"
          type="button"
          variant="in-table"
          class="float-right"
          @click="showHistory(cache.caseSeq)"
        >이력관리</b-button>
      </h3>

      <section class="board" v-if="cache.cacheThrottlingComps.length">
        <b-table
          show-empty
          foot-clone
          :items="cache.cacheThrottlingComps"
          :fields="caseFields"
        >
          <template slot="bandwidth1" slot-scope="row">
            <span v-if="isEdit">
              <b-form-checkbox
                v-model="row.item.band1UseYn"
                :disabled="caseSeq !== cache.caseSeq"
                @change="onChecked(row.item, '1')"
              ></b-form-checkbox>
              <cleave
                class="form-control"
                style="width: 80px;"
                v-model.number="row.item.bandwidth1"
                :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
                :disabled="!row.item.band1UseYn || caseSeq !== cache.caseSeq"
                @input="setDefault(row.item, 'bandwidth1')"
              ></cleave> GB 제한
            </span>
            <span v-else>{{ row.value > 0 ? `${row.value} GB 제한` : '--' }}</span>
          </template>

          <template slot="bandwidth2" slot-scope="row">
            <span v-if="isEdit">
              <b-form-checkbox
                v-model="row.item.band2UseYn"
                :disabled="!items.setApplyYn || caseSeq !== cache.caseSeq"
                @change="onChecked(row.item, '2')"
              ></b-form-checkbox>
              <cleave
                class="form-control"
                style="width: 80px;"
                v-model.number="row.item.bandwidth2"
                :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
                :disabled="!row.item.band2UseYn || caseSeq !== cache.caseSeq"
                @input="setDefault(row.item, 'bandwidth2')"
              ></cleave> GB 제한
            </span>
            <span v-else>{{ row.value > 0 ? `${row.value} GB 제한` : '--' }}</span>
          </template>

          <template slot="FOOT_serviceTypeCodeName" slot-scope="data">
            <span class="total-title">Total</span>
          </template>
          <template slot="FOOT_bandwidth1" slot-scope="data">
            <small
              class="invalid"
              v-if="total[index].bandwidth1 > items.bandwidth"
            >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</small>
            <span class="total-text" :class="{'text-danger' : total[index].bandwidth1 > items.bandwidth }">{{ total[index].bandwidth1 }} GB 제한</span>
          </template>
          <template slot="FOOT_bandwidth2" slot-scope="data">
            <small
              class="invalid"
              v-if="total[index].bandwidth2 > items.bandwidth"
            >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</small>
            <span class="total-text" :class="{'text-danger' : total[index].bandwidth2 > items.bandwidth }">{{ total[index].bandwidth2 }} GB 제한</span>
          </template>
        </b-table>
      </section>

      <!-- 배포 일시 / 상태 -->
      <div class="formView" v-if="!isEdit">
        <b-form-fieldset
          label="배포 일시 / 상태"
          :horizontal="true">
          <small class="text-muted">{{ items.createDateTime }}</small>
          <span class="ml-2 mr-2">/</span>
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            :value="processStateCodeName"
          >
          <a :href="`#/workflow/service/${ processId }`" class="btn btn-in-table" target="_blank">{{ processId }}</a>
        </b-form-fieldset>
      </div>
    </div>

    <b-form
      class="formView"
      style="margin-top: 30px"
      v-if="isEdit"
      :validated="inValidForm" novalidate>
      <!-- 변경이력 -->
      <b-form-fieldset
        label="변경이력<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-textarea
          v-model="items.modifyHistReason"
          required
          :rows="6">
        </b-form-textarea>
      </b-form-fieldset>
    </b-form>

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
          <!-- 수정일시 -->
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
      <b-button type="button" variant="primary" @click="onSubmit" :disabled="!onCheckBandwidth()">저장 및 배포</b-button>
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
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="histMgmtId" slot-scope="row">
            <a :href="getHistoryLink(row.value, row.item.caseSeq)" target="_blank">보기</a>
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

        caseSeq: 1,

        caseFields: {
          serviceTypeCodeName: {label: 'Service Type', 'class': 'serviceType'},
          bandwidth1: {label: 'Set1 (Basic)', 'class': 'bandwidth'},
          bandwidth2: {label: 'Set2', 'class': 'bandwidth'}
        },

        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },

        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        // 배포상태 - 임시
        processStateCodeName: '진행중',
        processId: 12332,

        inValidForm: false
      }
    },

    computed: {
      total (){
        const items = this.items.cacheThrottlingCases.length > 0 ?
          this.items.cacheThrottlingCases.map(({ cacheThrottlingComps }) => {
            return {
              bandwidth1: cacheThrottlingComps
                .map(({bandwidth1}) => bandwidth1 !== '' ? bandwidth1 : 0)
                .reduce((p, n) => p + n),
              bandwidth2: cacheThrottlingComps
                .map(({bandwidth2}) => bandwidth2 !== '' ? bandwidth2 : 0)
                .reduce((p, n) => p + n)
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


        const cacheCase = this.items.cacheThrottlingCases
          .filter(({ caseSeq }) => this.caseSeq === caseSeq)
          .map(obj => {
            const cacheThrottlingComps = obj.cacheThrottlingComps.length > 0 ?
              obj.cacheThrottlingComps.map(({ serviceTypeCode, bandwidth1, bandwidth2 }) => ({
                serviceTypeCode,
                bandwidth1,
                bandwidth2
              }))
              : [];
            return {
              ...obj,
              cacheThrottlingComps
            }
          });


        const validate = this.$valid.all({ modifyHistReason });
        this.inValidForm = !validate;

        if (validate){
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

      onSelectCase (event){
        const value = parseInt(event.target.value);
        const targetCases = this.items.cacheThrottlingCases.filter(({ caseSeq }) => caseSeq !== value);
        const originCases = this.originItems.cacheThrottlingCases;
        if (targetCases.length){
          targetCases.forEach(obj => {
            let originCase = originCases.find(({ caseSeq }) => caseSeq === obj.caseSeq);
            obj.cacheThrottlingComps = JSON.parse(JSON.stringify(originCase.cacheThrottlingComps));
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

      setDefault (item, key) {
        item[key] = item[key] !== '' ? parseInt(item[key]) : 0;
      },

      getHistoryLink (rowId, caseSeq){
        return `#/configuration/edges/cache/${this.id}?histories=${rowId}&caseSeq=${caseSeq}`
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
