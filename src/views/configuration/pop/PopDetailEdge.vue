<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.lowReferrer>
        <i class="fa"></i>
        Low Referrer
      </b-button>
    </div>
    <b-collapse id="lowReferrer" visible>
      <section class="board">
        <b-table
          show-empty
          :items="items.lowReferrerList"
          :fields="fields.lowReferrerList"
        >
          <template slot="referrerUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
        </b-table>
      </section>
    </b-collapse>

    <!-- Edge -->
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.edge>
        <i class="fa"></i>
        Edge
      </b-button>
    </div>
    <b-collapse id="edge" visible>
      <b-form class="searchBox" inline>
        <label>Service</label>
        <multiselect
          class="inline"
          :showLabels="false"
          :searchable="false"
          :options="code.serviceList"
          :loading="isLoad.serviceList"
          label="serviceName"
          style="min-width:130px"
          placeholder="전체"
          @input="onServiceSelect"
        ></multiselect>
      </b-form>

      <section class="board">
        <b-table
          show-empty
          :items="items.edgeList"
          :fields="fields.edgeList"
        >
          <template slot="edgeRelayYn" slot-scope="row">{{row.value? 'Relay':'Edge'}}</template>
          <template slot="edgeUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
        </b-table>
      </section>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Pop 관리' }">목록</b-button>
    </div>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  export default {
    name: 'pops',
    props: ['id'],
    components: {
      ContentHeader
    },

    data (){
      return {
        name: 'Pop 상세',
        fields: {
          lowReferrerList: {
            rowReferrerId: {label: 'ID', thStyle:'width:100px'},
            referrerIp: {label: 'IP', thStyle:'width:200px', 'class': 'text-left'},
            referrerHostName: {label: 'Host Name', 'class': 'text-left'},
            referrerUseYn: {label: '상태', thStyle:'width:120px'}
          },
          edgeList: {
            edgeId: {label: 'ID', thStyle:'width:100px'},
            edgeIp: {label: 'IP', thStyle:'width:200px', 'class': 'text-left'},
            edgeHostName: {label: 'Host Name', 'class': 'text-left'},
            edgeDomainName: {label: 'Domain', thStyle:'width:150px', 'class': 'text-left'},
            edgeRelayYn: {label: 'Type', thStyle:'width:120px'},
            edgeUseYn: {label: '상태', thStyle:'width:120px'}
          }
        },
        items: {
          popName: "",
          lowReferrerList: [],
          edgeList: []
        },
        code: {
          serviceList: [{
            serviceId: 1,
            serviceName: 'oksusu'
          },{
            serviceId: 2,
            serviceName: 'btv'
          }]
        },
        isLoad: {
          serviceList: true,
        }
      }
    },

    created (){
      // Detail Data
      this.$https.get(`/pops/${this.id}`)
        .then((res) => {
          this.items.popName = res.data.items.popName;
          this.items.lowReferrerList = res.data.items.lowReferrerList;
          this.items.edgeList = res.data.items.edgeList;
        });


      this.isLoad.serviceList = false;
    },

    methods: {
      onServiceSelect (obj){
        console.log(obj.serviceId)
      }
    }
  }
</script>
