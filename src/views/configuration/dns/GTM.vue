<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Process -->
        <b-form-fieldset
          label="Process"
          :horizontal="true">
          <b-form-radio-group
            v-model="process"
            :options="code.process"
            name="process"
            value-field="code"
            text-field="codeName"
          ></b-form-radio-group>
        </b-form-fieldset>


        <!-- Domain -->
        <div v-if="process === 'wideips'">
          <!-- domain name -->
          <b-form-fieldset
            label="Domain Name<i class='require'>*</i>"
            description="※ 영문 및 숫자, 특수문자(-, _) 가능"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-input
              v-model="items.wideips.name"
              type="text"
              required
            ></b-form-input>
          </b-form-fieldset>

          <!-- domain alias -->
          <b-form-fieldset
            label="Domain Alias<i class='require'>*</i>"
            :horizontal="true">

            <b-table
              class="sub"
              show-empty
              :items="items.wideips.aliases"
              :fields="{
                index: {label: '번호', 'class':'index'},
                data: {label: 'Aliases', 'class': 'text-left'}
              }"
            >
              <template slot="index" slot-scope="row">
                {{ row.index + 1 }}
              </template>
              <template slot="data" slot-scope="row">
                <b-form-input
                  v-model="row.item.data"
                  type="text"
                  required
                ></b-form-input>
                <span class="ico">
                  <button type="button" v-if="row.index === 0" @click="onAddRow('wideips','aliases')"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="row.index > 0" @click="onDelRow('wideips','aliases', row.index)"><i class="fa fa-times-circle"></i></button>
                </span>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </template>
            </b-table>
          </b-form-fieldset>

          <!-- pool mapping -->
          <b-form-fieldset
            label="Pool mapping<i class='require'>*</i>"
            :horizontal="true">
            <b-table
              class="sub"
              show-empty
              :items="items.wideips.pools"
              :fields="{
                index: {label: '번호', 'class':'index'},
                data: {label: 'Pools', 'class': 'text-left'}
              }"
            >
              <template slot="index" slot-scope="row">
                {{ row.index + 1 }}
              </template>
              <template slot="data" slot-scope="row">
                <b-form-input
                  v-model="row.item.data"
                  type="text"
                  required
                ></b-form-input>

                <span class="ico">
                  <button type="button" v-if="row.index === 0" @click="onAddRow('wideips','pools')"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="row.index > 0" @click="onDelRow('wideips','pools', row.index)"><i class="fa fa-times-circle"></i></button>
                </span>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </template>
            </b-table>
          </b-form-fieldset>
        </div>

        <!-- Pool -->
        <div v-if="process === 'pools'">
          <!-- pool name -->
          <b-form-fieldset
            label="Pool Name<i class='require'>*</i>"
            description="※ 영문 및 숫자, 특수문자(-, _) 가능"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-input
              v-model="items.pools.name"
              type="text"
              required
            ></b-form-input>
          </b-form-fieldset>

          <!-- health monitor -->
          <b-form-fieldset
            label="Health Monitor"
            label-for="monitor1"
            :horizontal="true">
            <b-form-input
              :value="items.pools.monitor"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>

          <!-- ttl -->
          <b-form-fieldset
            label="TTL<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <cleave
              :value.sync="items.pools.ttl"
              style="width: 100px;"
              class="form-control"
              :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
              required
            ></cleave>
          </b-form-fieldset>

          <!-- server mapping -->
          <b-form-fieldset
            label="Server Mapping<i class='require'>*</i>"
            :horizontal="true">

            <b-table
              class="sub"
              show-empty
              :items="items.pools.members"
              :fields="{
                index: {label: '번호', 'class':'index'},
                data: {label: 'Server', 'class': 'text-left'}
              }"
            >
              <template slot="index" slot-scope="row">
                {{ row.index + 1 }}
              </template>
              <template slot="data" slot-scope="row">
                <b-form-input
                  v-model="row.item.data"
                  type="text"
                  required
                ></b-form-input>

                <span class="ico">
                  <button type="button" v-if="row.index === 0" @click="onAddRow('pools','members')"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="row.index > 0" @click="onDelRow('pools','members', row.index)"><i class="fa fa-times-circle"></i></button>
                </span>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </template>
            </b-table>
          </b-form-fieldset>
        </div>

        <!-- Server -->
        <div v-if="process === 'servers'">
          <!-- server ip -->
          <b-form-fieldset
            label="Server IP<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-input
              v-model="items.servers.addresses[0]"
              type="text"
              required
            ></b-form-input>
          </b-form-fieldset>

          <!-- server name -->
          <b-form-fieldset
            label="Server Name<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-input
              v-model="items.servers.name"
              type="text"
              required
            ></b-form-input>
          </b-form-fieldset>

          <!-- health monitor -->
          <b-form-fieldset
            label="Health Monitor"
            label-for="monitor2"
            :horizontal="true">
            <input type="text" readonly="readonly" class="form-control-plaintext" :value="items.pools.monitor">
          </b-form-fieldset>

          <!-- data center -->
          <b-form-fieldset
            label="Data Center"
            :horizontal="true">
            <b-form-input
              :value="items.servers.datacenter"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>
        </div>
      </b-form>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" v-if="modal.type === 'confirm'">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
      </div>
      <div slot="modal-footer" v-if="modal.type === 'done'" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'gtm',
    components: {
    },

    data (){
      return {
        process: 'wideips',
        submitItems: {},
        items: {
          wideips: {
            name : '',
            aliases : [{ data: null }],
            pools : [{ data: null }]
          },
          pools: {
            name : null,
            monitor: 'gateway_icmp',
            ttl : null,
            members : [{ data: null }]
          },
          servers: {
            name : null,
            datacenter : 'Test_DC',
            addresses : ['']
          }
        },
        code: {
          process: [{
            code: 'wideips',
            codeName: 'Domain 정보'
          },{
            code: 'pools',
            codeName: 'Pool 정보'
          },{
            code: 'servers',
            codeName: 'Server 정보'
          }]
        },

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){ this.modal.open = false }
        },

        inValidForm: false
      }
    },

    methods: {
      onAddRow (process, item){
        this.items[process][item].push({ data: null });
      },
      onDelRow (process, item, index){
        this.items[process][item].splice(index, 1);
      },

      onSubmit (){
        const items = this.items[this.process];
        const newItems = {};
        Object.keys(items).forEach(key => {
          let value = items[key];
          if (key === 'aliases' || key === 'pools' || key === 'members'){
              value = value.map(({ data }) => data);
          }
          newItems[key] = value;
        });

        const validate = this.$valid.all(newItems);
        this.inValidForm = !validate;

        if (validate){
          this.submitItems = newItems;
          this.modal = {
            open: true,
            type: 'confirm',
            msg: '설정한 정보를 저장 및 배포하시겠습니까?',
            action: this.onSubmitData
          }
        }
      },

      onSubmitData (){
        this.modal.open = false;
        this.$https.post(`/gtm/${this.process}`, this.submitItems)
          .then(this.onSubmitComplete)
          .catch((error) => {
            console.log(error);
          });
      },

      onSubmitComplete (){
        const router = this.$router;
        this.modal = {
          open: true,
          type: 'done',
          msg: '저장 및 배포가 완료되었습니다',
          action (){
            router.go(router.currentRoute);
          }
        };
      }
    }
  }
</script>
