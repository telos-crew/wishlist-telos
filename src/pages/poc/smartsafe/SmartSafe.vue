<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import SafeCard from './components/SafeCard'

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'SmartSafe',
	components: {
		SafeCard
	},
	methods: {
		...mapActions('poc', ['fetchSafes']),
		...mapMutations('poc', ['resetSafes']),
		async onLock() {
			this.submitting = true
			const result = await this.toggleLock('locksafe')
			if (result) {
				this.transactionId = result.transactionId
			}
			this.submitting = false
		},
		async onUnlock() {
			this.submitting = true
			const result = await this.toggleLock('unlocksafe')
			if (result) {
				this.transactionId = result.transactionId
			}
			this.submitting = false
		},
		async onLoad(index, done) {
			await this.fetchSafes()
			done()
		}
	},
	computed: {
		...mapGetters('poc', ['safes', 'safesLoaded']),
		...mapGetters('accounts', ['accounts'])
	}
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .safes(ref='safesRef')
    q-infinite-scroll(
      :disable='safesLoaded'
      @load='onLoad'
      :offset='250'
      :scroll-target='$refs.safesRef'
    )
      .row.q-col-gutter-md
        .col-xs-12.col-sm-6.col-md-4(v-for='safe in safes', :key='safe.safe_name')
          safe-card(:safe='safe')
  q-page-sticky(
    position='bottom-right'
    :offset='[18, 18]'
  )
    q-btn(
      fab
      icon='fas fa-plus'
      color='accent'
      @click='show = true'
    )
</template>
