<template>
  <div class="animated fadeIn">
    <content-header
      :title="hostName"
      :small="ip"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Disk size
        <b-form-fieldset
          label="Disk size"
          :horizontal="true">
          <span class="form-text-alone">{{ items.diskSize }}</span> GB
        </b-form-fieldset>
        -->
        <!-- List
        <b-form-fieldset
          label="&nbsp;"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :foot-clone="isEdit"
            :items="items.coreConfigCompList"
            :fields="{
            index: {label: '번호', 'class': 'index'},
            diskMountPath: {label: 'Disk mounts path<i class=\'require\'>*</i>', 'class': 'text-left'},
            diskMountSize: {label: 'Disk Size<i class=\'require\'>*</i>', 'class': 'text-right', 'thStyle': 'width: 200px'}
          }"
          >
            <template slot="index" slot-scope="row">
              {{ row.index + 1 }}
            </template>
            <template slot="diskMountPath" slot-scope="row">
              <span v-if="isEdit">
                <b-form-input
                  v-model="row.item.diskMountPath"
                  type="text"
                  required
                ></b-form-input>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </span>
              <span v-else>{{ row.value }}</span>
            </template>
            <template slot="diskMountSize" slot-scope="row">
              <span v-if="isEdit">
                <cleave
                  class="form-control"
                  style="width: 100px;"
                  v-model.number="row.item.diskMountSize"
                  :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
                  @input="setDefault(row.item, 'diskMountSize')"
                ></cleave>
                GB
                <span class="ico">
                  <button type="button" v-if="row.index === 0" @click="onAddRow"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="row.index > 0" @click="onDelRow(row.index)"><i class="fa fa-times-circle"></i></button>
                </span>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </span>
              <span v-else>{{ row.value }} GB</span>
            </template>

            <template slot="FOOT_index" slot-scope="data">
              &nbsp;
            </template>
            <template slot="FOOT_diskMountPath" slot-scope="data">
              <span class="total-title">total</span>
            </template>
            <template slot="FOOT_diskMountSize" slot-scope="data">
              <span class="total-text"><strong class="text-danger">{{ total }}</strong> GB</span>
            </template>
          </b-table>
        </b-form-fieldset>
        -->

        <!-- Edge 구분 :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Edge 구분<i class="require">*</i>
          </template>

          <multiselect
            v-model="edgeTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.edgeTypeCode"
            :loading="isLoad.edgeTypeCode"
            :class="{'invalid': !valid.edgeTypeCode }"
            track-by="code"
            label="codeName"
            class="inline"
            style="width:156px"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- Edge 구분 :: View -->
        <b-form-fieldset
          label="Edge 구분"
          :horizontal="true"
          v-else>
          <b-form-input
            :value="items.edgeTypeCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Json File Upload :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          label="Config 파일"
          :horizontal="true">
          <input type="file" v-on:change="fileOnChange"/>
        </b-form-fieldset>

        <!-- Json :: Edit -->
        <b-form-fieldset
          v-if="isEdit&&!isFirstEdit"
          :invalid-feedback="$valid.msg.require"
          label="Config JSON"
          :horizontal="true">
          <template slot="label">
            Config JSON<i class="require">*</i>
          </template>
          <b-table
            class="sub"
            show-empty
            :items="configJson.headers">
            <template slot="new" slot-scope="row">
              <pre class="code left text-left" style="height:380px" id="newJson">{{ items.originalConfigTextAlignmentView }}</pre>
            </template>
            <template slot="old" slot-scope="row">
              <pre class="code right text-left" style="height:380px" id="oldJson">{{ items.originalConfigTextAlignmentView }}</pre>
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- Json :: First Edit -->
        <b-form-fieldset
          v-if="isEdit&&isFirstEdit"
          :invalid-feedback="$valid.msg.require"
          label="Config JSON"
          :horizontal="true">
          <template slot="label">
            Config JSON<i class="require">*</i>
          </template>
          <pre class="code left text-left form-control"
          style="height:380px !important; max-width:100% !important"
          id="newJson"
          :class="{'is-invalid': !valid.originalConfigText }"></pre>
        </b-form-fieldset>

        <!-- 적용여부 -->
        <b-form-fieldset
          v-if="!isEdit"
          label="적용여부"
          :horizontal="true">
          <span
            class="badge"
            :class="{'primary' : items.edgeCoreConfigApplyYn }">
            {{ items.edgeCoreConfigApplyYn ? '적용' : '미적용' }}
          </span>
        </b-form-fieldset>

        <!-- Json :: View -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Config JSON"
          :horizontal="true">
          <pre class="code" style="height:330px">{{ items.originalConfigTextAlignmentView }}</pre>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            required
            :rows="6">
          </b-form-textarea>
        </b-form-fieldset>
      </b-form>
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

        <!-- 배포상태 -->
        <b-form-fieldset
          v-if="items.processId"
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            :value="items.processStateCodeName"
          >
          <a :href="`#/workflow/service/${ items.processId }`" class="btn btn-in-table" target="_blank">{{ items.processId }}</a>
        </b-form-fieldset>
        <b-form-fieldset
          v-if="!items.processId&&!isHistory"
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            value="대기"
          >
        </b-form-fieldset>
      </b-form>
    </b-collapse>



    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <div class="page-btn" v-else>
      <span v-if="isProcessComplete">
        <b-button type="button" variant="outline-secondary" @click="onDeploy">배포</b-button>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
      </span>
      <span v-else>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      </span>
    </div>

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
          <template slot="histMgmtId" slot-scope="row">
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

  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  import jdc from '../../../jsonDifferentCompare'
  export default {
    name: 'edgeCoreConfigDetail',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Edge 상세',
        hostName: '',
        ip: '',
        newJsonObject: '',
        oldJsonObject: '',
        configJson: {
          headers: [{
              new: null,
              old: null
          }]
        },
        originItems: {},
        items: {
          edgeCoreConfigId: 0,
          edgeId: 0,
          edgeTypeCode: null,
          originalConfigText: null,
          originalConfigTextAlignmentView: null,
          edgeCoreConfigApplyYn: false,
          modifyHistReason : "",
          processStateCodeName: null,
          processStateCode: null,
          processId: null
        },
        code: {
          edgeTypeCode: []
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          edgeTypeCode: true
        },
        isEdit: false,
        isFirstEdit: false,
        isCreate: false,
        isModalHistory: false,
        isOriginalConfigTextValidateFlag: false,
        isHistory: false,

        inValidForm: false
      }
    },

    computed: {
      /*
      total (){
        return this.items.coreConfigCompList
            .map(({diskMountSize}) => parseInt(diskMountSize))
            .reduce((p, n) => p + n)
      },
      */
      edgeTypeCode: {
        get () {
          return this.code.edgeTypeCode.find(obj => obj.code === this.items.edgeTypeCode) || null;
        },
        set (newValue) {
          this.items.edgeTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      isProcessComplete (){
        return this.items.processId === null || (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      },
      // validate
      valid (){
        return {
          edgeTypeCode: this.items.edgeTypeCode !== null,
          originalConfigText: this.items.originalConfigText !== null || !this.isOriginalConfigTextValidateFlag
        }
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/cores/histories/${historyId}` : `/edges/${this.id}/cores`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
        this.isHistory = true
      }

      // Default Data
      this.$https.get(`/edges/${this.id}`)
        .then((res) => {
          const { hostName, ip } = res.data.items;
          this.hostName = hostName;
          this.ip = ip;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then(res => {
          if (res.data.items === null){
            this.isCreate = true;
            this.isEdit = true;
            this.isFirstEdit = true
          }else{
            const originalJson = JSON.parse(res.data.items.originalConfigText);
            this.items = {
              ...this.items,
              ...res.data.items,
              originalConfigText: JSON.stringify(originalJson),
              originalConfigTextAlignmentView: JSON.stringify(originalJson, null, 4)
            };
            this.oldJsonObject = originalJson
            this.originItems = JSON.parse(JSON.stringify(this.items));
          }
        })
        .catch(error => {
          console.log(error);
        });

      // Edge Type List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'EDGE_TYPE' }
        })
        .then((res) => {
          this.isLoad.edgeTypeCode = false;
          this.code.edgeTypeCode = res.data.items;
        });
    },

    methods: {
      fileOnChange: function(fileOnChangeEvent) {
        var reader = new FileReader()
        var onloadFunction = function(readerOnLoadEvent) {
          var loadJsonObject = this.isJson(readerOnLoadEvent.target.result)
          if (loadJsonObject) {
            this.newJsonObject = loadJsonObject
            this.items.originalConfigText = JSON.stringify(loadJsonObject)
            this.jsonDifferentCompare()
          } else {
            alert('NOT JSON')
          }
        }
        reader.onload = onloadFunction.bind(this)
        reader.readAsText(fileOnChangeEvent.target.files[0])
      },
      isJson: function(fileContent) {
        try {
  		    var jsonObject = JSON.parse(fileContent)
  	      if (jsonObject && typeof jsonObject === 'object') {
  		      return jsonObject
          }
        } catch (e) {}
  	    return false
      },
      jsonDifferentCompare: function() {
        jdc.jdd.diffs = []
        var newConfig = jdc.createConfig()
        jdc.formatAndDecorate(newConfig, this.newJsonObject)
        document.getElementById('newJson').textContent = newConfig.out
        if (this.isEdit&&!this.isFirstEdit) {
          var oldConfig = jdc.createConfig()
          jdc.formatAndDecorate(oldConfig, this.oldJsonObject)
          document.getElementById('oldJson').textContent = oldConfig.out
          jdc.formatPRETags()
          newConfig.currentPath = []
          oldConfig.currentPath = []
          jdc.diffVal(this.newJsonObject, newConfig, this.oldJsonObject, oldConfig)
          jdc.processDiffs()
          if (jdc.jdd.diffs.length > 0) {
              jdc.highlightDiff(0)
              jdc.currentDiff = 0
          }
          var differentNodeList = document.querySelectorAll('span.diff')
          Array.prototype.forEach.call(differentNodeList, differentNode => {
            differentNode.style.background = 'red'
            differentNode.style.color = 'white'
          })
        }
      },

      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        /*
        const coreConfigCompList = this.items.coreConfigCompList.map(({ diskMountPath, diskMountSize }) => ({
          diskMountPath,
          diskMountSize
        }));
        */
        const { edgeTypeCode, modifyHistReason, originalConfigText } = this.items;

        const submitItems = { edgeTypeCode, modifyHistReason, originalConfigText };
        const validate = this.$valid.all(submitItems);
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/edges/${this.id}/cores`, submitItems) :
          () => this.$https.put(`/edges/${this.id}/cores`, submitItems);

        this.inValidForm = !validate;


        if (validate){
          submitAction()
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          if (this.items.originalConfigText === null) {
            this.isOriginalConfigTextValidateFlag = true
          }
        }
      },

      onDeploy (){
        // TODO: 배포 추후 작업
        alert('배포 미개발')
        /*
        this.$https.post(`/edges/${this.id}/cores/apply`)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
        */
      },
      /*
      onAddRow (){
        this.items.coreConfigCompList.push({
          edgeCoreConfigCompSeq: this.items.coreConfigCompList.length,
          diskMountPath: '',
          diskMountSize: 0
        });
      },

      onDelRow (index){
        this.items.coreConfigCompList.splice(index, 1);
      },

      setDefault (item, key) {
        item[key] = item[key] !== '' ? parseInt(item[key]) : 0;
      },
      */
      getHistoryLink (rowId){
        return `#/configuration/edges/edge/${this.id}/core?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/edges/${this.id}/cores/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
