<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-4">
        <!-- Group List -->
        <div class="tree-area">
          <div class="tree-btn">
            <b-form-input
              v-model="searchItem.searchKeyword"
              class="float-left"
              style="width: 180px"
              type="text"
            ></b-form-input>
            <b-button type="button" variant="in-table-icon" class="float-left" @click="onSearch"><i class="icon-magnifier"></i></b-button>
            <b-button type="button" variant="in-table-icon" class="float-left" @click="onReload"><i class="icon-reload"></i></b-button>

            <b-button type="button" variant="in-table-icon" @click="onAddItem"><i class="fa fa-plus"></i></b-button>
            <b-button type="button" variant="in-table-icon" @click="onRemoveItem"><i class="fa fa-minus"></i></b-button>
          </div>

          <!-- Group List -->
          <draggable v-model="groups" :options="{ draggable:'.drag-item'}" class="drag-area" @end="onItemDrop">
            <div
              v-for="obj in groups"
              :key="obj.groupId"
              class="drag-item"
              :class="{ 'selected': obj.groupId === items.groupId }"
              @click="onItemClick(obj)"
            >
              <span class="name">{{ obj.groupName }}</span>
              <span class="badge" v-if="!obj.groupUseYn">미사용</span>
            </div>
          </draggable>
        </div>
      </div>
      <div class="col-8">
        <div class="collapse-title">
          <b-button class="btn-collapse" v-b-toggle.formDefault>
            <i class="fa"></i>
            기본정보
          </b-button>
        </div>

        <b-collapse id="formDefault" visible>
          <b-form class="formView" :validated="inValidForm" novalidate>
            <!-- 그룹명 -->
            <b-form-fieldset
              :invalid-feedback="feedback.groupName"
              :horizontal="true">
              <template slot="label">
                그룹명<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-input
                v-if="isEdit"
                v-model="items.groupName"
                type="text"
                placeholder="Enter Group name"
                :state="valid.groupName"
                @input="groupNameExists = null"
                required
              ></b-form-input>
              <b-button v-if="isEdit" variant="in-table" @click="fetchNameExists">중복확인</b-button>
              <span class="ico ml-2 mid" v-if="isEdit && groupNameExists !== null">
                <i v-if="groupNameExists === 'success'" class="fa fa-check-circle"></i>
                <i v-if="groupNameExists === 'fail'" class="fa fa-times-circle"></i>
              </span>
              <b-form-input
                v-if="!isEdit"
                :value="items.groupName"
                type="text"
                plaintext
              ></b-form-input>
            </b-form-fieldset>

            <!-- 그룹코드 -->
            <b-form-fieldset
              :invalid-feedback="feedback.groupCode"
              :horizontal="true">
              <template slot="label">
                그룹코드<i v-if="isCreate" class="require">*</i>
              </template>
              <b-form-input
                v-if="isCreate"
                v-model="items.groupCode"
                type="text"
                placeholder="Enter Group code"
                :state="valid.groupCode"
                @input="groupCodeExists = null"
                required
              ></b-form-input>
              <b-button v-if="isCreate" variant="in-table" @click="fetchCodeExists">중복확인</b-button>
              <span class="ico ml-2 mid" v-if="isCreate && groupCodeExists !== null">
                <i v-if="groupCodeExists === 'success'" class="fa fa-check-circle"></i>
                <i v-if="groupCodeExists === 'fail'" class="fa fa-times-circle"></i>
              </span>
              <b-form-input
                v-if="!isCreate"
                v-model="items.groupCode"
                type="text"
                disabled
                :plaintext="!isEdit"
              ></b-form-input>
            </b-form-fieldset>

            <!-- 사용여부 -->
            <b-form-fieldset
              label="사용여부"
              :horizontal="true">
              <c-switch
                v-if="isEdit"
                type="text"
                class="v-switch"
                on="사용"
                off="미사용"
                v-model="items.groupUseYn"
              ></c-switch>
              <span
                v-else
                class="badge"
                :class="{'primary' : items.groupUseYn }"
              >{{ items.groupUseYn ? '사용' : '미사용' }}
              </span>
            </b-form-fieldset>

            <!-- 설명 -->
            <b-form-fieldset
              label="설명"
              :horizontal="true">
              <b-form-textarea
                v-model="items.groupDesc"
                :rows="6"
                :no-resize="true"
                :plaintext="!isEdit"
              ></b-form-textarea>
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
              <!-- 수정일 -->
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
          </b-form>
        </b-collapse>

        <div class="page-btn" v-if="isEdit && items.menuId !== 1">
          <b-button type="button" variant="outline-secondary" @click="onCancel">취소</b-button>
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>

        <div class="page-btn" v-if="!isEdit && items.menuId !== 1">
          <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
        </div>
      </div>
    </div>

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto" v-if="modal.alert">
        <b-button type="button" variant="primary" @click="modal.open = false">닫기</b-button>
      </div>
      <div slot="modal-footer" class="mx-auto" v-else>
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import cSwitch from '@/components/Switch'

  export default {
    name: 'groupAdmin',
    components: {
      draggable,
      cSwitch
    },
    data (){
      return {
        originItems: {},
        groups: [],
        items: {
          groupId: null,
          groupName: '',
          groupCode: '',
          groupUseYn: true,
          groupDesc: '',
          sortNumber: null
        },

        searchItem: {
          searchKeyword: ''
        },

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        groupNameExists: null,
        groupCodeExists: null,

        isEdit: false,
        isCreate: false,
        inValidForm: false
      }
    },

    computed: {
      // validation
      valid (){
        return {
          groupName: (this.groupNameExists === null && this.items.groupName.length === 0) ?
            this.groupNameExists :
            (this.items.groupName.length > 0 &&
            this.groupNameExists === 'success'),
          groupCode: (this.groupCodeExists === null && this.items.groupCode.length === 0) ?
            this.groupCodeExists :
            (this.items.groupCode.length > 0 &&
            this.groupCodeExists === 'success')
        }
      },

      // validation feedback
      feedback (){
        return {
          groupName: (this.groupNameExists === null && this.items.groupName.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.groupNameExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.groupNameExists === 'fail') ?
            '이미 등록된 그룹명이 있습니다.'
            : this.items.groupName.length === 0 ?
            this.$valid.msg.require : '',
          groupCode: (this.groupCodeExists === null && this.items.groupCode.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.groupCodeExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.groupCodeExists === 'fail') ?
            '이미 등록된 그룹코드가 있습니다.'
            : this.items.groupCode.length === 0 ?
            this.$valid.msg.require : ''
        }
      }
    },

    mounted (){
      // Groups Fetch
      this.fetchGroup();
    },

    methods: {
      fetchGroup (index = 0){
        const defaultParams = {
          q: { ...this.searchItem }
        };
        this.$https.get('/setting/admin/groups', {...defaultParams })
          .then(res => {
            this.onFetchList(res, index)
          });
      },

      fetchNameExists (){
        if (!this.items.groupName){
          this.groupNameExists = 'not';
          return;
        }
        this.$https.get('/setting/admin/groups/check', {
          checkType: 'groupName',
          checkKeyword: this.items.groupName
        })
        .then((res) => {
          this.groupNameExists = res.data.result === 'Success' ? 'success' : 'fail';
        });
      },

      fetchCodeExists (){
        if (!this.items.groupCode){
          this.groupCodeExists = 'not';
          return;
        }
        this.$https.get('/setting/admin/groups/check', {
          checkType: 'groupCode',
          checkKeyword: this.items.groupCode
        })
        .then((res) => {
          this.groupCodeExists = res.data.result === 'Success' ? 'success' : 'fail';
        });
      },

      onFetchList (res, index = 0){
        this.groups = res.data.items;
        this.items = { ...res.data.items[index] };
        this.originItems = JSON.parse(JSON.stringify(this.items));
      },

      onEdit (){
        this.groupNameExists = 'success';
        this.groupCodeExists = 'success';
        this.isEdit = true;
        this.isCreate = false;
      },

      onView (noChange = true){
        this.isEdit = false;
        this.isCreate = false;
        if (noChange){
          this.items = JSON.parse(JSON.stringify(this.originItems));
        }
      },

      onCancel (){
        if (this.items.groupId === 'add'){
          this.onRemoveItem();
        }else{
          this.onView();
        }
      },

      onSubmit (){
        const { groupId, groupCode, groupName, groupUseYn, groupDesc} = this.items;
        const submitItems = this.isCreate ?
          { groupCode, groupName, groupUseYn, groupDesc } :
          { groupName, groupUseYn, groupDesc };
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/setting/admin/groups`, submitItems) :
          () => this.$https.put(`/setting/admin/groups/${groupId}`, submitItems);

        const validate = (this.$valid.all(submitItems) && this.groupNameExists === 'success' &&
                         (this.isCreate ? this.groupCodeExists === 'success' : true ));
        this.inValidForm = !validate;

        // POST
        if (validate){
          submitAction()
            .then((res) => {
              const id = this.isCreate ? res.data.items : groupId;
              this.onView(false);
              this.fetchGroup();
            })
            .catch((error) => {
              console.log(error);
            });
        }

      },

      onSearch (){
        this.fetchGroup();
      },

      onReload (){
        this.searchItem.searchKeyword = '';
        this.fetchGroup();
      },

      onDelete (hasOperator){
        this.modal = {
          open: true,
          type: (hasOperator) ? 'error' : 'done',
          msg: hasOperator ? '운영자가 존재하는 그룹은 삭제할 수 없습니다.' : '그룹을 삭제하시겠습니까?',
          alert: hasOperator,
          action: this.onDeleteData
        };
      },

      onDeleteData (){
        this.$https.delete(`/setting/admin/groups/${this.items.groupId}`)
          .then(() => {
            this.fetchGroup();
          });
      },

      onItemClick (obj) {
        this.onView(false);
        this.items = { ...obj };
      },

      onItemDrop (item) {
        const sortObj = this.groups[item.newIndex];
        this.$https.put('/setting/admin/groups/sort', {
          groupId: sortObj.groupId,
          sortNumber: (item.newIndex + 1)
        })
        .then(() => {
          this.searchItem.searchKeyword = '';
          this.fetchGroup(item.newIndex);
        });
      },


      onAddItem (){
        this.groupNameExists = null;
        this.groupCodeExists = null;
        this.isCreate = true;
        this.isEdit = true;

        const addItems = {
          groupId: 'add',
          groupName: 'New Group',
          groupCode: '',
          groupUseYn: true,
          groupDesc: null,
          sortNumber: (this.groups.length + 1)
        };

        this.groups.push(addItems);
        this.items = { ...addItems };
      },

      onRemoveItem (){
        if (this.items.groupId === 'add'){
          this.groups = this.groups.filter(({ groupId }) => groupId === 'add');
          this.items = { ...this.groups[0] };
          return;
        }
        this.$https.get(`/setting/admin/group/operators/${this.items.groupId}`)
          .then(res => {
            this.onDelete(res.data.items[0].groupOperators.length);
          });
      }
    }
  }
</script>
