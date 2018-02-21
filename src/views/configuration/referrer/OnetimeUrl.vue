<template>
  <div class="animated fadeIn">
    <section class="board">
      <b-table
        show-empty
        :items="items"
        :fields="fields"
      >
        <template slot="expireTime" slot-scope="row">
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

        <template slot="bypassYn" slot-scope="row">
          <c-switch
            v-if="row.item.isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="row.item.bypassYn"
          ></c-switch>
          <span
            v-else
            class="badge ins"
            :class="{'primary' : row.value }"
          >
            {{ row.value ? '사용' : '미사용' }}
          </span>
        </template>

        <template slot="action" slot-scope="row">
          <span v-if="row.item.isEdit">
            <b-button type="button" variant="in-table" @click="onView(row)">취소</b-button>
            <b-button type="button" variant="in-table" @click="onSubmit(row)">저장</b-button>
          </span>
          <span v-else>
            <b-button type="button" variant="in-table" @click="showHistory(row)">이력</b-button>
            <b-button type="button" variant="in-table" @click="onEdit(row)">수정</b-button>
          </span>
        </template>
      </b-table>
    </section>


    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="bypassYn" slot-scope="row">
            {{ row.value ? '사용' : '미사용' }}
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
          expireTime: {label: 'ExpireTime<i class="require">*</i>'},
          bypassYn: {label: 'Bypass'},
          action: { label: '관리'}
        },
        items: [],
        originItems: [],
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            expireTime: {label: 'ExpireTime', 'class': 'text-right'},
            bypassYn: { label: 'byPass'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
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
            this.history.pageInfo.totalCount = res.data.items.length;
          });
      }
    }
  }
</script>

