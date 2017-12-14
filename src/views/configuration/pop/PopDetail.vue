<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
      :name="name">
    </content-header>

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
        <!-- PoP Id -->
        <b-form-fieldset
          v-if="!isEdit"
          label="PoP ID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP Name -->
        <b-form-fieldset
          label="PoP Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.popName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name(Prefix)"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.popHostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :label-cols="3"
          :horizontal="true">
          <span class="domain-text">
            http(s)://[edge].[content type].<strong class="text-danger">{{ items.popDomainName }}</strong>.[country].[service type].[service name].vessels.com
          </span>
        </b-form-fieldset>

        <!-- 구분
        <b-form-fieldset
          label="구분"
          :label-cols="3"
          :horizontal="true">
          <b-form-checkbox v-model="items.referrerYn">Low Referrer</b-form-checkbox>
          <b-form-checkbox v-model="items.highReferrerYn">High Referrer</b-form-checkbox>
        </b-form-fieldset>
        -->

        <!-- 주소 :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          label="주소"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-model="popCtprvnCode"
            class="inline"
            :showLabels="false"
            :searchable="false"
            :options="code.popCtprvnCode"
            :loading="isLoad.popCtprvnCode"
            :disabled="!isEdit"
            :class="{'view-type': !isEdit}"
            label="addressCodeName"
            style="min-width:130px"
            placeholder="선택"
            @input="onFirstAddress"
          ></multiselect>
          <multiselect
            v-if="popCtprvnCode"
            v-model="popSigCode"
            :showLabels="false"
            :searchable="false"
            :options="code.popSigCode"
            :loading="isLoad.popSigCode"
            label="addressCodeName"
            placeholder="선택"
            class="inline"
            style="min-width: 130px"
          ></multiselect>
        </b-form-fieldset>

        <!-- 주소 :: View -->
        <b-form-fieldset
          label="주소"
          :label-cols="3"
          :horizontal="true"
          v-else>
          <b-form-input
            :value="items.popAddress"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="품질솔루션팀"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-if="isEdit"
            v-model="popQualityTeamCode"
            :showLabels="false"
            :searchable="false"
            :options="code.qualitySolutionTeamCode"
            :loading="isLoad.qualitySolutionTeamCode"
            label="codeName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.popQualityTeamName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>


        <!-- Service Name -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Service"
          :label-cols="3"
          :horizontal="true">
          <span class="badge badge-success badge-pill" v-for="name in serviceNames">
            {{ name }}
          </span>
        </b-form-fieldset>


        <!-- Bandwidth -->
        <b-form-fieldset
          label="Bandwidth"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="items.bandwidth"
            type="text"
            class="w-25"
          ></b-form-input>
          <b-form-input
            v-else
            :value="items.bandwidth"
            type="text"
            class="w-25"
            plaintext
          ></b-form-input>
        </b-form-fieldset>


        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.popUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.popUseYn ? 'success' : 'secondary'">
            {{ items.popUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            :rows="6">
          </b-form-textarea>
        </b-form-fieldset>
      </b-card>
    </b-collapse>

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
        <!-- 배포상태 -->
        <b-form-fieldset
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.status ? '성공' : '실패'"
            style="width:30px"
            plaintext
            type="text"></b-form-input>
          (<a href="#">{{ deploy.count }}</a>)
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
      <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" size="sm" variant="danger" class="float-left" @click="onDelete"><i class="fa fa-times"></i> 삭제</b-button>
      <b-button type="button" size="sm" variant="outline-primary">배포</b-button>
      <b-button type="button" size="sm" variant="outline-primary" @click="showHistory">이력관리</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
      <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Pop 관리' }"><i class="fa fa-list"></i> 목록</b-button>
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
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
      </div>
    </b-modal>

    <!-- Message Modal -->
    <b-modal ref="messageModalRef" title="Message" size="sm" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="danger" @click="onDeleteData"><i class="fa fa-dot-circle-o"></i> 삭제</b-button>
        <b-button type="button" size="sm" variant="secondary" @click="hideMessage"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'pops',
    props: ['id', 'histories'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Pop 상세',
        items: {
          popName: "",
          popHostName: "",
          popDomainName: "",
          popCtprvnCode: "",
          popSigCode: "11230",
          popAddress: "",
          popQualityTeamCode: "",
          popQualityTeamName: "",
          bandwidth: 0,
          popUseYn: true,
          serviceNames: "",
          lowReferrerList: [],
          edgeList: []
        },
        code: {
          popCtprvnCode: [],
          popSigCode: [],
          qualitySolutionTeamCode: []
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
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          qualitySolutionTeamCode: true
        },
        isEdit: false,
        isModalHistory: false,
        modalMessage: '',

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
      popCtprvnCode: {
        get () {
          return this.code.popCtprvnCode.find(obj => obj.addressCode === this.items.popCtprvnCode) || null;
        },
        set (newValue) {
          this.items.popCtprvnCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popSigCode: {
        get () {
          return this.code.popSigCode.find(obj => obj.addressCode === this.items.popSigCode) || null;
        },
        set (newValue) {
          this.items.popSigCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popQualityTeamCode: {
        get () {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.items.popQualityTeamCode) || null;
        },
        set (newValue) {
          this.items.popQualityTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      serviceNames (){
        return this.items.serviceNames !== null ? this.items.serviceNames.split(',') : []
      }
    },

    created (){
      // History
      const historyId = window.location.hash.split('?histories=')[1];
      const detailUrl = historyId !== undefined ? `/pops/${this.id}/histories/${historyId}` : `/pops/${this.id}`;

      // 주소 Code
      this.fetchAddress();

      // 품질솔루션팀 Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'QUALITY_TEAM' }
        })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = res.data.items;

          if (this.items.popCtprvnCode !== ''){
            this.fetchAddress(this.items.popCtprvnCode);
          }
        });

    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
      },

      onSubmit (){
        const items = {};
          Object.keys(this.items).forEach(key => {
              if (key === 'popQualityTeamCode') {
                items['qualitySolutionTeamCode'] = this.items[key];
              }else{
                items[key] = this.items[key];
              }
          });

        this.$https.put(`/pops/${this.id}`, items)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.showMessage();
      },

      onDeleteData (){
        this.$https.delete(`/pops/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Pop 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onFirstAddress (obj){
        this.fetchAddress(obj.addressCode)
      },

      fetchAddress (param =''){
        this.$https.get('/pops/address', {
          firstDepth: param
        })
          .then((res) => {
            if (param === ''){
              this.isLoad.popCtprvnCode = false;
              this.code.popCtprvnCode = res.data.items;
            } else {
              this.isLoad.popSigCode = false;
              this.code.popSigCode = res.data.items;
            }
          });
      },

      getHistoryLink (rowId){
        return `#/configuration/pop/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/pops/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      showMessage () {
        this.$refs.messageModalRef.show()
      },
      hideMessage () {
        this.$refs.messageModalRef.hide()
      }
    }
  }
</script>
