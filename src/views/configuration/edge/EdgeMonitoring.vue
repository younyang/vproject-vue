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
        <!--
        <b-table
          show-empty
          :items="datas"
          :fields="fields"
        >
        </b-table>
      -->
        <table class="table table-striped table-hover">
      		<thead>
      			<tr>
      				<th>
      					<label class="form-checkbox">
          <input type="checkbox" v-model="selectAll" @click="select">
          <i class="form-icon"></i>
        </label>
      				</th>
      				<th>Edge</th>
      				<th>IP</th>
      			</tr>
      		</thead>
      		<tbody>
      			<tr v-for="i in datas">
      				<td>
      					<label class="form-checkbox">
          					<input type="checkbox" :value="i.edgeId" v-model="selected">
      						<i class="form-icon"></i>
        					</label>
      				</td>
      				<td>{{i.edgeId}}</td>
      				<td>{{i.ip}}</td>
      			</tr>
      		</tbody>
      	</table>

        <div class="page-btn">
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>
      </div>

      <!-- Thumnail -->
      <div class="col-9">
        <div class="monitorWrap">
          <div class="monitor" v-for="val in this.items.edgeList">
            <div class="thumb">
              <video class="video-js" autoplay controls preload="auto" data-setup="{}">
                <source :src="'http://'+val.ip+'/demo/clear/tos_360_v.mp4'" type='video/mp4'>
              </video>
            </div>
            <span class="title">{{ val.ip }}/{{ val.hostName }}</span>
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
        selected: [],
		    selectAll: false,
        items: {
          popId : null,
          edgeCount : 0,
          edgeList : []
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
        this.items.edgeList = [];
        if(this.selected.length > 0){
          const edgeIds = this.selected;
          this.$https.put(`/edges/monitoring`, { edgeIds })
            .then((res) => {
              this.items.edgeList = res.data.items;
            })
            .catch((error) => {
              console.log(error);
            });
        }
        //console.log(this.selected.length);
        //console.log(this.selected);
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
      },

      select() {
  			this.selected = [];
  			if (!this.selectAll) {
  				for (let i in this.datas) {
  					this.selected.push(this.datas[i].edgeId);
  				}
  			}
  		}

    }
  }
</script>
