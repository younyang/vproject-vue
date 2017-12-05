<template>
  <div class="animated fadeIn">
    <b-card class="search">
      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="검색어"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['All','Option 1', 'Option 2', 'Option 3']"
            value="All">
          </b-form-select>
        </b-form-fieldset>
        <b-form-fieldset class="col-sm-7 inline-field">
          <b-form-input type="text" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="Service Type"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['All','Option 1', 'Option 2', 'Option 3']"
            value="All">
          </b-form-select>
        </b-form-fieldset>

        <b-form-fieldset
          class="col-sm-5"
          label="CNAME"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['전체','Option 1', 'Option 2', 'Option 3']"
            value="Please select">
          </b-form-select>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="SSL 인증서"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['All','Option 1', 'Option 2', 'Option 3']"
            value="All">
          </b-form-select>
        </b-form-fieldset>

        <b-form-fieldset
          class="col-sm-5"
          label="사용여부"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['전체','Option 1', 'Option 2', 'Option 3']"
            value="Please select">
          </b-form-select>
        </b-form-fieldset>
      </div>

      <div class="form-group row">
        <b-form-fieldset
          class="col-sm-5"
          label="기간"
          :label-cols="5"
          :horizontal="true">
          <b-form-select
            :plain="true"
            :options="['등록일','수정일']"
            value="All">
          </b-form-select>
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
          <b-button type="button" variant="primary" @click="goCreate">
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
            <template slot="type" scope="row">{{row.value.join(',')}}</template>
            <template slot="cname" scope="row">{{row.value? '사용':'미사용'}}</template>
            <template slot="ssl" scope="row">{{row.value? '사용':'미사용'}}</template>
            <template slot="isActive" scope="row">{{row.value? '사용':'미사용'}}</template>
            <!--template slot="actions" scope="row">
              <b-btn size="sm" @click.stop="details(row.item,row.index,$event.target)">Details</b-btn>
            </template-->
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
  /**
   *
   * @type {[*]}
   */
  const items = [
    { id: 12345, name: 'btv', type: ['VOD','FILE','IMG'], account:'skb', cname: true, ssl: true, createdate: '2017-10-21 12:33:21', modifydate: '2017-10-25 12:33:21', isActive: true },
    { id: 12344, name: 'oksusu', type: ['VOD','FILE'], account:'skb', cname: true, ssl: true, createdate: '2017-10-14 12:33:21', modifydate: '2017-10-15 12:33:21', isActive: true },
    { id: 12343, name: 'test2', type: ['IMG'], account:'skt', cname: false, ssl: false, createdate: '2017-10-12 12:33:21', modifydate: '2017-10-13 12:33:21', isActive: false },
    { id: 12342, name: 'test1', type: ['VOD'], account:'skt', cname: false, ssl: false, createdate: '2017-10-11 12:33:21', modifydate: '2017-10-12 12:33:21', isActive: true }
  ]

  export default {
    name: 'services',
    components: {
      //  ListContent
    },
    data (){
      return {
        fields: {
          id: {label: 'ID'},
          name: {label: 'Service Name', 'class': 'text-left'},
          type: {label: 'Service Type'},
          account: {label: 'Account'},
          cname: {label: 'CNAME'},
          ssl: {label: 'SSL 인증서'},
          createdate: {label: '등록일'},
          modifydate: {label: '수정일'},
          isActive: {label: '사용여부'}
        },
        items: items,
        currentPage: 1,
        perPage: 10,
        totalRows: items.length,
        pageOptions: [{text: 10, value: 10}, {text: 15, value: 15}, {text: 30, value: 30}],
        modalDetails: {index: '', data: ''}
      }
    },

    methods: {
      details (item) {
          this.$router.push(`/service/service/${item.id}`)
      },

      goCreate (){
          this.$router.push('/service/service/create')
      }
    }
  }
</script>

