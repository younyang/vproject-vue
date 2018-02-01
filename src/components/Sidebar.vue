<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <template v-for="(item, index) in navItems">
          <template v-if="item.children">
            <!-- First level dropdown -->
            <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon">
              <template v-for="(childL1, index) in item.children">
                <template v-if="childL1.children">
                  <!-- Second level dropdown -->
                  <SidebarNavDropdown :name="childL1.name" :url="childL1.url" :icon="childL1.icon">
                    <template v-for="(childL2, index) in childL1.children">
                      <template v-if="childL2.children">
                        <!-- Third level dropdown -->
                        <SidebarNavDropdown :name="childL2.name" :url="childL2.url" :icon="childL2.icon">
                          <li class="nav-item" v-for="(childL3, index) in childL2.children">
                            <SidebarNavLink :name="childL3.name" :url="childL3.url" :icon="childL3.icon" :badge="childL3.badge" :variant="item.variant"/>
                          </li>
                        </SidebarNavDropdown>
                      </template>
                      <template v-else>
                        <SidebarNavItem :classes="item.class">
                          <SidebarNavLink :name="childL2.name" :url="childL2.url" :icon="childL2.icon" :badge="childL2.badge" :variant="item.variant"/>
                        </SidebarNavItem>
                      </template>
                    </template>
                  </SidebarNavDropdown>
                </template>
                <template v-else>
                  <SidebarNavItem :classes="item.class">
                    <SidebarNavLink :name="childL1.name" :url="childL1.url" :icon="childL1.icon" :badge="childL1.badge" :variant="item.variant"/>
                  </SidebarNavItem>
                </template>
              </template>
            </SidebarNavDropdown>
          </template>
          <template v-else>
            <SidebarNavItem :classes="item.class">
              <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge" :variant="item.variant"/>
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
      navItems: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    components: {
      SidebarNavDropdown,
      SidebarNavLink,
      SidebarNavItem
    },
    methods: {
      handleClick (e) {
        e.preventDefault()
        e.target.parentElement.classList.toggle('open')
      }
    }
  }
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
