<template>
  <div class="animated fadeIn">
    <content-header
      :title="item.serviceName"
      :name="name">
    </content-header>

    <b-card>
      <b-form-fieldset
        v-if="!isCreate"
        label="ID"
        :label-cols="3"
        :horizontal="true">
        <b-form-input
          plaintext
          type="text" v-model="serviceId"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Account"
        :label-cols="3"
        :horizontal="true">
        <b-form-select
          v-if="isCreate"
          :plain="true"
          :options="['Please select','SKB', 'SKT']"
          value="Please select">
        </b-form-select>
        <b-form-input
          v-else
          plaintext
          type="text" value="SKB"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Service Name"
        description="Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
        v-if="isCreate"
        :label-cols="3"
        :horizontal="true">
        <b-input-group>
          <b-form-input type="text" placeholder="Service Name"></b-form-input>
          <!-- Attach Right button -->
          <b-input-group-button slot="right" class="ml-2">
            <b-button variant="outline-secondary">중복확인</b-button>
          </b-input-group-button>
        </b-input-group>
      </b-form-fieldset>
      <b-form-fieldset
        label="Service Name"
        v-else
        :label-cols="3"
        :horizontal="true">
        <b-form-input
          plaintext
          type="text" value="btv"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Select Type"
        :label-cols="3"
        :horizontal="true">
        <b-form-select
          v-if="isCreate"
          :plain="true"
          :options="['Please select']"
          value="Please select">
        </b-form-select>
        <b-form-input
          v-else
          plaintext
          type="text" value="VOD,FILE"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Domain"
        :label-cols="3"
        :horizontal="true">

        <section class="board" v-if="isCreate">
          <b-table
            bordered
            responsive
            small
            show-empty
            :fields="domainFields"
          >
          </b-table>
        </section>

      </b-form-fieldset>
      <b-form-fieldset
        label="CNAME 사용여부"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          v-if="isCreate"
          :pill="true"
          :checked="true"/>
        <b-form-input
          v-else
          plaintext
          type="text" value="사용"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="SSL 인증서"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          v-if="isCreate"
          :pill="true"
          :checked="false"/>
        <b-form-input
          v-else
          plaintext
          type="text" value="미사용"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="사용여부"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          v-if="isCreate"
          :pill="true"
          :checked="true"/>
        <b-form-input
          v-else
          plaintext
          type="text" value="사용"></b-form-input>
      </b-form-fieldset>

      <div slot="footer" class="form-btn" v-if="isCreate">
        <b-button type="submit" size="sm" variant="primary"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="reset" size="sm" variant="danger" @click="editable(false)"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
      <div slot="footer" class="form-btn" v-else>
        <b-button type="submit" size="sm" variant="primary" @click="editable(true)"><i class="fa fa-pencil"></i> 수정</b-button>
        <b-button type="reset" size="sm" variant="danger" @click="goList"><i class="fa fa-list"></i> 목록</b-button>
      </div>
    </b-card>

  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'services',
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Service 상세',
        item: {
          serviceName: 'btv'
        },
        isCreate: false,
        serviceId: '',
        domainFields: ['Type', 'Domain', 'Hashing type' ]
      }
    },

    created (){
      this.serviceId = this.$route.params.id;
      this.isCreate = this.serviceId === 'create';
    },

    methods: {
      click () {
        // do nothing
      },

      editable (editable){
        this.$router.push({ query: { mode: 'edit' }})
        this.isCreate = editable;
        console.log(this.$route)
      },

      goList (){
        this.$router.push('/service/service')
      }
    }
  }
</script>
