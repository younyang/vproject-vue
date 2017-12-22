<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        IP Restriction
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
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
            v-model="items.ipRestrictUseYn"
            :pill="true"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.ipRestrictUseYn ? 'success' : 'secondary'">
            {{ items.ipRestrictUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- IP 주소 -->
        <b-form-fieldset
          v-if="items.ipRestrictUseYn"
          label="IP 주소 *"
          description="※ 192.168.0.* 또는 172.16.0.0/12<br>
          ※ 2001:db8::1 또는 2001:db8::/64"
          :label-cols="3"
          :horizontal="true">
          <b-button
            type="button"
            size="sm"
            class="mt-2 mb-2"
            v-if="isEdit"
            variant="outline-primary"
            @click="onAddRestrict">
            <i class="fa fa-plus"></i> 추가
          </b-button>
          <ul class="icons-list" :class="{'list-noIcon' : isEdit }">
            <li v-for="(ip, index) in items.ipRestrictGlobal">
              <i class="bg-primary" v-if="!isEdit">{{ ip.ipRestrictGlobalSeq }}</i>
              <div class="desc">
                <small>서버 IP 주소</small>
                <div class="title">
                  <b-form-input
                    v-model="ip.ip"
                    type="text"
                    :plaintext="!isEdit"
                  ></b-form-input>
                </div>
              </div>
              <div class="value" v-if="index > 0">
                <div class="small text-muted">&nbsp;</div>
                <b-button
                  v-if="isEdit"
                  type="button"
                  size="sm"
                  variant="outline-danger"
                  class="list-del"
                  @click="onDelRestrict(index)">
                  <i class="fa fa-trash"></i>
                </b-button>
              </div>
            </li>
          </ul>
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
            :rows="6"
          ></b-form-textarea>
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
          v-if="!isEdit"
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
  import cSwitch from '@/components/Switch'
  export default {
    name: 'policy',
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Service 상세',
        originItems: {},
        items: {
          ipRestrictUseYn : false,
          ipRestrictGlobal: [{
            ipRestrictId: null,
            ipRestrictGlobalSeq: null,
            ip: null
          }],
          createDateTime: "",
          createId: "",
          modifyDateTime: "",
          modifyId: "",
          modifyHistReason: ""
        },
        code: {
          ipRestriction: []
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

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    created (){
      // IP Restriction
      this.$https.get('/policy/ipRestriction')
        .then((res) => {
          this.items = res.data.items;
        });
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems))
      },

      onAddRestrict (){
        this.items.ipRestrictGlobal.push({
          ip: ''
        });
      },

      onDelRestrict (index){
        this.items.ipRestrictGlobal.splice(index, 1);
      },

      onSubmit (){
        const ipRestrictGlobal = this.items.ipRestrictGlobal.map(({ ip }) => ({ ip }));
        const { ipRestrictUseYn, modifyHistReason } = this.items;


        const items = { ipRestrictUseYn, ipRestrictGlobal, modifyHistReason };
        this.$https.put('/policy/ipRestriction', items)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}/ip?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/restriction/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
