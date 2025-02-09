<script>
import Btn from './CustomButton'
import { mapActions, mapGetters } from 'vuex'
import { scroll } from 'quasar'

export default {
	name: 'ActionBar',
	components: { Btn },
	props: {
		treasuriesOptions: {},
		activeFilter: {
			type: String
		},
		election: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			model: 'one',
			isTypeMenuOpen: false,
			isStatusMenuOpen: false,
			isGroupMenuOpen: false,
			isSortingMenuOpen: false,
			isTypeDialogOpen: false,
			isStatusDialogOpen: false,
			isGroupDialogOpen: false,
			isSortingDialogOpen: false,
			isConfirmBtn: false,
			isFilterMenu320Open: false,
			typeGroup: [],
			electionsPageTypeOptions: [
				{ label: 'Election', value: 'election' },
				{ label: 'Referendum', value: 'referendum' },
				{ label: 'Leaderboard', value: 'leaderboard' }
			],
			proposalsPageTypeOptions: [
				{ label: 'Poll', value: 'poll' },
				{ label: 'Proposal', value: 'proposal' }
			],
			statusGroup: [],
			statusOptions: [
				{ label: 'Active', value: 'active' },
				{ value: 'not_started', label: 'Not started' },
				{ label: 'Expired', value: 'expired' },
				{ label: 'Closed', value: 'closed' },
				{ label: 'Cancelled', value: 'cancelled' },
				{ label: 'Archived', value: 'archived' },
				{ label: 'Setup', value: 'setup' }
			],
			sortMode: '',
			sortOptions: [
				{ label: 'A-Z', value: 'A-Z' },
				{ label: 'Z-A', value: 'Z-A' },
				{ label: 'Most popular', value: 'Most popular' },
				{ label: 'Least popular', value: 'Least popular' }
			],
			submitTypesResult: [],
			submitStatusesResult: [],
			treasuryBar: 'VOTE',
			isBallotListRowDirection: true,
			notice: false
		}
	},
	methods: {
		...mapActions('trails', [
			'fetchFees',
			'fetchBallots',
			'castVote',
			'fetchTreasuries',
			'fetchBallotsByStatus'
		]),
		addToLocalStorage() {
			localStorage.isNewUser = false
			this.isNewUser = false
		},
		openBallotForm() {
			this.$emit('open-ballot-form')
		},
		toggleMenu(isMenuOpen, group, submitResult) {
			if (this[submitResult]) {
				this[group] = this[submitResult]
			}
			this[isMenuOpen] = !this[isMenuOpen]
		},
		onSubmitTypes(evt) {
			const formData = new FormData(evt.target)
			const submitResult = []

			for (const [name, value] of formData.entries()) {
				submitResult.push({
					name,
					value
				})
			}

			this.submitTypesResult = JSON.parse(JSON.stringify(submitResult)).reduce(
				(typeValues, item) => {
					return [...typeValues, item.value]
				},
				[]
			)
			this.$refs.typesMenu.hide()
		},
		onSubmitStatuses(evt) {
			const formData = new FormData(evt.target)
			const submitResult = []

			for (const [name, value] of formData.entries()) {
				submitResult.push({
					name,
					value
				})
			}

			this.submitStatusesResult = JSON.parse(
				JSON.stringify(submitResult)
			).reduce((statusesValues, item) => {
				return [...statusesValues, item.value]
			}, [])
			this.$refs.statusesMenu.hide()
		},
		clearFilter(filter, isMenuOpen) {
			this[filter] = []
			this[isMenuOpen] = false
		},
		discardFilter(filter, group) {
			this[group] = []
			this[filter] = []
		},
		discardAllFilter() {
			this.treasuryBar = null
			this.submitTypesResult = []
			this.submitStatusesResult = []
		},
		clearGroupFilter() {
			this.treasuryBar = null
			this.isGroupMenuOpen = false
		},
		clearSort() {
			this.sortMode = ''
			this.isSortingMenuOpen = false
		},
		isFiltersApplied() {
			return (
				this.treasuryBar !== null ||
				this.submitTypesResult.length ||
				this.submitStatusesResult.length
			)
		},
		getFilterBtnLabel(filter, submitResult, options) {
			if (this[submitResult].length === 1) {
				const label = this[options].find(
					(option) => option.value === this[submitResult][0]
				).label
				return label
			}

			return `${filter}: ${this[submitResult].length}`
		},
		handleScroll() {
			const obj = this.$el.querySelector('.scroll-anim')
			const filter320 = this.$el.querySelector('.bar-filter-menu-320-wrapper')
			const { bottom } = obj.getBoundingClientRect()
			const height = document.documentElement.clientHeight
			this.isFilterMenu320Open =
				bottom + height < height &&
				window.getComputedStyle(filter320).display !== 'none'
		},
		handleFilterBtnClick() {
			const { getScrollTarget, setScrollPosition } = scroll
			const filter = this.$el.querySelector('.bar-filter-menu-320-wrapper')
			const offset = filter.offsetTop
			const target = getScrollTarget(filter)
			setScrollPosition(target, offset, 0)
		},
		showFilter() {
			this.isFilterOpen = true
		},
		openNotice() {
			this.notice = true
		},
		setTreasuryBar: function (treasury) {
			console.log('ActionBar.setTreasuryBar()', treasury)
			this.treasuryBar = treasury
		},
		setFilterParams(path) {
			if (path === 'amend-ballots') {
				this.typeGroup = []
				this.submitTypesResult = []
				this.statusGroup = ['active']
				this.submitStatusesResult = ['active']
			} else if (path === 'worker-proposals') {
				this.typeGroup = ['proposal']
				this.submitTypesResult = ['proposal']
				this.statusGroup = ['active']
				this.submitStatusesResult = ['active']
			} else if (path === 't-f-election') {
				this.typeGroup = ['election']
				this.submitTypesResult = ['election']
				this.statusGroup = ['active']
				this.submitStatusesResult = ['active']
			} else if (path === 'polls') {
				this.typeGroup = ['poll']
				this.submitTypesResult = ['poll']
				this.statusGroup = ['active']
				this.submitStatusesResult = ['active']
			}
			this.$emit('update-cards', {
				type: this.typeGroup,
				status: this.statusGroup,
				treasury: this.treasuryBar
			})
		}
	},
	mounted() {
		this.setFilterParams(this.activeFilter)
	},
	created() {
		window.addEventListener('scroll', this.handleScroll)
	},
	unmounted() {
		window.removeEventListener('scroll', this.handleScroll)
	},
	computed: {
		...mapGetters('accounts', ['isAuthenticated']),
		typeOptions() {
			if (this.$route.path.indexOf('election') > 0) {
				return this.electionsPageTypeOptions
			} else {
				return this.proposalsPageTypeOptions
			}
		}
	},
	watch: {
		$route(to) {
			if (to.params.id !== undefined) {
				this.showBallot = true
			} else {
				this.showBallot = false
			}
		},
		activeFilter: function () {
			this.setFilterParams(this.activeFilter)
		},
		treasuryBar: function () {
			this.$emit('update-treasury', this.treasuryBar)
		},
		submitStatusesResult: function (val, old) {
			if (val !== old) {
				this.statusGroup = this.submitStatusesResult
				this.$emit('update-statuses', this.submitStatusesResult)
			}
		},
		submitTypesResult: function (val, old) {
			if (val !== old) {
				this.typeGroup = this.submitTypesResult
				this.$emit('update-categories', this.submitTypesResult)
			}
		},
		treasuriesOptions: {
			immediate: true,
			handler: async function (val) {
				if (!val.length) {
					// TODO past 100 groups we need to switch to autocomplete search
					await this.fetchTreasuries()
				}
			}
		},
		isBallotListRowDirection: function (val, old) {
			if (val !== old) {
				this.$emit('change-diraction', this.isBallotListRowDirection)
			}
		},
		sortMode: function () {
			this.$emit('change-sort-option', this.sortMode)
		}
	}
}
</script>
<template lang="pug">
div.bar-filter-wrapper
    div.column.bar-filter-menu-320-wrapper
      div.bar-filter-menu-320.column
        div.menu-320-title-wrapper.row.items-center
          div.menu-320-title {{ $t('pages.trails.ballots.actionBar.filterTitle') }}
          q-icon.filter-icon(name="filter_list")
        div.dialog-btn-wrapper.column
          div(v-if="!sortMode")
            q-btn.dialog-btn.filter-type-btn-320(
              :label="$t('pages.trails.ballots.actionBar.sorting')"
              icon-right="fas fa-chevron-down"
              @click="toggleMenu('isSortingDialogOpen')"
              color="primary"
              no-caps
              outline
              flat
              align="left"
            )
            q-dialog(
              v-model="isSortingDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.sorting') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                q-scroll-area
                  q-option-group.bar-filter-menu-options.options-320(
                    v-model="sortMode"
                    :options="sortOptions"
                    color="primary"
                  )
          div.flex.no-wrap(v-else)
            q-btn.bar-filter-btn.left-btn.left-btn-320(
              :label="sortMode"
              @click="toggleMenu('isSortingDialogOpen')"
              color="primary"
              no-caps
            )
            q-dialog(
              v-model="isSortingDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.sorting') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                q-scroll-area
                  q-option-group.bar-filter-menu-options.options-320(
                    v-model="sortMode"
                    :options="sortOptions"
                    color="primary"
                  )
            q-btn.bar-filter-btn.right-btn.right-btn-320(
              @click="clearSort()"
              icon="close"
              color="primary"
            )
          div(v-if="submitTypesResult.length === 0")
            q-btn.dialog-btn.filter-type-btn-320(
              :label="$t('pages.trails.ballots.actionBar.typeFilter')"
              icon-right="fas fa-chevron-down"
              @click="toggleMenu('isTypeDialogOpen')"
              color="primary"
              no-caps
              outline
              flat
              align="left"
              v-if="!election"
            )
            q-dialog(
              v-model="isTypeDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.typeFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                div
                  q-form.bar-filter-menu-form.dialog-form(@submit="onSubmitTypes")
                    q-option-group.bar-filter-menu-options.options-320(
                      name="type"
                      v-model="typeGroup"
                      :options="typeOptions"
                      color="primary"
                      type="checkbox"
                    )
                    div.menu-form-btns-wrapper.row.justify-between
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnDiscard')"
                        @clickBtn="discardFilter('submitTypesResult', 'typeGroup')"
                        btnWidth='142'
                        fontSize='15'
                      )
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnApply')"
                        primary
                        type="submit"
                        btnWidth='142'
                        fontSize='15'
                      )
          div.flex.no-wrap(v-else)
            q-btn.bar-filter-btn.left-btn.left-btn-320(
              v-if="!election"
              :label="getFilterBtnLabel(\
                $t('pages.trails.ballots.actionBar.typeFilter'), 'submitTypesResult', 'typeOptions')"
              @click="toggleMenu('isTypeDialogOpen')"
              color="primary"
              no-caps
            )
            q-dialog(
              v-model="isTypeDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.typeFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                div
                  q-form.bar-filter-menu-form.dialog-form(@submit="onSubmitTypes")
                    q-option-group.bar-filter-menu-options.options-320(
                      name="type"
                      v-model="typeGroup"
                      :options="typeOptions"
                      color="primary"
                      type="checkbox"
                    )
                    div.menu-form-btns-wrapper.row.justify-between
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnDiscard')"
                        @clickBtn="discardFilter('submitTypesResult', 'typeGroup')"
                        btnWidth='142'
                        fontSize='15'
                      )
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnApply')"
                        primary
                        type="submit"
                        btnWidth='142'
                        fontSize='15'
                      )
            q-btn.bar-filter-btn.right-btn.right-btn-320(
              @click="clearFilter('submitTypesResult', 'isTypeMenuOpen')"
              icon="close"
              color="primary"
            )
          div(v-if="submitStatusesResult.length === 0")
            q-btn.dialog-btn.filter-type-btn-320(
              :label="$t('pages.trails.ballots.actionBar.statusFilter')"
              icon-right="fas fa-chevron-down"
              @click="toggleMenu('isStatusDialogOpen')"
              color="primary"
              no-caps
              outline
              flat
              align="left"
            )
            q-dialog(
              v-model="isStatusDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.statusFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                div
                  q-form.bar-filter-menu-form.dialog-form(@submit="onSubmitStatuses")
                    q-option-group.bar-filter-menu-options.options-320(
                      name="status"
                      v-model="statusGroup"
                      :options="statusOptions"
                      color="primary"
                      type="checkbox"
                    )
                    div.menu-form-btns-wrapper.row.justify-between
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnDiscard')"
                        @clickBtn="discardFilter('submitStatusesResult', 'statusGroup')"
                        btnWidth='142'
                        fontSize='15'
                      )
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnApply')"
                        primary
                        type="submit"
                        btnWidth='142'
                        fontSize='15'
                      )
          div.flex.no-wrap(v-else)
            q-btn.bar-filter-btn.left-btn.left-btn-320(
              :label="getFilterBtnLabel(\
                $t('pages.trails.ballots.actionBar.statusFilter'), 'submitStatusesResult', 'statusOptions')"
              @click="toggleMenu('isStatusDialogOpen')"
              color="primary"
              no-caps
            )
            q-dialog(
              v-model="isStatusDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.statusFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                div
                  q-form.bar-filter-menu-form.dialog-form(@submit="onSubmitStatuses")
                    q-option-group.bar-filter-menu-options.options-320(
                      name="status"
                      v-model="statusGroup"
                      :options="statusOptions"
                      color="primary"
                      type="checkbox"
                    )
                    div.menu-form-btns-wrapper.row.justify-between
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnDiscard')"
                        @clickBtn="discardFilter('submitStatusesResult', 'statusGroup')"
                        btnWidth='142'
                        fontSize='15'
                      )
                      btn(
                        :labelText="$t('pages.trails.ballots.actionBar.btnApply')"
                        primary
                        type="submit"
                        btnWidth='142'
                        fontSize='15'
                      )
            q-btn.bar-filter-btn.right-btn.right-btn-320(
              @click="clearFilter('submitStatusesResult', 'isStatusDialogOpen')"
              icon="close"
              color="primary"
            )
          div(v-if="!treasuryBar")
            q-btn.dialog-btn.filter-type-btn-320(
              :label="$t('pages.trails.ballots.actionBar.groupFilter')"
              icon-right="fas fa-chevron-down"
              @click="toggleMenu('isGroupDialogOpen')"
              color="primary"
              no-caps
              outline
              flat
              align="left"
            )
            q-dialog(
              v-model="isGroupDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.groupFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                q-scroll-area
                  q-option-group.bar-filter-menu-options.options-320(
                    v-model="treasuryBar"
                    :options="treasuriesOptions"
                    color="primary"
                  )
          div.flex.no-wrap(v-else)
            q-btn.bar-filter-btn.left-btn.left-btn-320(
              :label="treasuryBar"
              @click="toggleMenu('isGroupDialogOpen')"
              color="primary"
              no-caps
            )
            q-dialog(
              v-model="isGroupDialogOpen"
              position="bottom"
            )
              div.column.dialog-wrapper
                div.flex.justify-between.dialog-title
                  div.flex.items-center
                    div.user-name {{ $t('pages.trails.ballots.actionBar.groupFilter') }}
                  q-btn.close-btn(
                    flat
                    dense
                    round
                    v-close-popup
                    icon="close"
                    text-color="primary"
                  )
                q-scroll-area
                  q-option-group.bar-filter-menu-options.options-320(
                    v-model="treasuryBar"
                    :options="treasuriesOptions"
                    color="primary"
                  )
            q-btn.bar-filter-btn.right-btn.right-btn-320(
              @click="clearGroupFilter()"
              icon="close"
              color="primary"
            )
        btn.discard-all-btn(
          v-if="isFiltersApplied()"
          :labelText="$t('pages.trails.ballots.actionBar.btnDiscardAll')"
          @clickBtn="discardAllFilter()"
          fontSize='15'
        )
      div.btn-320-wrapper.row.items-center.scroll-anim(v-if="isAuthenticated")
        btn.create-poll-btn.btn-320(
          iconRight
          :labelText="$t('pages.trails.ballots.actionBar.btnCreateProposal')"
          primary
          @clickBtn="isAuthenticated ? openBallotForm() : openNotice()"
        )
    div.bar-wrapper.row.items-center(:class="{'menu-visible': isFilterMenu320Open}")
      q-btn-toggle.bar-btns-toggle(
        v-model="isBallotListRowDirection"
        flat
        toggle-color="primary"
        :options="[{value: true, slot: 'row'},{value: false, slot: 'column'}]"
      )
        template(v-slot:row)
          q-icon.bar-btn-toggle(name="eva-grid-outline")
        template(v-slot:column)
          q-icon.bar-btn-toggle(name="fas fa-bars")
      div.bar-custom-separator
      div.bar-filters
        div.row
          //- 'Sort by' button
          q-btn.q-mr-md(
            v-if="!sortMode"
            :label="'Sort by'"
            :class="{'menu-open': isSortingMenuOpen}"
            :icon-right="isSortingMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
            color="primary"
            no-caps
            flat
          )
            q-menu(
              @show="toggleMenu('isSortingMenuOpen')"
              @hide="toggleMenu('isSortingMenuOpen')"
              fit
              :offset="[30, 20]"
            )
              q-option-group.bar-filter-menu-options(
                  v-model="sortMode"
                  :options="sortOptions"
                  color="primary"
                )
          div(v-else)
            q-btn.q-mr-md.left-btn(
              :label="sortMode"
              color="primary"
              no-caps
              outline
            )
              q-menu(
                @show="toggleMenu('isSortingMenuOpen')"
                @hide="toggleMenu('isSortingMenuOpen')"
                fit
                :offset="[30, 20]"
              )
                q-option-group.bar-filter-menu-options(
                    v-model="sortMode"
                    :options="sortOptions"
                    color="primary"
                  )
            q-btn.q-mr-md.right-btn(
              @click="clearSort"
              icon="close"
              color="primary"
              outline
            )
          //- 'Type' button
          q-btn.q-mr-md(
            v-if="submitTypesResult.length === 0 && !election"
            :label="$t('pages.trails.ballots.actionBar.typeFilter')"
            :class="{'menu-open': isTypeMenuOpen}"
            :icon-right="isTypeMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
            color="primary"
            no-caps
            flat
          )
            q-menu(
              ref="typesMenu"
              @show="toggleMenu('isTypeMenuOpen')"
              @hide="toggleMenu('isTypeMenuOpen', 'typeGroup', 'submitTypesResult')"
              fit
              :offset="[30, 20]"
            )
              q-form.bar-filter-menu-form(@submit="onSubmitTypes")
                q-option-group.bar-filter-menu-options(
                  name="type"
                  v-model="typeGroup"
                  :options="typeOptions"
                  color="primary"
                  type="checkbox"
                )
                btn(
                  :labelText="$t('pages.trails.ballots.actionBar.btnConfirm')"
                  primary
                  type="submit"
                  btnWidth='142'
                  fontSize='16'
                )
          div(v-else-if="!election")
            q-btn.q-mr-md.left-btn(
              :label="getFilterBtnLabel(\
                $t('pages.trails.ballots.actionBar.typeFilter'), 'submitTypesResult', 'typeOptions')"
              color="primary"
              no-caps
              outline
            )
              q-menu(
                ref="typesMenu"
                @show="toggleMenu('isTypeMenuOpen')"
                @hide="toggleMenu('isTypeMenuOpen', 'typeGroup', 'submitTypesResult')"
                fit
                :offset="[30, 20]"
              )
                q-form.bar-filter-menu-form(@submit="onSubmitTypes")
                  q-option-group.bar-filter-menu-options(
                    name="type"
                    v-model="typeGroup"
                    :options="typeOptions"
                    color="primary"
                    type="checkbox"
                  )
                  btn(
                    :labelText="$t('pages.trails.ballots.actionBar.btnConfirm')"
                    primary
                    type="submit"
                    btnWidth='161'
                    fontSize='16'
                  )
            q-btn.q-mr-md.right-btn(
              @click="clearFilter('submitTypesResult', 'isTypeMenuOpen')"
              icon="close"
              color="primary"
              outline
            )
          //- 'State' button
          q-btn.q-mr-md(
            v-if="submitStatusesResult.length === 0"
            :label="$t('pages.trails.ballots.actionBar.statusFilter')"
            :class="{'menu-open': isStatusMenuOpen}"
            :icon-right="isStatusMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
            color="primary"
            no-caps
            flat
          )
            q-menu(
              ref="statusesMenu"
              @show="toggleMenu('isStatusMenuOpen')"
              @hide="toggleMenu('isStatusMenuOpen', 'statusGroup', 'submitStatusesResult')"
              fit
              :offset="[30, 20]"
            )
              q-form.bar-filter-menu-form(@submit="onSubmitStatuses")
                q-option-group(
                  name="status"
                  v-model="statusGroup"
                  :options="statusOptions"
                  color="primary"
                  type="checkbox"
                )
                btn(
                  :labelText="$t('pages.trails.ballots.actionBar.btnConfirm')"
                  primary
                  type="submit"
                  btnWidth='161'
                  fontSize='16'
                )
          div(v-else)
            q-btn.q-mr-md.left-btn(
              :label="getFilterBtnLabel(\
                $t('pages.trails.ballots.actionBar.statusFilter'), 'submitStatusesResult', 'statusOptions')"
              color="primary"
              no-caps
              outline
            )
              q-menu(
                ref="statusesMenu"
                @show="toggleMenu('isStatusMenuOpen')"
                @hide="toggleMenu('isStatusMenuOpen', 'statusGroup', 'submitStatusesResult')"
                fit
                :offset="[30, 20]"
              )
                q-form.bar-filter-menu-form(@submit="onSubmitStatuses")
                  q-option-group(
                    name="status"
                    v-model="statusGroup"
                    :options="statusOptions"
                    color="primary"
                    type="checkbox"
                  )
                  btn(
                    :labelText="$t('pages.trails.ballots.actionBar.btnConfirm')"
                    primary
                    type="submit"
                    btnWidth='161'
                    fontSize='16'
                  )
            q-btn.q-mr-md.right-btn(
              @click="clearFilter('submitStatusesResult', 'isStatusMenuOpen')"
              icon="close"
              color="primary"
              outline
            )
          //- 'DAO' button
          q-btn.q-mr-md(
            v-if="!treasuryBar"
            :label="$t('pages.trails.ballots.actionBar.groupFilter')"
            :class="{'menu-open': isGroupMenuOpen}"
            :icon-right="isGroupMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
            color="primary"
            no-caps
            flat
          )
            q-menu(
              @show="toggleMenu('isGroupMenuOpen')"
              @hide="toggleMenu('isGroupMenuOpen')"
              fit
              :offset="[30, 20]"
            )
              q-option-group.bar-filter-menu-options(
                  v-model="treasuryBar"
                  :options="treasuriesOptions"
                  color="primary"
                )
          div(v-else)
            q-btn.q-mr-md.left-btn(
              :label="treasuryBar"
              color="primary"
              no-caps
              outline
            )
              q-menu(
                @show="toggleMenu('isGroupMenuOpen')"
                @hide="toggleMenu('isGroupMenuOpen')"
                fit
                :offset="[30, 20]"
              )
                q-option-group.bar-filter-menu-options(
                    v-model="treasuryBar"
                    :options="treasuriesOptions"
                    color="primary"
                  )
            q-btn.q-mr-md.right-btn(
              @click="clearGroupFilter()"
              icon="close"
              color="primary"
              outline
            )
      q-btn.bar-filter-btn-320.q-mx-md(
        :label="$t('pages.trails.ballots.actionBar.filterTitle')"
        icon-right="filter_list"
        @click="handleFilterBtnClick()"
        color="primary"
        no-caps
        outline
      )
      div.separator-320.hide-under-mid(v-if="isAuthenticated")
      div.right-bar-section.col-grow.row.items-center.justify-end.hide-under-mid(v-if="isAuthenticated")
        q-separator.bar-separator-vertical.q-mr-md(vertical inset)
        q-btn.q-mx-md(
          :label="$t('pages.trails.ballots.actionBar.btnCreateProposal')"
          icon="add"
          color="primary"
          no-caps
          outline
          @click="isAuthenticated ? openBallotForm() : openNotice()"
        )

    div.btn-320-wrapper.row.items-center.scroll-anim.show-under-mid(v-if="isAuthenticated")
      q-btn.create-poll-btn.btn-320(
        :label="$t('pages.trails.ballots.actionBar.btnCreateProposal')"
        icon="add"
        color="primary"
        no-caps
        outline
        @click="isAuthenticated ? openBallotForm() : openNotice()"
      )
    q-dialog(v-model="notice")
      q-card.notice
        q-card-section.row.no-wrap
          div You have to be logged in to create a poll. If you don't have account please register
            q-btn(flat size="14px" color="primary" label="here" to="/accounts/add" no-caps).register-link
        q-card-actions(align="right" class="bg-white")
          q-btn(flat label="OK" v-close-popup)

</template>
<style lang="sass">

.bar-filter-wrapper
  margin: 0 0 8px 0

  // https://stackoverflow.com/a/74369087/2274525
  $shadow-1: 0px 20px 48px rgba(0, 9, 26, 0.08)
  $shadow-2: 0px 7px 15px rgba(0, 9, 26, 0.05)
  $shadow-3: 0px 3px 6px rgba(0, 9, 26, 0.04)
  $shadow-4: 0px 1px 2.25px rgba(0, 9, 26, 0.0383252)
  .create-ballot-fabbtn-holder
    z-index: 10
  .scroll-anim
    margin-top: 10px !important
    margin-bottom: 10px !important

  .bar-wrapper
    position: relative
    width: 100%
    height: 88px
    background: white
    box-shadow: $shadow-1, $shadow-2, $shadow-3, $shadow-4
    border-radius: 12px
  .q-btn-group
    margin-left: 24px
    gap: 4px
  .q-btn-group > .q-btn-item
    width: 40px
    height: 40px
    border-radius: 6px !important
  .bar-custom-separator
    width: 4px
    height: 4px
    background: rgba(0, 0, 0, 0.12)
    border-radius: 2px
    margin: 0 26px
  .bar-separator-vertical
    height: 68px
  .separator-320
    margin: 2px 20px
    display: none
    width: 4px
    height: 4px
    background: rgba(0, 9, 26, 0.1)
    border-radius: 2px
  .create-poll-btn
    height: 40px
    margin-right: 27px
  .bar-filter-menu-form
    padding: 12px
  .left-btn
    height: 40px
    margin-right: 1px
    border-radius: 3px 0 0 3px
    & .q-btn__wrapper::before
      border: none
  .right-btn
    height: 40px
    width: 40px
    padding: 0
    border-radius: 0 3px 3px 0
    font-size: 12px
    & .q-btn__wrapper::before
      border: none
  .bar-filter-btn-320
    display: none
  .q-btn__wrapper
    padding: 4px 12px
  .bar-filter-menu-320
    padding: 24px 12px 20px 12px
    background: white
    box-shadow: $shadow-1, $shadow-2, $shadow-3, $shadow-4
    border-radius: 12px
  .menu-320-title-wrapper
    margin-bottom: 20px
  .menu-320-title
    font-size: 22px
    font-weight: 600
    line-height: 150%
  .filter-icon
    margin: 8px
    font-size: 22px
    color: var(--q-color-primary)
  .dialog-btn-wrapper
    margin-bottom: 24px
  .btn-320
    margin: 0 !important
  .filter-type-btn-320 > .q-btn__wrapper > .q-btn__content
    text-align: left
    font-size: 16px
  .filter-type-btn-320 > .q-btn__wrapper > .q-btn__content > .block
    width: 58px
  .btn-320-wrapper
    margin: 24px 0
    width: 100%
    height: 64px
    justify-content: center
  .menu-visible
    display: flex !important
    position: fixed !important
    left: 0
    right: 0
  .bar-filter-menu-320-wrapper
    display: none
  .bar-filter-menu-options
    box-shadow: none !important
    margin: 0 0 20px 0
  .options-320 > div
    border: 1px solid #F2F3F4
    border-radius: 6px !important
    margin: 0
    border-radius: 0 !important
    &:first-child
      border-radius: 6px 6px 0 0 !important
      border-bottom: 1px solid #F2F3F4
    &:last-child
      border-radius: 0 0 6px 6px !important
  .q-scrollarea
    height: 60vh
  .left-btn-320
    height: 40px
    width: -webkit-fill-available
    border-radius: none
  .right-btn-320
    height: 40px
    width: 40px
    font-size: 12px
    border-radius: none
  .dialog-form
    padding: 0
  .q-menu
    min-width: 170px !important
  @media (max-width: 1280px)
    .bar-btn-toggle,
    .bar-btns-toggle,
    .bar-custom-separator
      display: none !important
  @media (max-width: 1130px)
    .bar-linear-gradient-left,
    .bar-linear-gradient-right
      display: block
    .bar-wrapper
      height: 72px
    .bar-separator-vertical
      height: 56px
    .bar-filters
      max-width: 73%
      overflow-x: scroll
    .bar-filters::-webkit-scrollbar
      width: 0
      display: none
    .bar-linear-gradient-right
      left: 70%
  @media (max-width: 1070px)
    .bar-filters
      max-width: 100%
    .bar-linear-gradient-right
      display: none
  @media (max-width: 940px)
    .bar-filters
      max-width: 100%
  .show-under-mid
    display: none
  @media (max-width: 930px)
    .hide-under-mid
      display: none
    .show-under-mid
      display: flex
  @media (max-width: 600px)
    .show-under-mid
      display: none
    .bar-filter-menu-320-wrapper
      display: flex
    .bar-wrapper
      display: none
      justify-content: space-between
      margin-bottom: 0
      bottom: 12px
      z-index: 10

    .dialog-btn-wrapper
      border: none

    .dialog-btn-wrapper button
      border: 1px solid #F2F3F4
      border-radius: 6px !important
      margin-bottom: 10px

    .dialog-btn-wrapper button.left-btn-320
      border-right: none
      border-top-right-radius: 0 !important
      border-bottom-right-radius: 0 !important

    .dialog-btn-wrapper button.right-btn-320
      border-left: none
      border-top-left-radius: 0 !important
      border-bottom-left-radius: 0 !important

    .bar-linear-gradient-left,
    .bar-linear-gradient-right,
    .bar-filters,
    .bar-separator-vertical
      display: none
    .separator-320,
    .bar-filter-btn-320
      display: block
    .right-bar-section
      flex: none
    .create-poll-btn
      margin-right: 12px
  @media (max-width: 400px)
    .bar-wrapper
      width: auto
      margin: 0 12px
    .bar-filter-menu-320
      margin-top: 24px
      border-radius: 0
    .btn-320-wrapper
      background: white
      box-shadow: 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04)
    .btn-320
      width: 296px !important
</style>
