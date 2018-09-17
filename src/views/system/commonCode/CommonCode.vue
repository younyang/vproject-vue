<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-row">
        <b-form-fieldset
          label="검색어"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="searchType"
            label="codeName"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchType"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <multiselect
            v-model="searchItem.useYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
      </div>
    </b-form>


    <div class="cache-content">
      <h3 class="cache-title">
        <i class="fa fa-arrow-right"></i>
        <strong>그룹코드</strong>

        <b-button
          type="button"
          variant="in-table"
          class="float-right"
          @click="isShowAddGroup = !isShowAddGroup"
        >등록</b-button>
      </h3>

      <b-collapse id="addGroup" v-model="isShowAddGroup">
        <b-form class="addCodeBox" :validated="inValidGroupForm" novalidate>
          <div class="form-row">
            <b-form-fieldset
              label="그룹코드 명<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addGroupItems.groupCodeName"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <b-form-fieldset
              label="그룹코드<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addGroupItems.groupCode"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <b-form-fieldset
              label="사용여부"
              class="col-1">
              <c-switch
                type="text"
                class="v-switch"
                on="사용"
                off="미사용"
                v-model="addGroupItems.useYn"
              ></c-switch>
            </b-form-fieldset>

            <b-form-fieldset
              label="설명<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addGroupItems.groupCodeDesc"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <div class="add-btn col-2">
              <b-button type="reset" variant="in-table" @click="isShowAddGroup = false;inValidGroupForm = false">취소</b-button>
              <b-button type="button" variant="in-table" @click="onAddGroup">저장</b-button>
            </div>
          </div>
        </b-form>
      </b-collapse>

      <section class="board">
        <ag-grid
          :fields="groupFields"
          :items="groupItems"
          :onRowSelected="onGroupRowSelected"
          :onRowSubmit="onGroupRowSubmit"
        ></ag-grid>
      </section>
    </div>

    <div class="cache-content">
      <h3 class="cache-title">
        <i class="fa fa-arrow-right"></i>
        <strong>공통코드</strong>

        <b-button
          type="button"
          variant="in-table"
          class="float-right"
          :disabled="selectedGroupCode === null"
          @click="isShowAddCode = !isShowAddCode"
        >등록</b-button>
      </h3>

      <b-collapse id="addCode" v-model="isShowAddCode">
        <b-form class="addCodeBox" :validated="inValidCodeForm" novalidate>
          <div class="form-row">
            <b-form-fieldset
              label="공통코드 명<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addCodeItems.codeName"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <b-form-fieldset
              label="공통코드<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addCodeItems.code"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <b-form-fieldset
              label="사용여부"
              class="col-1">
              <c-switch
                type="text"
                class="v-switch"
                on="사용"
                off="미사용"
                v-model="addCodeItems.useYn"
              ></c-switch>
            </b-form-fieldset>

            <b-form-fieldset
              label="설명<i class='require>*</i>"
              class="col-3"
              :invalid-feedback="$valid.msg.require">
              <b-form-input
                v-model="addCodeItems.codeDesc"
                type="text"
                required
              ></b-form-input>
            </b-form-fieldset>

            <div class="add-btn col-2">
              <b-button type="reset" variant="in-table" @click="isShowAddCode = false">취소</b-button>
              <b-button type="button" variant="in-table" @click="onAddCode">저장</b-button>
            </div>
          </div>
        </b-form>
      </b-collapse>

      <section class="board">
        <ag-grid
          :fields="codeFields"
          :items="codeItems"
          :fixHeight="320"
          :dragging="true"
          :onRowSelected="onCodeRowSelected"
          :onRowSubmit="onCodeRowSubmit"
          :onRowDragEnd="onCodeRowDrag"
          :pagination="false"
        ></ag-grid>
      </section>
    </div>
  </div>
</template>

<script>
  import AgGrid from '@/components/Grid';
  import cSwitch from '@/components/Switch'

  export default {
    name: 'commonCode',
    components: {
      AgGrid,
      cSwitch
    },
    data (){
      return {
        groupFields: [
          {
            headerName: '번호',
            field: 'index',
            width: 120
          },
          {
            headerName: '그룹코드 명',
            field: 'groupCodeName',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          {
            headerName: '그룹코드',
            field: 'groupCode',
            cellClass: 'text-left'
          },
          {
            headerName: '사용여부',
            field: 'useYn',
            cellRendererFramework: 'UseYn',
            width: 100
          },
          {
            headerName: '설명',
            field: 'groupCodeDesc',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          { headerName: '등록/수정', field: 'createId' },
          { headerName: '등록일', field: 'createDateTime' },
          { headerName: '수정일', field: 'modifyDateTime' },
          {
            headerName: '관리',
            field: 'action',
            cellRendererFramework: 'EditAction'
          }
        ],
        groupItems: [],

        codeFields: [
          {
            headerName: '번호',
            field: 'index',
            width: 120,
            rowDrag: true
          },
          {
            headerName: '공통코드 명',
            field: 'codeName',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          {
            headerName: '공통코드',
            field: 'code',
            cellClass: 'text-left'
          },
          {
            headerName: '사용여부',
            field: 'useYn',
            cellRendererFramework: 'UseYn',
            width: 100
          },
          {
            headerName: '설명',
            field: 'codeDesc',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          { headerName: '등록/수정', field: 'createId' },
          { headerName: '등록일', field: 'createDateTime' },
          { headerName: '수정일', field: 'modifyDateTime' },
          {
            headerName: '관리',
            field: 'action',
            cellRendererFramework: 'EditAction'
          }
        ],
        codeItems: [],

        queryParams: {},

        selectedGroupCode: null,

        searchItem: {
          searchType: 'groupCode',
          searchKeyword: null,
          useYn: null
        },
        code: {
          searchType: [{
              code: 'groupCode',
              codeName: '그룹코드 명'
            },{
              code: 'commonCode',
              codeName: '공통코드 명'
            }
          ]
        },

        addGroupItems: {
          groupCode: null,
          groupCodeName: null,
          groupCodeDesc: null,
          useYn: false
        },

        addCodeItems: {
          code: null,
          codeName: null,
          codeDesc: null,
          useYn: false,
          codeValChar: '',
          codeValNumber: 0
        },

        inValidGroupForm: false,
        inValidCodeForm: false,

        isShowAddGroup: false,
        isShowAddCode: false
      }
    },

    computed: {
      searchType: {
        get () {
          return this.code.searchType.find(obj => obj.code === this.searchItem.searchType) || null;
        },
        set (newValue) {
          this.searchItem.searchType = newValue !== null ? newValue.code : null;
        }
      },
      searchDateType: {
        get () {
          return this.code.searchDateType.find(obj => obj.code === this.searchItem.searchDateType) || null;
        },
        set (newValue) {
          this.searchItem.searchDateType = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
      this.fetchGroupList();
    },

    methods: {
      fetchGroupList (params = {}){
        this.$https.get('/system/commonGroupCode', {...params})
          .then((res) => {
            this.groupItems = res.data.items;
            this.selectedGroupCode = null;
            this.codeItems = [];
          });
      },

      fetchCodeList (){
        if (this.selectedGroupCode === null){
          return false;
        }
        this.$https.get('/system/commonCode', {
          q: { groupCode: this.selectedGroupCode }
        })
        .then((res) => {
          this.codeItems = res.data.items;
        });
      },

      onSearch (){
        this.queryParams = {};
        /*
        // UseYn data convert
        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== ''){
            this.queryParams[key] = (key === 'useYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
        */
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'groupCode';
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onAddGroup (){
        const { groupCode, groupCodeName, groupCodeDesc } = this.addGroupItems;
        const validate = (this.$valid.all({ groupCode, groupCodeName, groupCodeDesc }));
        this.inValidGroupForm = !validate;
        if (validate){
          this.$https.post(`/system/commonGroupCode`, { ...this.addGroupItems })
            .then(() => {
              this.fetchGroupList();
          });
        }
      },

      onGroupRowSelected (item){
        const { groupCode } = item;
        this.selectedGroupCode = groupCode;
        this.fetchCodeList();
      },

      onGroupRowSubmit (data){
        const { groupCode, groupCodeName, groupCodeDesc, useYn } = data;
        this.$https.put(`/system/commonGroupCode/${groupCode}`, {
          groupCodeName,
          groupCodeDesc,
          useYn
        }).then(() => {
          data.isEdit = false;
          this.fetchGroupList();
        });
      },

      onAddCode (){
        const { code, codeName, codeDesc } = this.addCodeItems;
        const validate = (this.$valid.all({ code, codeName, codeDesc }));
        this.inValidCodeForm = !validate;
        if (validate){
          this.$https.post(`/system/commonCode`, {
            ...this.addCodeItems,
            groupCode: this.selectedGroupCode
          }).then(this.fetchCodeList);
        }
      },

      onCodeRowSelected (){
      },

      onCodeRowSubmit (data){
        const { code, codeName, codeDesc, useYn } = data;
        this.$https.put(`/system/commonCode/${code}`, {
          codeName,
          codeDesc,
          useYn,
          codeValChar: '',
          codeValNumber: 0
        }).then(() => {
          data.isEdit = false;
          this.fetchCodeList();
        });
      },

      onCodeRowDrag (e = {}){
        if (!e || !e.node || (e.node && !e.node.data) || this.selectedGroupCode === null){
          return;
        }
        const { code } = e.node.data;
        const beforeSortNumber = e.node.data.sortNumber;
        const afterSortNumber = (e.overIndex) + 1;
        this.$https.put(`/system/commonCode/${code}/sort`, {
          groupCode: this.selectedGroupCode,
          beforeSortNumber,
          afterSortNumber
        }).then(this.fetchCodeList);

      }

    }
  }
</script>
