<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" inline>
      <label>PoP</label>
      <multiselect
        v-model="popId"
        :showLabels="false"
        :searchable="false"
        :options="code.popId"
        :loading="isLoad.popId"
        class="inline"
        track-by="popId"
        label="popName"
        @close="onSelectSearch"
        placeholder="Select PoP"
      ></multiselect>

      <label>Edge</label>
      <span class="form-text">{{this.items.edgeCount}}</span>
    </b-form>


    <div class="row mt-4">
      <!-- List -->
      <div class="col-3">
        <div class="monitor-search">
          <b-form-input type="text" v-model="searchItem.searchKeyword" placeholder="Enter Search text">
          </b-form-input>
          <b-button type="reset" variant="outline-secondary" @click="onReset" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
          <b-button type="button" variant="primary" @click="fetchList" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
        </div>

        <b-table
          show-empty
          :items="datas"
          :fields="fields"
        >
        </b-table>

        <div class="page-btn">
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>
      </div>

      <!-- Thumnail -->
      <div class="col-9">
        <div class="monitorWrap">
          <div class="monitor" v-for="val in [0,1,2,3,4,5,6,7,8,9]">
            <div class="thumb">
              <i v-if="val%2 === 0" class="fa fa-exclamation-triangle"></i>
            </div>
            <span class="title">Edge-0{{ val }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'edgeMonitoring',
    data (){
      return {
        fields: {
          edgeId: {label: 'Edge'},
          ip: {label: 'IP', 'class': 'text-left'},
        },
        datas: [],
        items: {
          popId : null,
          edgeCount : 0
        },
        queryParams: {},
        searchItem: {
          searchKeyword: null,
          popId: null
        },
        code: {
          popId: []
        },
        isLoad: {
          popId: true
        }
      }
    },

    computed: {
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      }
    },

    created (){
      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });
    },

    methods: {
      onSubmit (){

      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
            this.searchItem[key] = null;
        });
        this.queryParams = {};
        this.onSelectSearch();
      },

      fetchList (params = {}){

        this.queryParams = {};

        // UseYn data convert
        Object.keys(this.searchItem).forEach(key => {
          this.queryParams[key] = this.searchItem[key];
        });

        this.queryParams.popId = this.items.popId;
        const defaultParams = {
          q: this.queryParams
        };

        this.$https.get('/edges/monitoring', {...defaultParams, ...params})
          .then((res) => {
            this.items.edgeCount = res.data.items.length;
            this.datas = res.data.items;
            //console.log(res.data.items);
          });
      },

      onSelectSearch (){
        this.$https.get('/edges/monitoring/' + this.items.popId)
          .then((res) => {
            this.items.edgeCount = res.data.items.length;
            this.datas = res.data.items;
            //console.log(res.data.items);
          });
      }

    }
  }
</script>
