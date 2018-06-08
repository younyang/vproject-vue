<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <template v-for="(item, index) in navItems">
          <template v-if="item.subMenuList.length">

            <SidebarNavDropdown :name="item.menuName" :url="item.linkUrl" :icon="icon">
              <template v-for="(childL1, index) in item.subMenuList">
                <template v-if="childL1.subMenuList.length">

                  <SidebarNavDropdown :name="childL1.menuName" :url="childL1.linkUrl">
                    <template v-for="(childL2, index) in childL1.subMenuList">
                      <template v-if="childL2.subMenuList.length">

                        <SidebarNavDropdown :name="childL2.menuName" :url="childL2.linkUrl">
                          <li class="nav-item" v-for="(childL3, index) in childL2.subMenuList">
                            <SidebarNavLink :name="childL3.menuName" :url="childL3.linkUrl" />
                          </li>
                        </SidebarNavDropdown>
                      </template>
                      <template v-else>
                        <SidebarNavItem>
                          <SidebarNavLink :name="childL2.menuName" :url="childL2.linkUrl" />
                        </SidebarNavItem>
                      </template>
                    </template>
                  </SidebarNavDropdown>
                </template>
                <template v-else>
                  <SidebarNavItem>
                    <SidebarNavLink :name="childL1.menuName" :url="childL1.linkUrl" />
                  </SidebarNavItem>
                </template>
              </template>
            </SidebarNavDropdown>

          </template>

          <template v-else>
            <SidebarNavItem>
              <SidebarNavLink :name="item.menuName" :url="item.linkUrl" :icon="icon" />
            </SidebarNavItem>
          </template>
        </template>
      </ul>
      <slot></slot>
    </nav>
  </div>
</template>
<script>
  import SidebarNavDropdown from './SidebarNavDropdown'
  import SidebarNavLink from './SidebarNavLink'
  import SidebarNavItem from './SidebarNavItem'
  export default {
    name: 'sidebar',
    props: {
      icon: {
        type: String,
        default: 'icon-grid'
      }
    },
    components: {
      SidebarNavDropdown,
      SidebarNavLink,
      SidebarNavItem
    },

    data (){
      return {
        navItems: []
      }
    },

    created (){
      this.$eventBus.$on('menu', this.onReceiveMenu);
    },

    methods: {
      handleClick (e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open')
      },

      onReceiveMenu (nav){
        const filterMenu = (list) => {
          const filter = list.filter(obj => {
            if (obj.subMenuList.length) {
              obj.subMenuList = filterMenu(obj.subMenuList);
            }
            return (obj.menuUseYn)
          })
          return filter;
        };
        const list = nav[0].subMenuList.concat([{
          menuName: 'Migration 작업목록',
          menuUseYn: true,
          linkUrl: 'http://172.20.1.105:5001/view/contents',
          subMenuList: []
        },{
          menuName: 'Migration 대상목록',
          menuUseYn: true,
          linkUrl: 'http://172.20.1.105:5001/view/jobs',
          subMenuList: []
        }]);


        this.navItems = filterMenu(list)
      }
    }
  }
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
