<script>
import { mapGetters } from 'vuex'
import ResolveMenu from './ResolveMenu.vue'

const NETWORK_ENV = process.env.NETWORK_ENV

export default {
	name: 'HeaderMenu',
	computed: {
		...mapGetters('accounts', ['isAuthenticated']),
		isTestnet() {
			return NETWORK_ENV === 'testnet'
		}
	},
	props: {
		activeFilter: {}
	},
	components: {
		ResolveMenu
	},
	data() {
		return {
			menuItems: [
				{
					label: this.$t('menu.wishlist'),
					route: '/wishlist'
				}
			],
			localFileter: this.activeFilter
		}
	},
	watch: {
		activeFilter: function () {
			this.localFileter = this.activeFilter
		},
		$route(to) {
			if (!to.path.includes('/trails/ballots')) {
				this.localFileter = ''
			}
		}
	}
}
</script>

<template lang="pug">
q-tabs(
    no-caps
    class="text-grey text-teal"
    indicator-color='primary'
    active-color="grey-9"
  )
  template(
    v-for="(item, index) in menuItems"
  )
    q-route-tab.q-mx-sm.header-menu-tab(
      :key="index"
      :name="item.label"
      :label="item.label"
      :to="item.route"
      v-if="item.route && !item.filter"
    )
    q-route-tab.q-mx-sm.header-menu-tab(
      :key="index"
      :name="item.label"
      :label="item.label"
      :to="item.route"
      v-if="item.route && item.filter"
      @click="item.filter ? $emit('set-active-filter', item.filter) : ''"
    )
    q-btn-dropdown.header-submenu-tab(auto-close stretch flat label="Decide" v-if="item.length > 0")
      q-list
        q-route-tab.q-mx-sm.header-submenu-item(
          v-for="(el,i) of item"
          :key="i"
          :name="el.label"
          :label="el.label"
          :to="'/trails/ballots'"
          @click="$emit('set-active-filter', el.filter)"
          :class="[el.filter === localFileter ? 'active-tab': '']"
        )
    div.custom-separator
  ResolveMenu(
    v-if="isTestnet"
  )
</template>

<style lang="sass">
.q-tabs
  height: 100%
  margin: 0 16px
  font-size: 16px
  font-weight: 600
.custom-separator
  width: 4px
  height: 4px
  background: rgba(0, 9, 26, 0.1)
  border-radius: 2px
  &:last-child
    display: none
.header-submenu-tab
  font-weight: bold
  text-transform: capitalize
  margin: 0 8px
  padding: 0 20px
.active-tab
  border-bottom: 5px solid $primary !important
.q-menu
  & .q-tab__indicator
    display: none
.header-submenu-item
  margin: 0
  border-bottom: 5px solid transparent
@media (max-width: 1440px)
  .header-submenu-tab
    padding: 0
@media (max-width: 1090px)
  .q-tabs
    margin: 0
    font-size: 14px
@media (max-width: 960px)
  .header-menu-tab
    padding: 0 8px
@media (max-width: 760px)
  .q-tabs
    display: none
</style>
