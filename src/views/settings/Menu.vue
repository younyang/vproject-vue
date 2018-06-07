<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-4">
        <!-- Menu Tree -->
        <div class="tree-area">
          <div class="tree-btn">
            <b-button type="button" variant="in-table" class="float-left" @click="onExpandAll">모두 열기</b-button>
            <b-button type="button" variant="in-table" class="float-left" @click="onCollapseAll">모두 닫기</b-button>

            <span v-if="nodes">
              <b-button type="button" variant="in-table-icon" @click="onAddItem" v-if="items.menuId !== 'add'"><i class="fa fa-plus"></i></b-button>
              <b-button type="button" variant="in-table-icon" @click="onRemoveItem" v-if="items.menuId !== 1"><i class="fa fa-minus"></i></b-button>
            </span>
          </div>

          <v-jstree
            ref="tree"
            :data="menus"
            :whole-row="true"
            :collapse="true"
            :draggable="true"
            :item-events="nodeEvents"
            text-field-name="menuName"
            value-field-name="menuId"
            children-field-name="subMenuList"
            @item-click="onItemClick">
            <template slot-scope="_">
              <div>
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.menuName}}
                <span class="badge" v-if="_.model.menuId !== 1 && _.model.menuUseYn === false">미사용</span>
              </div>
            </template>
          </v-jstree>
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
            <input type="hidden" :value="items.menuId">

            <!-- 메뉴명 -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.require"
              :horizontal="true">
              <template slot="label">
                메뉴명<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-input
                v-model="items.menuName"
                type="text"
                :plaintext="!isEdit"
                required
              ></b-form-input>
            </b-form-fieldset>

            <!-- 링크 URL -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.require"
              :horizontal="true">
              <template slot="label">
                링크 URL<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-input
                v-model="items.linkUrl"
                type="text"
                :plaintext="!isEdit"
                required
              ></b-form-input>
            </b-form-fieldset>

            <!-- 메뉴권한설정 -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.select"
              :horizontal="true">
              <template slot="label">
                메뉴권한설정<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-radio-group
                v-if="isEdit"
                :options="code.menuPermissionCode"
                v-model="items.menuPermissionCode"
              ></b-form-radio-group>
              <b-form-input
                v-else
                :value="menuPermissionCodeText"
                type="text"
                plaintext
              ></b-form-input>
            </b-form-fieldset>

            <!-- 노출여부 -->
            <b-form-fieldset
              label="노출여부"
              :horizontal="true">
              <c-switch
                v-if="isEdit"
                type="text"
                class="v-switch"
                on="노출"
                off="미노출"
                v-model="items.menuExposureYn"
              ></c-switch>
              <span
                v-else
                class="badge"
                :class="{'primary' : items.menuExposureYn }"
              >{{ items.menuId !== 1 ? items.menuExposureYn ? '사용' : '미사용' : '--' }}
              </span>
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
                v-model="items.menuUseYn"
              ></c-switch>
              <span
                v-else
                class="badge"
                :class="{'primary' : items.menuUseYn }"
              >{{ items.menuId !== 1 ? items.menuUseYn ? '사용' : '미사용' : '--' }}
              </span>
            </b-form-fieldset>

            <!-- 설명 -->
            <b-form-fieldset
              label="설명"
              :horizontal="true">
              <b-form-textarea
                v-model="items.menuDesc"
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
  import VJstree from 'vue-jstree'
  import cSwitch from '@/components/Switch'

  export default {
    name: 'menuAdmin',
    components: {
      VJstree,
      cSwitch
    },
    data (){
      return {
        originItems: {},
        menus: [],
        nodes: false,
        nodeEvents: {
          dragover: this.onItemDragOver
        },

        items: {
          menuId: 1,
          menuName : null,
          linkUrl : null,
          menuPermissionCode : null,
          menuExposureYn : false,
          menuDesc : null,
          menuLevel : null,
          menuUseYn : false,
          criteriaMenuId : null,
          criteriaMenuLevel : null
        },

        code: {
          menuPermissionCode: []
        },

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        isEdit: false,
        isCreate: false,
        inValidForm: false
      }
    },

    computed: {
      menuPermissionCodeText (){
        const menuPermission = this.code.menuPermissionCode.find(({ value }) => value === this.items.menuPermissionCode);
        return menuPermission ? menuPermission.text : ''
      }
    },

    created (){
      // Menu Permission Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'MENU_PERMISSION' }
      })
      .then((res) => {
        this.code.menuPermissionCode = res.data.items.map(({ code, codeName }) => ({
          value: code,
          text: codeName
        }));
      });

      this.fetchMenu();
    },

    methods: {
      fetchMenu (id){
        const uri = id ? `/setting/admin/menu/${id}` : `/setting/admin/menu`;
        const action = id ? this.onFetchItem : (res) => {
          if (this.menus.length) {
            this.$eventBus.$emit('menu', [res.data.items]);
          }else{
            this.onFetchList([res.data.items]);
          }
        };
        this.$https.get(uri).then(action);
      },

      onFetchList (nav){
        this.menus = nav;
        this.$refs.tree.initializeData(this.menus);
        this.$refs.tree.onItemDrop = this.onItemDrop;
        setTimeout(() => {
          const node = this.$refs.tree.$children[0];
          this.setSelectedMenu(node);
        },0);
      },

      onFetchItem (res){
        this.items = { ...res.data.items };
        this.nodes.model = Object.assign(this.nodes.model, res.data.items);
        this.originItems = JSON.parse(JSON.stringify(this.items));
      },

      onEdit (){
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
        if (this.items.menuId === 'add'){
          this.onRemoveItem();
        }else{
          this.onView();
        }
      },

      onSubmit (){
        const {
          menuId,
          menuName,
          linkUrl,
          menuPermissionCode,
          menuExposureYn,
          menuDesc,
          menuLevel,
          menuUseYn,
          criteriaMenuId,
          criteriaMenuLevel
        } = this.items;

        const submitItems = this.isCreate ? {
          menuName,
          linkUrl,
          menuPermissionCode,
          menuExposureYn,
          menuDesc,
          menuLevel,
          menuUseYn,
          criteriaMenuId,
          criteriaMenuLevel
        } : {
          menuName,
          linkUrl,
          menuPermissionCode,
          menuExposureYn,
          menuDesc,
          menuUseYn
        };

        const validate = this.$valid.all(submitItems);
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/setting/admin/menu`, submitItems) :
          () => this.$https.put(`/setting/admin/menu/${menuId}`, submitItems);


        this.inValidForm = !validate;

        if (validate) {
          submitAction()
            .then((res) => {
              const id = this.isCreate ? res.data.items : menuId;
              this.onView(false);
              this.modal.open = false;
              this.fetchMenu();
              this.fetchMenu(id);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onDeleteData (){
        this.items.criteriaMenuId = this.items.criteriaMenuId || 26
        // Menu Delete
        this.$https.delete(`/setting/admin/menu/${this.items.criteriaMenuId}/${this.items.menuId}`)
          .then(() => {
            this.setRemoveMenu();
            this.fetchMenu();
          });
      },

      onItemClick (node) {
        if (this.items.menuId === 'add' && node.model.menuId !== 'add'){
          this.items.menuId = node.model.menuId;
          this.setRemoveMenu();
          return;
        }

        this.nodes = node;
        if (node.model.menuId !== 'add'){
          this.fetchMenu(node.model.menuId);
          return;
        }
        this.isEdit = true;
        this.isCreate = true;
      },

      onItemDragOver (e){
        console.log(e)
      },

      onItemDrop (e, oriNode, oriItem) {
        const tree = this.$refs.tree;
        if (!tree.draggable || oriItem.dropDisabled) {
          return false;
        }
        if (!tree.draggedElm || tree.draggedElm === e.target || tree.draggedElm.contains(e.target)) {
          return;
        }
        if (tree.draggedItem) {
          console.log(oriItem);
          console.log(tree.draggedItem)
        }
          /*
          if (this.draggedItem.parentItem === oriItem[this.childrenFieldName]
            || this.draggedItem.item === oriItem
            || (oriItem[this.childrenFieldName] && oriItem[this.childrenFieldName].findIndex(t => t.id === this.draggedItem.item.id) !== -1)) {
            return;
          }
          if (!!oriItem[this.childrenFieldName]) {
            oriItem[this.childrenFieldName].push(this.draggedItem.item)
          } else {
            oriItem[this.childrenFieldName] = [this.draggedItem.item]
          }
          oriItem.opened = true
          var draggedItem = this.draggedItem
          this.$nextTick(() => {
            draggedItem.parentItem.splice(draggedItem.index, 1)
          })
          this.$emit("item-drop", oriNode, oriItem, draggedItem.item, e)
          */


      },


      onAddItem (){
        const { menuId, menuLevel } = this.items;
        if (!this.nodes.model.addChild) {
          return;
        }
        const addItem = {
          menuId: 'add',
          menuName: 'New Menu',
          linkUrl : null,
          menuPermissionCode : null,
          menuExposureYn : true,
          menuDesc : null,
          menuLevel : parseInt(menuLevel) + 1,
          menuUseYn : true,
          criteriaMenuId : menuId,
          criteriaMenuLevel : menuLevel
        };

        this.nodes.model.addChild(addItem);
        this.items = { ...addItem };

        setTimeout(() => {
          const childIndex = this.nodes.$children.length - 1;
          this.setSelectedMenu(this.nodes.$children[childIndex]);
        },0)
      },

      onRemoveItem (){
        if (this.items.menuId === 'add'){
          this.setRemoveMenu();
          return;
        }
        let hasChild = (this.nodes.$children.length);
        let hasChildUseYn = false;

        this.$refs.tree.handleRecursionNodeChilds(this.nodes, (node) => {
          if (node.model && node.model.menuId !== this.items.menuId && node.model.menuUseYn){
            hasChildUseYn = true;
          }
        });
        this.modal = {
          open: true,
          type: (hasChild && hasChildUseYn) ? 'error' : 'done',
          msg: hasChild ?
            hasChildUseYn ? '사용 중인 하위 메뉴가 있는 메뉴는 삭제할 수 없습니다.' :
            `메뉴를 삭제하겠습니까?
             삭제 시 하위 메뉴까지 모두 삭제됩니다.` :
            '메뉴를 삭제하겠습니까?',
          alert: (hasChild && hasChildUseYn),
          action: this.onDeleteData
        };
      },

      onExpandAll (){
        const firstItem = this.$refs.tree.$children[0];
        if (firstItem) {
          firstItem.model.openChildren();
        }
      },

      onCollapseAll (){
        const firstItem = this.$refs.tree.$children[0];
        if (firstItem) {
          firstItem.model.closeChildren();
        }
      },

      setSelectedMenu (node){
        const { model } = node;
        this.$refs.tree.handleSingleSelectItems(node, model);
        this.onItemClick(node);
      },

      setRemoveMenu (){
        const currentIndex = this.nodes.parentItem.indexOf(this.nodes.model);
        this.nodes.parentItem.splice(currentIndex, 1);
        this.onView(false);
        this.modal.open = false;
        this.setSelectedMenu(this.nodes.$parent);
      }
    }
  }
</script>
