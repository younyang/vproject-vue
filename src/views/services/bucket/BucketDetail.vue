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
        <!-- Bucket Id -->
        <b-form-fieldset
          label="ID"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Bucket Name<i v-if="isEdit" class="require">*</i>
          </template>
          <b-form-input
            v-model="items.name"
            type="text"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- S3 Bucket Id-->
        <b-form-fieldset
          label="S3 Bucket ID"
          :horizontal="true">
          <b-form-input
            :value="items.s3BucketId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          v-if="isEdit"
          :horizontal="true">
          <template slot="label">
            Service Type<i v-if="isEdit" class="require">*</i>
          </template>

          <multiselect
            v-if="isEdit"
            v-model="serviceTypeCode"
            class="noEmpty"
            track-by="code"
            label="codeName"
            :showLabels="false"
            :allowEmpty="false"
            :options="code.serviceTypeCode"
            :loading="isLoad.serviceTypeCode"
            placeholder="Select service type"
          ></multiselect>
          <span
            v-else
            class="badge"
          >{{ items.serviceTypeName }}
          </span>
        </b-form-fieldset>

        <!-- Description -->
        <b-form-fieldset
          label="Description"
          :horizontal="true">
          <b-form-textarea
            v-model="items.description"
            :rows="6"
            :no-resize="!isEdit"
            :disabled="!isEdit"
            :plaintext="!isEdit"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            사용 여부<i v-if="isEdit" class="require">*</i>
          </template>
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.useYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.useYn }"
          >{{ items.useYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="items.reason"
            :rows="6"
            required
          ></b-form-textarea>
        </b-form-fieldset>
      </b-form>
    </b-collapse>


    <!-- Bucket 사용자 권한 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button class="btn-collapse" v-b-toggle.authorize>
        <i class="fa"></i>
        Bucket 사용자 권한
      </b-button>
    </div>

    <b-collapse id="authorize" v-if="!isEdit" visible>
      <b-table
        class="sub"
        show-empty
        :items="policies.items"
        :fields="policies.fields"
      >
        <template slot="HEAD_index" scope="row">
          <span class="ico">
            <button type="button" @click="showUserFind" v-b-tooltip.hover :title="`관리자 추가`"><i class="fa fa-plus-circle"></i></button>
          </span>
        </template>

        <template slot="index" scope="row">
          <span class="ico">
            <button type="button" @click="removeModal(row.item.s3UserId)" v-b-tooltip.hover :title="`관리자 삭제`"><i class="fa fa-times-circle"></i></button>
          </span>
        </template>
      </b-table>
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
            v-if="items.modifyDateTime"
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
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="isModalMessage = true">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Bucket 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>


    <!-- User Search Modal -->
    <b-modal size="lg" title="사용자 검색" v-model="isModalUserFind">
      <b-form class="searchBox" @reset="onReset" inline>
        <label>검색어</label>
        <multiselect
          v-model="companyCode"
          label="codeName"
          :showLabels="false"
          :searchable="false"
          :options="users.code.companyCode"
          placeholder="전체"
        ></multiselect>
        <b-form-input
          type="text"
          class="keyword ml-1"
          v-model="users.searchItem.searchKeyword"
          placeholder="Enter Search text"
        ></b-form-input>

        <div class="search-btn">
          <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
          <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
        </div>
      </b-form>

      <section class="board">
        <b-table
          show-empty
          :items="users.items"
          :fields="users.fields"
          :current-page="users.pageInfo.page"
          :per-page="users.pageInfo.size"
          @row-clicked="addModal"
        >
        </b-table>
      </section>
      <b-pagination
        v-model="users.pageInfo.page"
        :total-rows="users.pageInfo.totalCount"
        :per-page="users.pageInfo.size"
        class="mt-2"
      ></b-pagination>
      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalUserFind = false">확인</b-button>
      </div>
    </b-modal>


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
          <template slot="histMgmtId" scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
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
    <b-modal title="Message" size="sm" v-model="users.isModalMessage" :class="{'modal-error': !isUserAdd}">
      <div class="d-block text-center">
        <p>{{ users.modalMessage }}</p>
      </div>
      <div slot="modal-footer">
        <b-button v-if="isUserAdd" type="button" variant="primary" @click="addPolicy">추가</b-button>
        <b-button v-else type="button" variant="danger" @click="removePolicy">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="closeModal">취소</b-button>
      </div>
    </b-modal>

    <!-- Delete Modal Message -->
    <b-modal title="Message" size="sm" v-model="isModalMessage" class="modal-error">
      <div class="d-block text-center">
        <p>정말 삭제 하시겠습니까?</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="danger" @click="onDelete">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="isModalMessage = false">취소</b-button>
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
            reason: {label: '변경 사유'}
            // histMgmtId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        policies: {
          fields: {
            index: {label: '&nbsp;' },
            s3UserId: {label: 'Login ID', 'class': 'text-left'},
            createId: {label: '등록/수정자', 'class': 'text-left'},
            createDateTime: {label: '등록/수정일시'}
          },
          items: []
        },
        code: {
          serviceTypeCode: []
        },
        isLoad: {
          companyCode: true,
          serviceTypeCode: true
        },
        users: {
          code: {
            companyCode: []
          },
          fields: {
            companyName: {label: '회사', 'class': 'text-left'},
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
        isModalMessage: false,
        modalMessage: '',
        modalService: {
          serviceTypeCode: [],
          history: ''
        },
        state:{
          deleted: false
        },

        inValidForm: false
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
      },
      serviceTypeCode: {
        get() {
          return this.code.serviceTypeCode.find(obj => obj.code === this.items.serviceTypeCode) || null;
        },
        set(newValue) {
          console.log(newValue);
          this.items.serviceTypeCode = newValue !== null ? newValue.code : null;
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
          this.history.items = res.data.items.histories;
          this.policies.items = res.data.items.policies;
      });

      // Service Type Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'COMPANY'}
      })
        .then((res) => {
          this.isLoad.companyCode = false;
          this.users.code.companyCode = res.data.items;
        });

      this.userList();

      // Service Type Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'SERVICE_TYPE'}
      })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items.filter(({code, codeName, codeValChar1}) => {
            const number = code.split('_')[2];
            return !(number.length === 4);
          });
          // default service type code 선택
        });

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
        const { name, serviceTypeCode, description, reason, useYn } = this.items;
        const validate = this.$valid.all({name, serviceTypeCode, description, reason, useYn});
        this.inValidForm = !validate;

        if (validate){
          this.$https.put(url, { name, serviceTypeCode, description, reason, useYn })
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },
      onDelete() {
        const deleteUrl = `/origin/bucket/${this.id}`;

        this.$https.delete(deleteUrl)
          .then((res) => {
            if(res.status === 200)
              this.$router.push({ name: 'Bucket 관리'});
          });
      },

      showHistory() {
        this.isModalHistory = true;
      },

      // --- User Methods ---
      showUserFind() {
        this.isModalUserFind = true;
        // this.policies.items.push({'s3UserId':'dustin','permission':'FULL_CONTROL', 'createId':'SYSTEM', 'createDateTime':'2018-01-11 12:17:23'});
      },
      userList(params = {}) {
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

        this.userList({page: 1});
      },
      onReset() {
        Object.keys(this.users.searchItem).forEach((key) => {
          this.users.searchItem[key] = null;
        });
        this.users.queryParams = {};
        this.userList({page: 1});
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
        this.isUserAdd = false;
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
