<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" inline>
      <label>PoP</label>
      <multiselect
        :showLabels="false"
        :searchable="false"
        :options="[]"
        class="inline"
        placeholder="전체"
      ></multiselect>

      <label>Edge</label>
      <span class="form-text">100</span>
    </b-form>


    <div class="row mt-4">
      <!-- List -->
      <div class="col-3">
        <div class="monitor-search">
          <b-form-input
            type="text">
          </b-form-input>
          <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
          <b-button type="button" variant="primary" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
        </div>

        <b-table
          show-empty
          :items="[]"
          :fields="fields"
        >
        </b-table>

        <div class="page-btn">
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>
      </div>

      <!-- Thumnail -->
      <div class="col-9">
        <div class="monitor-article">
          <dl class="success">
            <dt><i></i> 정상</dt>
            <dd>97</dd>
          </dl>
          <dl class="error">
            <dt><i></i> 장애</dt>
            <dd>3</dd>
          </dl>

          <multiselect
            :showLabels="false"
            :searchable="false"
            :options="[]"
            class="inline"
            label="popName"
            track-by="popId"
            placeholder="전체"
          ></multiselect>
        </div>


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
        items: [],
        code: {
        },
        isLoad: {
        }
      }
    },

    computed: {
    },

    created (){
    },

    methods: {
      onSubmit (){

      }

    }
  }
</script>
