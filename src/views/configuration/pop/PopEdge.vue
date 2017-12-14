<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.lowReferrer
        :block="true">
        Low Referrer
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="lowReferrer" visible>
      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="items.lowReferrerList"
          :fields="fields.lowReferrerList"
        >
          <template slot="referrerUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
        </b-table>
      </section>
    </b-collapse>

    <!-- Edge -->
    <div class="collapse-title mt-5">
      <b-button
        variant="secondary"
        v-b-toggle.edge
        :block="true">
        Edge
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="edge" visible>
      <div class="board-btn">
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
      </div>

      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="items.edgeList"
          :fields="fields.edgeList"
        >
          <template slot="edgeRelayYn" scope="row">{{row.value? 'Relay':'Edge'}}</template>
          <template slot="edgeUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
        </b-table>
      </section>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Pop 관리' }"><i class="fa fa-list"></i> 목록</b-button>
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
            rowReferrerId: {label: 'ID'},
            referrerIp: {label: 'IP', 'class': 'text-left'},
            referrerHostName: {label: 'Host Name', 'class': 'text-left'},
            referrerUseYn: {label: '상태'}
          },
          edgeList: {
            edgeId: {label: 'ID'},
            edgeIp: {label: 'IP', 'class': 'text-left'},
            edgeHostName: {label: 'Host Name', 'class': 'text-left'},
            edgeDomainName: {label: 'Domain', 'class': 'text-left'},
            edgeRelayYn: {label: 'Type'},
            edgeUseYn: {label: '상태'}
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
