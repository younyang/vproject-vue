<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-6">
        <!-- Menu Group Tree -->
        <div class="tree-area">
          <div class="tree-btn">
            <multiselect
              style="width: 180px"
              v-model="groups"
              track-by="groupId"
              label="groupName"
              class="noEmpty float-left"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.groups"
              :loading="isLoad.groups"
              @select="onChangeGroup"
            ></multiselect>

            <b-button type="button" variant="in-table" @click="onExpandAll">모두 열기</b-button>
            <b-button type="button" variant="in-table" @click="onCollapseAll">모두 닫기</b-button>
          </div>

          <v-jstree
            ref="tree"
            :data="menuGroups"
            :whole-row="true"
            :collapse="true"
            show-checkbox
            multiple
            allow-batch
            text-field-name="menuName"
            value-field-name="menuId"
            children-field-name="subMenuList"
            @item-click="onGroupItemClick">
            <template slot-scope="_">
              <div style="display: inherit">
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.menuName}}
                <span class="menu-btn" v-if="_.model.menuId !== 1">
                  <b-button
                    type="button"
                    :variant="_.model.menuPermissionCode === 'MENU_PERMISSION_01' ? 'primary' : 'outline-secondary'"
                    @click="onSetAuth(_.model, '1')"
                  >읽기</b-button>
                  <b-button
                    type="button"
                    :variant="_.model.menuPermissionCode === 'MENU_PERMISSION_02' ? 'primary' : 'outline-secondary'"
                    @click="onSetAuth(_.model, '2')"
                  >쓰기</b-button>
                </span>
              </div>
            </template>
          </v-jstree>
        </div>
        <div class="page-btn">
          <b-button type="button" variant="outline-secondary" @click="onRemoveItem">삭제</b-button>
        </div>
      </div>
      <div class="col-6">
        <!-- Menu All Tree -->
        <div class="tree-area">
          <div class="tree-btn">
            <strong class="title">전체 메뉴</strong>
            <b-button type="button" variant="in-table" @click="onExpandAll">모두 열기</b-button>
            <b-button type="button" variant="in-table" @click="onCollapseAll">모두 닫기</b-button>
          </div>

          <v-jstree
            ref="tree2"
            :data="menus"
            :whole-row="true"
            :collapse="true"
            show-checkbox
            multiple
            allow-batch
            text-field-name="menuName"
            value-field-name="menuId"
            children-field-name="subMenuList"
            @item-click="onItemClick">
            <template slot-scope="_">
              <div style="display: inherit">
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.menuName}}
                <span class="menu-btn" v-if="_.model.menuId !== 1">
                  <b-button
                    type="button"
                    :variant="_.model.menuPermissionCode === 'MENU_PERMISSION_01' ? 'primary' : 'outline-secondary'"
                    @click="onSetAuth(_.model, '1')"
                  >읽기</b-button>
                  <b-button
                    type="button"
                    :variant="_.model.menuPermissionCode === 'MENU_PERMISSION_02' ? 'primary' : 'outline-secondary'"
                    @click="onSetAuth(_.model, '2')"
                  >쓰기</b-button>
                </span>
              </div>
            </template>
          </v-jstree>
        </div>

        <div class="page-btn">
          <b-button type="button" variant="primary" @click="onAddItem">추가</b-button>
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
        groups: [],
        menuGroups: [],

        selectedMenus: [],
        selectedGroupMenus: [],

        nodes: false,

        code: {
          groups: [],
          menuPermissionCode: []
        },

        isLoad: {
          groups: true
        },

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        }
      }
    },

    computed: {
      menuPermissionCodeText (){
        const menuPermission = this.code.menuPermissionCode.find(({ value }) => value === this.items.menuPermissionCode);
        return menuPermission ? menuPermission.text : ''
      }
    },

    mounted (){
      // Groups
      this.$https.get('/setting/admin/groups')
        .then((res) => {
          this.code.groups = res.data.items;
          this.isLoad.groups = false;
          this.groups = { ...this.code.groups[0] };
          this.fetchMenuGroup(this.groups.groupId);
        });

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
      fetchMenuGroup (id){
        this.$https.get(`/setting/admin/menuGroup/${id}`)
          .then(res => {
            this.menuGroups = [res.data.items];
            this.$refs.tree.initializeData(this.menuGroups);
          });
      },

      fetchMenu (){
        this.$https.get('/setting/admin/menu')
          .then(res => {
            this.menus = [res.data.items];
            this.$refs.tree2.initializeData(this.menus);
          });
      },

      onChangeGroup (item){
        const id = item.groupId;
        this.fetchMenuGroup(id);
      },

      onSetAuth (obj, code){
        const permissionCode = `MENU_PERMISSION_0${code}`;
        this.$https.put(`/setting/admin/menuGroup/${this.groups.groupId}/${obj.menuId}`,{
          menuPermissionCode: permissionCode
        }).then(() => {
          obj.menuPermissionCode = permissionCode;
        });
      },

      onGroupItemClick (node){
        this.nodes = node;
      },

      onItemClick (node) {
        const loopParent = (node) => {
          const lists = node.$parent.$children.map(comp => comp.model);
          const hasSelected = lists.find(({ selected }) => selected === true);

          node.$parent.model.selected = (hasSelected !== undefined);
          if (node.$parent.model.menuLevel > 1){
            loopParent(node.$parent);
          }
        }
        loopParent(node);
      },

      onAddItem (){
        this.selectedMenus = this.getSelectedMenus(this.menus);
        const isSelect = (this.selectedMenus.length);
        this.modal = {
          open: true,
          type: isSelect ? 'done' : 'error',
          msg: isSelect ? '선택한 메뉴를 추가하시겠습니까?' : '선택된 메뉴가 없습니다',
          alert: (!isSelect),
          action: this.onAddSubmit
        };
      },

      onAddSubmit (){
        const selectedMenus = this.selectedMenus;
        this.$https.post('/setting/admin/menuGroup',{
          groupId : this.groups.groupId,
          menuIdList: selectedMenus
        }).then(() => {
          this.modal.open = false;
          setTimeout(() => {
            this.fetchMenuGroup(this.groups.groupId)
          }, 100)
        });
      },

      onRemoveItem (){
        this.selectedGroupMenus = this.getSelectedMenus(this.menuGroups);
        const isSelect = (this.selectedGroupMenus.length);
          console.log("test")
        this.modal = {
          open: true,
          type: (isSelect) ? 'done' : 'error',
          msg: isSelect ? '선택한 메뉴를 삭제하시겠습니까?' : '선택된 메뉴가 없습니다',
          alert: (!isSelect),
          action: this.onDeleteData
        };
      },

      onDeleteData (){
        this.modal.open = false;
        const selectedMenus = this.selectedGroupMenus;
        this.$https.put(`/setting/admin/menuGroup/${this.groups.groupId}`,{
          menuIdList: selectedMenus
        }).then(() => {
          this.modal.open = false;
          setTimeout(() => {
            this.fetchMenuGroup(this.groups.groupId)
          }, 100)
        });
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

      getSelectedMenus (menus){
        const selected = [];
        const loop = (list) => list.forEach(obj => {
          const child = obj.subMenuList;
          if (obj.selected){
            selected.push(obj.menuId);
          }
          if (child && child.length){
            loop(child);
          }
        })
        loop(menus);
        return selected;
      },
    }
  }
</script>
