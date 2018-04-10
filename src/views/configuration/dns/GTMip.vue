<template>
  <div class="animated fadeIn">
    <section class="board">
      <b-table
        show-empty
        :items="items"
        :fields="fields"
      >
        <template slot="ip" slot-scope="row">
          <ul class="gtm-ip-list">
            <li v-for="({ ip, port },index) in row.value">
              <div class="edit" v-if="row.item.isEdit">
                <b-form-input
                  :value="ip"
                  type="text"
                  style="width: 400px"
                ></b-form-input>
                <b-form-input
                  :value="port"
                  type="text"
                  style="width: 120px"
                ></b-form-input>

                <span class="ico">
                  <button type="button" v-if="index === 0" @click="onAddIp(row.index)"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="index > 0" @click="onDelIp(row.index, index)"><i class="fa fa-times-circle"></i></button>
                </span>
              </div>

              <span v-else>
                {{ ip }} : {{ port }}
              </span>
            </li>
          </ul>
        </template>

        <template slot="action" slot-scope="row">
          <span v-if="row.item.isEdit">
            <b-button type="button" variant="in-table" @click="onView(row)">취소</b-button>
            <b-button type="button" variant="in-table" @click="onSubmit(row)">저장</b-button>
          </span>
          <span v-else>
            <b-button type="button" variant="in-table" @click="onEdit(row)">수정</b-button>
          </span>
        </template>
      </b-table>
    </section>

  </div>
</template>

<script>
  export default {
    name: 'GTMIP',
    data (){
      return {
        fields: {
          serviceName: {label: 'Service Name', 'class': 'text-left', thStyle: { width: '180px'} },
          ip: {label: 'IP 주소 : Port', 'class': 'text-left'},
          action: { label: '관리', tdClass: 'align-middle' }
        },
        items: [{
          serviceName: 'btv',
          ip: [{
            ip: '111.222.333.111',
            port: '8080'
          },{
            ip: '1.255.56.234',
            port: '9090'
          }],
          isEdit: false
        }],
        originItems: []
      }
    },

    computed: {
    },

    created (){
    },

    methods: {
      onEdit (row) {
        row.item.isEdit = true
      },

      onView (row) {
        row.item.isEdit = false;
      },

      onSubmit (row) {
      },

      onAddIp (rowIndex){
        this.items[rowIndex].ip.push({ ip: null, port: null });
      },
      onDelIp (rowIndex, index){
        this.items[rowIndex].ip.splice(index, 1);
      }
    }
  }
</script>

