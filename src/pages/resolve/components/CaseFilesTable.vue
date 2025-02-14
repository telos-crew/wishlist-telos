<template>
	<div
		id="case-files-table"
		class="q-pt-xl"
	>
		<q-table
			:title="finalTitle"
			:rows="useableCaseFiles"
			:columns="columns"
			row-key="name"
			class="resolve-table"
			:pagination="pagination"
		>
			<template v-slot:body-cell-claimant="props">
				<q-td :props="props">
					<div class="profile-item">
						<telos-profile-avatar
							:account_name="props.row.claimant"
							size="24px"
							childClass="avatar-wrap"
						></telos-profile-avatar>
						<div>&nbsp;{{ props.row.claimant }}</div>
					</div>
				</q-td>
			</template>
			<template v-slot:body-cell-respondant="props">
				<q-td :props="props">
					<div class="profile-item">
						<telos-profile-avatar
							:account_name="props.row.respondant"
							size="24px"
							childClass="avatar-wrap"
						></telos-profile-avatar>
						<div>&nbsp;{{ props.row.respondant }}</div>
					</div>
				</q-td>
			</template>
			<template v-slot:body-cell-arbitrators="props">
				<q-td :props="props">
					<div class="arbitrator-cell profile-item">
						<telos-profile-avatar
							v-if="props.row.arbitrators[0]"
							:account_name="props.row.arbitrators[0]"
							size="24px"
							childClass="avatar-wrap"
						></telos-profile-avatar>
						<div>&nbsp;{{ props.row.arbitrators[0] }}</div>
					</div>
				</q-td>
			</template>
			<template v-slot:body-cell-case_status="props">
				<q-td :props="props">
					{{ getCaseFileStatusSyntax(props.row.case_status) }}
				</q-td>
			</template>
			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<div>
						<q-btn-dropdown
							color="primary"
							label="Actions"
						>
							<q-list>
								<q-item
									clickable
									v-close-popup
									@click="goToCaseFile(props.row.case_id)"
								>
									<q-item-section>
										<q-item-label>{{
											$t('pages.resolve.case_files_view')
										}}</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
					</div>
				</q-td>
			</template>
		</q-table>
	</div>
</template>

<script>
import TelosProfileAvatar from 'src/components/common/TelosProfileAvatar.vue'
import { CASE_STATUS_LIST } from '../constants'

export default {
	props: ['caseFiles', 'title'],
	components: {
		TelosProfileAvatar
	},
	data() {
		return {
			columns: [
				{
					name: 'case_id',
					label: this.$t('pages.resolve.case_files_id'),
					field: 'case_id'
				},
				{
					name: 'claimant',
					label: this.$t('pages.resolve.case_files_claimant'),
					field: 'claimant'
				},
				{
					name: 'respondant',
					label: this.$t('pages.resolve.case_files_respondant'),
					field: 'respondant'
				},
				{
					name: 'arbitrators',
					label: this.$t('pages.resolve.case_files_arbitrators'),
					field: 'arbitrators'
				},
				{
					name: 'approvals',
					label: this.$t('pages.resolve.case_files_approvals'),
					field: 'approvals'
				},
				{
					name: 'case_status',
					label: this.$t('pages.resolve.case_files_status'),
					field: 'case_status'
				},
				{
					name: 'update_ts',
					label: this.$t('pages.resolve.case_files_updated'),
					field: 'update_ts'
				},
				{
					name: 'actions',
					label: this.$t('pages.resolve.case_files_actions'),
					field: 'actions'
				}
			],
			pagination: {
				rowsPerPage: 20
			}
		}
	},
	computed: {
		useableCaseFiles() {
			return this.caseFiles || this.$store.state.resolve.case_files || []
		},
		finalTitle() {
			return this.title || this.$t('pages.resolve.case_files_title')
		}
	},
	methods: {
		goToCaseFile(caseFileId) {
			this.$router.push({
				path: `case/${caseFileId}`,
				params: { caseFileId }
			})
		},
		getCaseFileStatusSyntax(index) {
			return this.$t(CASE_STATUS_LIST[index])
		}
	}
}
</script>

<style lang="scss">
#case-files-table {
	.arbitrator-cell {
		padding: 10px 0;
	}
	.profile-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		span {
			display: inline-block;
			line-height: 24px;
		}
	}
}
</style>
