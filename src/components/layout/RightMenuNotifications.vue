<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
	name: 'RightMenuNotifications',
	computed: {
		...mapGetters('notifications', ['notifications'])
	},
	methods: {
		...mapMutations('notifications', ['clearNotifications']),
		openUrl(url) {
			window.open(`${process.env.BLOCKCHAIN_EXPLORER}${url}`)
		}
	}
}
</script>

<template lang="pug">
.column.justify-between.full-height
  q-list(separator)
    q-item
      q-item-section.text-center
        strong {{ $t('notifications.title') }}
    q-item(
      v-if="notifications.length"
      v-for="notification in notifications"
      :key="notification.id"
      :class="{\
          'new-success': !notification.read && notification.status === 'success',\
          'new-error': !notification.read && notification.status === 'error'\
        }"
    )
      q-item-section(avatar)
        q-icon(
          :name="notification.icon"
          size="xs"
          :color="notification.status === 'success' ? 'green' : 'red'"
        )
      q-item-section
        q-item-label(overline) {{ $t(notification.title) }}
        q-item-label(caption) {{ notification.status === 'success' ? notification.content : notification.error }}
      q-item-section(
        v-if="notification.transaction"
        side
      )
        q-btn(
          color="primary"
          icon="fas fa-external-link-alt"
          @click="openUrl(`/transaction/${notification.transaction.transactionId}`)"
          target="_blank"
          dense
          flat
          size="8px"
          v-if="notification.transaction.transactionId!==null"
        )
          q-tooltip {{ $t('components.notifications.linkTip') }}
  q-btn(
    label="Clear all"
    color="primary"
    :style="{borderRadius: 0}"
    @click="clearNotifications"
  )
</template>

<style lang="sass" scoped>
.new-success
  background: rgba(0, 255, 0, 0.1)
.new-error
  background: rgba(255, 0, 0, 0.1)
</style>
