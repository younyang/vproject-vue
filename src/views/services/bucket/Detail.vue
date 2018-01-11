<template>
  <div class="animated fadeIn">
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
        <!-- Bucket Id -->
        <b-form-fieldset
          label="ID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- S3 Bucket Id-->
        <b-form-fieldset
          label="S3 Bucket"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.s3BucketId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- name -->
        <b-form-fieldset
          label="Bucket Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="items.name"
            type="text"
          ></b-form-input>
          <b-form-input
            v-else
            :value="items.name"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="3"
          :horizontal="true">
          <span class="badge badge-success badge-pill">
            {{ items.serviceTypeName }}
          </span>
        </b-form-fieldset>

        <!-- Description -->
        <b-form-fieldset
          label="Description"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-if="isEdit"
            v-model="items.description"
            :rows="6"
          ></b-form-textarea>
          <b-form-textarea
            v-else
            :value="items.description"
            :rows="6"
          ></b-form-textarea>
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
            v-model="items.useYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.useYn ? 'success' : 'secondary'">
            {{ items.useYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>


        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.reason"
            :rows="6">
          </b-form-textarea>
        </b-form-fieldset>

      </b-card>
    </b-collapse>

    <!-- Bucket 사용자 권한 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.authorize
        :block="true">
        Bucket 사용자 권한
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="authorize" v-if="!isEdit" visible>
      <b-card>
        <section class="board">
          <b-table
            striped
            bordered
            hover
            show-empty
            :items="policies.items"
            :fields="policies.fields">
            <template slot="s3UserId" scope="row">
              {{ row.value }} &nbsp;
              <b-button
                type="button"
                size="sm"
                variant="outline-danger"
                class="list-del"
                @click="removeModal(row.value)">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>
          </b-table>
        </section>
        <section class="board-btn">
          <b-button
            type="button"
            size="sm"
            class="mt-2 mb-2"
            variant="outline-primary"
            @click="showUserFind">
            Bucket 관리자 추가
          </b-button>

        </section>
      </b-card>
    </b-collapse>

    <!-- 처리 이력 -->
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
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <!--<b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>-->
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Bucket 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>


    <!-- User Search Modal -->
    <b-modal size="lg" title="사용자 검색" v-model="isModalUserFind">
      <b-form class="searchBox" @reset="onReset">
        <div class="form-in-group">
          <b-form-fieldset
            label="검색어"
            style="width:100%"
            class="inline"
            :horizontal="true">
            <multiselect
              v-model="companyCode"
              label="codeName"
              :showLabels="false"
              :searchable="false"
              :options="users.code.companyCode"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>
          <b-form-fieldset
            label="이름"
            style="width:30%"
            class="inline"
            :horizontal="true">
            <b-form-input type="text" class="keyword" v-model="users.searchItem.searchKeyword"
                          placeholder="Enter Search text"></b-form-input>
          </b-form-fieldset>
        </div>
        <div class="search-btn">
          <b-button type="button" variant="primary" @click="onSearch"><i class="icon-magnifier"></i></b-button>
          <b-button type="reset" variant="outline-secondary"><i class="icon-reload"></i></b-button>
        </div>
      </b-form>

      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="users.items"
          :fields="users.fields"
          @row-clicked="addModal"
        >
        </b-table>
      </section>
      <section class="board-article d-flex justify-content-between">
        <b-pagination
          :value="users.pageInfo.page"
          :total-rows="users.pageInfo.totalCount"
          :per-page="users.pageInfo.size"
          @input="onPagination"
          class="mt-2"
        ></b-pagination>
      </section>

      <div slot="modal-footer">
      </div>
    </b-modal>


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
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i
          class="fa fa-dot-circle-o"></i> 확인
        </b-button>
      </div>
    </b-modal>


    <!-- Message Modal -->
    <b-modal title="Message" size="sm" v-model="users.isModalMessage" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ users.modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button v-if="isUserAdd"
          type="button" size="sm" variant="danger"><i class="fa fa-dot-circle-o" @click="addPolicy"></i> 추가
        </b-button>
        <b-button v-else
          type="button" size="sm" variant="danger"><i class="fa fa-dot-circle-o" @click="removePolicy"></i> 삭제
        </b-button>
        <b-button type="button" size="sm" variant="secondary" @click="closeModal"><i class="fa fa-ban"></i> 취소
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'

  export default {
    name: "detail",
    props: ["id"],
    components: {
      cSwitch
    },

    data: function () {
      return {
        name: 'Bucket 상세',
        originItems: {},
        items: {
          bucketId: null,
          s3BucketId: null,
          name: null,
          description: null,
          serviceTypeCode: null,
          serviceTypeName: null,
          useYn: null,
          createDatetime: null,
          modifyDateTime: null,
          reason: null,
          policies: null
        },
        history: {
          fields: {
            modifyId: {label: '등록/수정자', 'class': 'text-left'},
            modifyDateTime: {label: '등록/수정일시'},
            description: {label: '변경 이력', 'class': 'text-left'},
            reason: {label: '변경 사유', 'class': 'text-left'}
            // histMgmtId: {label: '보기'}
          },
          items: []
        },
        policies: {
          fields: {
            s3UserId: {label: 'Login ID', 'class': 'text-left'},
            createId: {label: '등록/수정자', 'class': 'text-left'},
            createDateTime: {label: '등록/수정일시'}
          },
          items: []
        },
        isLoad: {
          companyCode: true
        },
        users: {
          code: {
            companyCode: []
          },
          fields: {
            companyCode: {label: '회사', 'class': 'text-left'},
            loginId: {label: 'ID', 'class': 'text-left'},
            operatorName: {label: '관리자', 'class': 'text-left'},
            email: {label: 'E-mail', 'class': 'text-left'}
          },
          searchItem: {
            companyCode: null,
            searchKeyword: null,
            bucketId: null
          },
          pageInfo: {
            page: 1,
            size: 5,
            resultCount: 1,
            totalCount: 1
          },
          queryParams: {},
          items: [],
          isModalMessage: false,
          modalMessage: ''
        },
        isEdit: false,
        isUserAdd: false,
        isModalHistory: false,
        isModalUserFind: false,
        isModalService: false,
        isServiceAdd: true,
        modalService: {
          serviceTypeCode: [],
          history: ''
        }
      }
    },

    computed: {
      companyCode: {
        get() {
          return this.users.code.companyCode.find(obj => obj.code === this.users.searchItem.companyCode) || null;
        },
        set(newValue) {
          this.users.searchItem.companyCode = newValue !== null ? newValue.code : null;
        }
      }
    },

    created() {
      const detailUrl = `/origin/bucket/${this.id}`;

      // Detail Data
      this.$https.get(detailUrl, {history: true, policy: true})
        .then((res) => {
          this.items = {...this.items, ...res.data.items};
          this.originItems = JSON.parse(JSON.stringify(this.items));
          this.history.items = JSON.parse(JSON.stringify(res.data.items.histories));
          this.policies.items = JSON.parse(JSON.stringify(res.data.items.policies));
        });

      // Service Type Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'COMPANY'}
      })
        .then((res) => {
          this.isLoad.companyCode = false;
          this.users.code.companyCode = res.data.items;
        });

      this.fetchList();
    },

    methods: {
      onEdit() {
        this.isEdit = true;
      },
      onView() {
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },
      onSubmit() {
        const url = `/origin/bucket/${this.id}`;

        const { name, description, reason, useYn } = this.items;

        this.$https.put(url, { name, description, reason, useYn })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      onDelete() {

      },

      showHistory() {
        this.isModalHistory = true;
      },

      // --- User Methods ---
      showUserFind() {
        this.isModalUserFind = true;
        // this.policies.items.push({'s3UserId':'dustin','permission':'FULL_CONTROL', 'createId':'SYSTEM', 'createDateTime':'2018-01-11 12:17:23'});
      },
      fetchList(params = {}) {
        this.users.queryParams.bucketId = `${this.id}`;
        const defaultParams = {
          page: this.users.pageInfo.page,
          size: this.users.pageInfo.size,
          q: this.users.queryParams
        };
        this.$https.get('/setting/operators', {...defaultParams, ...params})
          .then((res) => {
            this.users.items = res.data.items;
            this.users.pageInfo = res.data.pageInfo;
          });

      },
      onSearch() {
        this.users.queryParams = {};
        Object.keys(this.users.searchItem).forEach(key => {
          if (this.users.searchItem[key] !== null && this.users.searchItem[key] !== '') {
            this.users.queryParams[key] = this.users.searchItem[key];
          }
        });

        this.fetchList({page: 1});
      },
      onPagination(page) {
        this.fetchList({page});
      },
      onReset() {
        Object.keys(this.users.searchItem).forEach((key) => {
          this.users.searchItem[key] = null;
        });
        this.users.queryParams = {};
        this.fetchList({page: 1});
      },
      addModal(item) {
        this.isUserAdd = true;
        this.users.modalMessage = '관리자를 추가 하시겠습니까?';
        this.users.isModalMessage = true;
        this.users.queryParams.loginId = item.loginId;
      },
      closeModal() {
        this.users.isModalMessage = false;
        this.users.modalMessage = '';
        this.users.queryParams.loginId = null;
      },
      addPolicy() {
        const s3UserId = this.users.queryParams.loginId;
        const url = `/origin/bucket/${this.id}/user/${s3UserId}`;

        this.$https.put(url)
          .then((res) => {
            this.policies.items = res.data.items;
            this.users.isModalMessage = false;
            this.isUserAdd = false;
          });
      },
      removeModal(loginId) {
        this.users.modalMessage = '관리자를 삭제 하시겠습니까?';
        this.users.isModalMessage = true;
        this.users.queryParams.loginId = loginId;
      },
      removePolicy() {
        const s3UserId = this.users.queryParams.loginId;
        const url = `/origin/bucket/${this.id}/user/${s3UserId}`;

        this.$https.delete(url)
          .then((res) => {
            this.policies.items = res.data.items;
            this.users.isModalMessage = false;
          });
      }
    }
  }
</script>
