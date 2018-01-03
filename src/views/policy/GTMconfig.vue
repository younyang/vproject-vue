<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        기본정보
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <!-- Process -->
        <b-form-fieldset
          label="Process *"
          :label-cols="3"
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
            label="Domain Name *"
            :label-cols="3"
            description="※ 영문 및 숫자, 특수문자(-, _) 가능"
            :horizontal="true">
            <b-form-input
              v-model="items.wideips.name"
              type="text"
            ></b-form-input>
          </b-form-fieldset>

          <!-- domain alias -->
          <b-form-fieldset
            label="Domain Alias *"
            :label-cols="3"
            :horizontal="true">
            <b-button
              type="button"
              size="sm"
              class="mt-2 mb-2"
              variant="outline-primary"
              @click="onAddData('wideips','aliases')">
              추가
            </b-button>
            <ul class="icons-list">
              <li v-for="(obj, index) in items.wideips.aliases">
                <i class="bg-primary">{{ index+1 }}</i>
                <div class="desc">
                  <small>Alias</small>
                  <div class="title">
                    <b-form-input
                      v-model="obj.data"
                      type="text"
                    ></b-form-input>
                  </div>
                </div>
                <div class="value" v-if="index > 0">
                  <div class="small text-muted">&nbsp;</div>
                  <b-button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    class="list-del"
                    @click="onDelData('wideips','aliases',index)">
                    <i class="fa fa-trash"></i>
                  </b-button>
                </div>
              </li>
            </ul>
          </b-form-fieldset>

          <!-- pool mapping -->
          <b-form-fieldset
            label="Pool mapping *"
            :label-cols="3"
            :horizontal="true">
            <b-button
              type="button"
              size="sm"
              class="mt-2 mb-2"
              variant="outline-primary"
              @click="onAddData('wideips','pools')">
              추가
            </b-button>
            <ul class="icons-list">
              <li v-for="(obj, index) in items.wideips.pools">
                <i class="bg-primary">{{ index+1 }}</i>
                <div class="desc">
                  <small>Pool</small>
                  <div class="title">
                    <b-form-input
                      v-model="obj.data"
                      type="text"
                    ></b-form-input>
                  </div>
                </div>
                <div class="value" v-if="index > 0">
                  <div class="small text-muted">&nbsp;</div>
                  <b-button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    class="list-del"
                    @click="onDelData('wideips','pools',index)">
                    <i class="fa fa-trash"></i>
                  </b-button>
                </div>
              </li>
            </ul>
          </b-form-fieldset>
        </div>

        <!-- Pool -->
        <div v-if="process === 'pools'">
          <!-- pool name -->
          <b-form-fieldset
            label="Pool Name *"
            :label-cols="3"
            description="※ 영문 및 숫자, 특수문자(-, _) 가능"
            :horizontal="true">
            <b-form-input
              v-model="items.pools.name"
              type="text"
            ></b-form-input>
          </b-form-fieldset>

          <!-- health monitor -->
          <b-form-fieldset
            label="Health Monitor"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              :value="items.pools.monitor"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>

          <!-- ttl -->
          <b-form-fieldset
            label="TTL *"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              style="width:100px"
              v-model="items.pools.ttl"
              type="number"
            ></b-form-input>
          </b-form-fieldset>

          <!-- server mapping -->
          <b-form-fieldset
            label="Server Mapping *"
            :label-cols="3"
            :horizontal="true">
            <b-button
              type="button"
              size="sm"
              class="mt-2 mb-2"
              variant="outline-primary"
              @click="onAddData('pools','members')">
              추가
            </b-button>
            <ul class="icons-list">
              <li v-for="(obj, index) in items.pools.members">
                <i class="bg-primary">{{ index+1 }}</i>
                <div class="desc">
                  <small>Alias</small>
                  <div class="title">
                    <b-form-input
                      v-model="obj.data"
                      type="text"
                    ></b-form-input>
                  </div>
                </div>
                <div class="value" v-if="index > 0">
                  <div class="small text-muted">&nbsp;</div>
                  <b-button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    class="list-del"
                    @click="onDelData('pools','members',index)">
                    <i class="fa fa-trash"></i>
                  </b-button>
                </div>
              </li>
            </ul>
          </b-form-fieldset>
        </div>

        <!-- Server -->
        <div v-if="process === 'servers'">
          <!-- server ip -->
          <b-form-fieldset
            label="Server IP *"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              v-model="items.servers.addresses[0]"
              type="text"
            ></b-form-input>
          </b-form-fieldset>

          <!-- server name -->
          <b-form-fieldset
            label="Server Name *"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              v-model="items.servers.name"
              type="text"
            ></b-form-input>
          </b-form-fieldset>

          <!-- health monitor -->
          <b-form-fieldset
            label="Health Monitor"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              :value="items.pools.monitor"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>

          <!-- data center -->
          <b-form-fieldset
            label="Data Center"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
              :value="items.servers.datacenter"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>
        </div>
      </b-card>
    </b-collapse>


    <div class="page-btn">
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
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
        originItems: {},
        items: {
          wideips: {
            name : null,
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
        }
      }
    },

    created (){
    },

    methods: {
      onAddData (process, item){
        this.items[process][item].push({ data: null });
      },

      onDelData (process, item, index){
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


        this.$https.post(`/gtm/${this.process}`, newItems)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
</script>
