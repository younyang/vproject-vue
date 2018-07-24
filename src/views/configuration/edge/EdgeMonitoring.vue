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

    <div class="row mt-2">
      <div class="col-3">
        <multiselect
          v-model="filePath"
          :showLabels="false"
          :searchable="false"
          :options="code.filePath"
          :loading="isLoad.filePath"
          track-by="path"
          label="title"
          placeholder="Select File Path"
        ></multiselect>
      </div>
    </div>

    <div class="row mt-3">
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
          <b-button type="button" variant="primary" @click="onSubmit">보기</b-button>
        </div>
      </div>

      <!-- Thumnail -->
      <div class="col-9">
        <div class="monitorWrap">
          <div class="monitor" v-for="val in this.items.edgeList">
            <div class="thumb">
              <video class="video-js" controls autoplay preload="auto" data-ip="1.255.146.27"></video>
              <!-- <video class="video-js" controls autoplay preload="auto" :data-ip="val.ip"></video> -->
            </div>
            <span class="title">{{ val.ip }}/{{ val.hostName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*
  TODO: 수정 필요
    1. 컨텐츠 리스트
    2. Edge ip

    정책 및 기획 확인 후 추가 작업 예정
  */
  import shaka from 'shaka-player'
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
          edgeList : [],
          filePath: null
        },
        queryParams: {},
        searchItem: {
          searchKeyword: null,
          popId: null
        },
        code: {
          popId: [],
          filePath: []
        },
        isLoad: {
          popId: true,
          filePath: true
        },
        videoProtocol: 'https://',
        licenseUrl: 'https://drm.kr.btv.into.guru/drm/v0.1/license/widevine'
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
      },
      filePath: {
        get () {
          return this.code.filePath.find(obj => obj.path === this.items.filePath) || null;
        },
        set (newValue) {
          this.items.filePath = newValue !== null ? newValue.path : null;
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

      // file path List
      this.isLoad.filePath = false;
      this.code.filePath = [
        {
            title: '토이스토리3',
            path: '/vod-test-bucket/55/master.m3u8'
        },{
            title: '킬러의 보디가드',
            path: '/vod-test-bucket/M_341278_[프리미어]킬러의-보디가드[UHD]_0/M_341278_[프리미어]킬러의-보디가드[UHD]_0_[TV-UHD]_171020_TV[SD-S]/master.m3u8'
        }
      ]
      // shaka initialize
      shaka.polyfill.installAll()
      if (!shaka.Player.isBrowserSupported()) {
        console.error('Browser not supported!')
      }
    },
    methods: {
      onSubmit (){
        this.items.edgeList = [];
        if (this.selected.length > 0 && this.filePath) {
          var searchFilePath = this.filePath.path
          const edgeIds = this.selected;
          this.$https.put(`/edges/monitoring`, { edgeIds })
            .then((res) => {
              this.items.edgeList = res.data.items;
              this.$nextTick(function() {
                var videos = document.getElementsByClassName('video-js')
                Array.prototype.forEach.call(videos, video => {
                  var player = new shaka.Player(video)
                  window.player = player
                  // Listen for error events.
                  player.addEventListener('error', this.onErrorEventFromShaka)
                  player.configure({
                    drm: {
                      servers: {
                        'com.widevine.alpha': this.licenseUrl
                      }
                    }
                  })
                  player.load(this.videoProtocol + video.dataset.ip + '/' + searchFilePath).then(function () {
                    // This runs if the asynchronous load is successful.
                    console.log('The video has now been loaded!')
                  }).catch(this.onErrorFromShaka)
                })
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert('Edge와 컨텐츠를 선택 해주세요.');
        }
        //console.log(this.selected.length);
        //console.log(this.selected);
      },

      onErrorEventFromShaka: function(event) {
        this.onErrorFromShaka(event.detail)
      },

      onErrorFromShaka: function(error) {
        console.error('Error code', error.code, 'object', error)
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
