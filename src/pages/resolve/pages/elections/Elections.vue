<template>
	<div id="resolve-elections-page">
		<div class="intro-row row">
			<div class="first col-xs-12 col-sm-6">
				<intro-card :heading="$t('pages.resolve.elections_heading')">
					<p>
						{{ $t('pages.resolve.elections_intro') }}
					</p>
					<strong>{{ $t('pages.resolve.elections_nominees') }}</strong>
					<ul>
						<li
							v-for="nominee in nominees"
							:key="nominee.nominee_name"
							class="nominee-item"
						>
							<telos-profile-avatar
								:account_name="nominee.nominee_name"
								size="24px"
								childClass="profile-avatar"
							></telos-profile-avatar>
							{{ nominee.nominee_name }}&nbsp; (<a
								target="_blank"
								:href="getIpfsLink(nominee)"
								>{{ $t('pages.resolve.elections_more_info') }}</a
							>)
							<q-icon
								v-if="isRemoveNomineeVisible(nominee.nominee_name)"
								@click="removeNominee()"
								name="remove"
								color="white"
								size=".8rem"
								class="remove-icon"
							/>
						</li>
					</ul>
				</intro-card>
			</div>
			<div class="second col-xs-12 col-sm-6">
				<election-steps
					v-if="isResolveStoresAvailable"
					remove-nominee="removeNominee"
				/>
			</div>
		</div>
		<elections-table v-if="isResolveStoresAvailable" />
	</div>
</template>

<script>
import ElectionsTable from '../../components/ElectionsTable.vue'
import ElectionSteps from './ElectionSteps.vue'
import IntroCard from '../../components/IntroCard.vue'
import TelosProfileAvatar from 'src/components/common/TelosProfileAvatar.vue'
import { mapGetters } from 'vuex'

export default {
	components: {
		ElectionsTable,
		ElectionSteps,
		IntroCard,
		TelosProfileAvatar
	},
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			isPastNomination: 'resolve/isPastNomination',
			isPastAddCandidates: 'resolve/isPastAddCandidates',
			isResolveStoresAvailable: 'resolve/isResolveStoresAvailable',
			account: 'accounts/account'
		}),
		nominees() {
			const nomineesList = this.$store.state.resolve.nominees
			if (nomineesList) {
				return nomineesList
			}
			return []
		}
	},
	methods: {
		isRemoveNomineeVisible(account) {
			return (
				!this.isPastNomination &&
				this.isPastAddCandidates &&
				account === this.account
			)
		},
		async removeNominee() {
			const unregNomineeActions = [
				{
					account: 'testtelosarb',
					name: 'unregnominee',
					data: {
						nominee: this.account
					}
				}
			]
			try {
				await this.$store.$api.signTransaction(unregNomineeActions)
			} catch (err) {
				console.log('endElection error: ', err)
			}
		},
		getIpfsLink(nominee) {
			return `https://api.dstor.cloud/ipfs/${nominee.credentials_link}`
		}
	}
}
</script>

<style lang="scss">
#resolve-elections-page {
	.intro-row {
		display: flex;
		flex: 1;
		flex-direction: row;

		.first,
		.second {
		}

		.first ul {
			list-style: none;
			padding-left: 0px;

			.nominee-item {
				.profile-avatar {
					margin-right: 12px;
				}

				a {
					color: inherit;
				}

				.remove-icon {
					background-color: red;
					border-radius: 50%;

					&:hover {
						cursor: pointer;
					}
				}
			}
		}
	}
}
</style>
