<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col">
        <section class="board">
          <b-table
            striped
            bordered
            hover
            show-empty
            :items="items"
            :fields="fields"
          >

            <template slot="expireTime" scope="row">
              <span v-if="row.item.isEdit">
                <cleave
                  class="form-control"
                  style="width: 60px;"
                  v-model="row.item.expireTime"
                  :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
                  @input="setDefault(row.item, 'expireTime')"
                ></cleave> 초
              </span>
              <span v-else>{{ row.value }} 초</span>
            </template>

            <template slot="bypassYn" scope="row">
              <c-switch
                v-if="row.item.isEdit"
                type="icon"
                variant="success"
                v-bind="{on: '\uf00c', off: '\uf00d'}"
                :pill="true"
                v-model="row.item.bypassYn"
              ></c-switch>
              <b-badge
                v-else
                pill
                :variant="row.value ? 'success' : 'secondary'">
                {{ row.value ? '사용' : '미사용' }}
              </b-badge>
            </template>

            <template slot="action" scope="row">
              <span v-if="row.item.isEdit">
                <b-button type="button" variant="danger" @click="onView(row)">취소</b-button>
                <b-button type="button" variant="primary" @click="onSubmit(row)">저장</b-button>
              </span>
              <span v-else>
                <b-button type="button" variant="outline-primary" @click="showHistory(row)">이력</b-button>
                <b-button type="button" variant="primary" @click="onEdit(row)">수정</b-button>
              </span>
            </template>
          </b-table>
        </section>

      </div>
    </div><!--/.row-->

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
        >
          <template slot="bypassYn" scope="row">
            {{ row.value ? '사용' : '미사용' }}
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'onetime',
    components: {
      cSwitch
    },
    data (){
      return {
        fields: {
          popName: {label: 'PoP'},
          expireTime: {label: 'ExpireTime *'},
          bypassYn: {label: 'Bypass'},
          action: { label: '관리'}
        },
        items: [],
        originItems: [],
        history: {
          fields: {
            modifyId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            expireTime: {label: 'ExpireTime', 'class': 'text-right'},
            bypassYn: { label: 'byPass'}
          },
          items: []
        },
        isModalHistory: false
      }
    },

    computed: {
    },

    created (){
      // One-Time URL List
      this.$https.get('/policy/oneTimeUrl')
        .then((res) => {
          this.items = res.data.items.map(obj => ({
            ...obj,
            isEdit: false
          }));
          this.originItems = JSON.parse(JSON.stringify(this.items))
        });
    },

    methods: {
      onEdit (row) {
        row.item.isEdit = true
      },

      onView (row) {
        const originRows = this.originItems[row.index];
        Object.keys(originRows).forEach(key => {
            row.item[key] = originRows[key]
        })
        row.item.isEdit = false;
      },

      onSubmit (row) {
        const { popId, expireTime, bypassYn, modifyHistReason } = row.item;
        this.$https.put(`/policy/oneTimeUrl/${popId}`,{ expireTime, bypassYn, modifyHistReason })
          .then(() => {
            row.item.isEdit = false;
            this.items[row.index] = row.item;
            this.originItems[row.index] = {...row.item}
          })
          .catch((error) => {
            console.log(error);
            this.onView(row);
          })
      },

      setDefault (item, key) {
        item[key] = item[key] !== '' ? parseInt(item[key]) : 0;
      },

      showHistory (row) {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/oneTimeUrl/hist/${row.item.popId}`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>

