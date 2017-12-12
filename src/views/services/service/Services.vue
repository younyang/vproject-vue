<template>
  <div class="animated fadeIn">
    <b-card class="search">
      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="검색어"
          :label-cols="5"
          :searchable="false"
          :horizontal="true">
          <multiselect
            v-model="searchData.searchCategory"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['Service Name', 'Account']"
            placeholder=""
          ></multiselect>

        </b-form-fieldset>
        <b-form-fieldset class="col-sm-7 inline-field">
          <b-form-input type="text" v-model="searchData.searchText" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="Service Type"
          :label-cols="5"
          :horizontal="true">
          <multiselect
            v-model="serviceType"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceType"
            :loading="isLoad.serviceType"
            label="codeName"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          class="col-sm-5"
          label="CNAME"
          :label-cols="5"
          :horizontal="true">
          <multiselect
            v-model="searchData.cnameUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="SSL 인증서"
          :label-cols="5"
          :horizontal="true">
          <multiselect
            v-model="searchData.sslCertUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          class="col-sm-5"
          label="사용여부"
          :label-cols="5"
          :horizontal="true">
          <multiselect
            v-model="searchData.serviceUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="기간"
          :label-cols="5"
          :horizontal="true">
          <multiselect
            v-model="searchData.dateCategory"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['등록일','수정일']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
        <b-form-fieldset class="col-sm-7 form-inline inline-field date-field">
          <b-form-input type="date"></b-form-input> ~
          <b-form-input type="date"></b-form-input>

          <b-button-group size="sm">
            <b-button variant="outline-primary">1개월</b-button>
            <b-button variant="outline-primary">3개월</b-button>
            <b-button variant="outline-primary">전체</b-button>
          </b-button-group>
        </b-form-fieldset>

      </div>
      <div slot="footer">
        <b-button type="submit" size="sm" variant="primary"><i class="fa fa-search"></i> Search</b-button>
        <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
      </div>
    </b-card>

    <div class="row">
      <div class="col">
        <section class="board-btn">
          <b-button type="button" variant="success">
            <i class="icon-cloud-download"></i>
            엑셀 다운로드
          </b-button>
          <b-button type="button" variant="primary" :to="{ name: 'Service 등록' }">
            <i class="icon-pencil"></i>
            등록
          </b-button>
        </section>

        <section class="board">
          <b-table
            striped
            bordered
            hover
            responsive
            show-empty
            :items="items"
            :fields="fields"
            @row-clicked="details"
          >
            <template slot="id" scope="row">{{ row.value.slice(0,3) }}...</template>
            <template slot="serviceTypeCode" scope="row">
              <span class="badge badge-pill badge-success" v-for="val in row.value">
                {{ getTypeCodeName(val) }}
              </span>
            </template>
            <template slot="cnameUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
            <template slot="sslCertUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
            <template slot="serviceUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
          </b-table>
        </section>

        <section class="board-article d-flex justify-content-between">
          <b-form inline>
            <b-form-select size="sm" :plain="true" :options="pageOptions" v-model="perPage" />
            <label class="ml-sm-2">Row Per Page</label>
          </b-form>

          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="mt-2" />
        </section>


      </div>
    </div><!--/.row-->


  </div>
</template>

<script>
  import db from '@/firebaseInit'

  export default {
    name: 'services',
    components: {
      //  ListContent
    },
    data (){
      return {
        fields: {
          id: {label: 'ID'},
          serviceName: {label: 'Service Name', 'class': 'text-left'},
          serviceTypeCode: {label: 'Service Type'},
          accountId: {label: 'Account'},
          cnameUseYn: {label: 'CNAME'},
          sslCertUseYn: {label: 'SSL 인증서'},
          createDateTime: {label: '등록일'},
          modifyDateTime: {label: '수정일'},
          serviceUseYn: {label: '사용여부'}
        },
        items: [],
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [{text: 10, value: 10}, {text: 15, value: 15}, {text: 30, value: 30}],

        searchData: {
          searchCategory: 'Service Name',
          searchText: null,
          serviceType: null,
          cnameUseYn: null,
          sslCertUseYn: null,
          createDateTime: null,
          modifyDateTime: null,
          dateCategory: '등록일'
        },
        code: {
          serviceType: []
        },
        isLoad: {
          serviceType: false
        }
      }
    },

    computed: {
      serviceType: {
        get () {
          return this.searchData.serviceTypeCode !== null
            ? this.code.serviceType.find(obj => obj.code === this.searchData.serviceTypeCode)
            : null;
        },
        set (newValue) {
          this.searchData.serviceTypeCode = newValue !== null
            ? newValue.code
            : null;
        }
      },
    },

    created (){
      this.$https.get('/services')
        .then((res) => {
          this.items = res.data;
          this.totalRows = res.data.length;
        });
      this.$https.get('/system/commonCode/serviceType')
        .then((res) => {
          this.isLoad.serviceType = false;
          this.code.serviceType = res.data;
        });
    },

    methods: {
      details (item) {
          this.$router.push({ name: 'Service 상세', params: { id: item.id }})
      },

      getTypeCodeName (val){
        let codeObj = this.code.serviceType.find(obj => obj.code === val);
        return codeObj ?  codeObj.codeValChar1 : val
      }
    }
  }
</script>

