<template>
  <div class="animated fadeIn">
    <content-header
      :title="hostName"
      :small="ip"
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
        <!-- Disk size -->
        <b-form-fieldset
          label="Disk size"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.diskSize"
            type="text"
            class="inline"
            style="width: 80px"
            plaintext
          ></b-form-input>
          GB
        </b-form-fieldset>

        <!-- List -->
        <b-form-fieldset
          label="&nbsp;"
          :label-cols="3"
          :horizontal="true">

          <b-button
            type="button"
            size="sm"
            class="mt-2 mb-2"
            v-if="isEdit"
            variant="outline-primary"
            @click="onAddList">
            <i class="fa fa-plus"></i> 추가
          </b-button>

          <ul class="icons-list">
            <li v-for="(comp, index) in items.coreConfigCompList">
              <i class="bg-primary">{{ comp.edgeCoreConfigCompSeq }}</i>
              <div class="desc edge">
                <small>Disk mounts path</small>
                <div class="title">
                  <b-form-input
                    v-model="comp.diskMountPath"
                    type="text"
                    class="sm"
                    :plaintext="!isEdit"
                  ></b-form-input>
                </div>
              </div>
              <div class="value text-left" style="width: 145px">
                <div class="small text-muted">Disk Size</div>
                <b-form-input
                  v-model="comp.diskMountSize"
                  type="text"
                  class="inline sm"
                  style="width: 80px"
                  :plaintext="!isEdit"
                ></b-form-input>
                GB
                <b-button
                  v-if="isEdit && index > 0"
                  type="button"
                  size="sm"
                  variant="outline-danger"
                  class="list-del"
                  @click="onDelList(index)">
                  <i class="fa fa-trash"></i>
                </b-button>
              </div>
            </li>
            <li style="min-height: 59px">
              <div class="value text-left" style="width: 145px">
                <div class="small text-muted">Total</div>
                <b-form-input
                  :value="total"
                  type="text"
                  class="inline sm"
                  style="width: 80px"
                  plaintext
                ></b-form-input>
                GB
              </div>
            </li>
          </ul>
        </b-form-fieldset>

        <!-- 적용여부 -->
        <b-form-fieldset
          v-if="!isEdit"
          label="적용여부"
          :label-cols="3"
          :horizontal="true">
          <b-badge
            pill
            :variant="items.edgeCoreConfigApplyYn ? 'success' : 'secondary'">
            {{ items.edgeCoreConfigApplyYn ? '적용' : '미적용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- JSON -->
        <b-form-fieldset
          v-if="!isEdit"
          label="JSON"
          :label-cols="3"
          :horizontal="true">
          <pre class="code" style="height:200px">{{ items.edgeCoreConfigRequestData }}</pre>
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
      <b-button type="button" size="sm" variant="outline-primary" @click="showHistory">이력관리</b-button>
      <b-button type="button" size="sm" variant="outline-primary">배포</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
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

  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'edge',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Edge 상세',
        hostName: '',
        ip: '',
        originItems: {},
        items: {
          edgeCoreConfigId: 1,
          edgeId: 5,
          processId: null,
          edgeCoreConfigRequestData: "",
          coreConfigCompList: [{
            diskMountSize: 0
          }],
          diskSize: 1000,
          edgeCoreConfigApplyYn: false,
          modifyHistReason : ""
        },
        code: {
          popId: [],
          serviceTypeCode: []
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
          popId: true,
          serviceTypeCode: true
        },
        isEdit: false,
        isCreate: false,
        isModalHistory: false,

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
      total (){
        return this.items.coreConfigCompList
            .map(({diskMountSize}) => parseInt(diskMountSize))
            .reduce((p, n) => p + n)
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/cores/histories/${historyId}` : `/edges/${this.id}/cores`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // Default Data
      this.$https.get(`/edges/${this.id}`)
        .then((res) => {
          const { hostName, ip } = res.data.items;
          this.hostName = hostName;
          this.ip = ip;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          const json = JSON.parse(res.data.items.edgeCoreConfigRequestData);
          this.items = {
            ...this.items,
            ...res.data.items,
            edgeCoreConfigRequestData: JSON.stringify(json, null, 4)
          };
          this.originItems = JSON.parse(JSON.stringify(this.items));
        })
        .catch(() => {
          this.isCreate = true;
          this.isEdit = true
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
        const coreConfigCompList = this.items.coreConfigCompList.map(({ diskMountPath, diskMountSize }) => ({
          diskMountPath,
          diskMountSize
        }));
        const { modifyHistReason } = this.items;

        if (this.isCreate){
          this.$https.post(`/edges/${this.id}/cores`, { coreConfigCompList, modifyHistReason })
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }else{
          this.$https.put(`/edges/${this.id}/cores`, { coreConfigCompList, modifyHistReason })
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }

      },

      onAddList (){
        this.items.coreConfigCompList.push({
          edgeCoreConfigCompSeq: this.items.coreConfigCompList.length,
          diskMountPath: '',
          diskMountSize: 0
        });
      },

      onDelList (index){
        this.items.coreConfigCompList.splice(index, 1);
      },

      getHistoryLink (rowId){
        return `#/configuration/edge/${this.id}/core?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/edges/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
