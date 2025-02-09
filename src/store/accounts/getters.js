export const isAuthenticated = ({ account }) => !!account
export const account = ({ account }) => account
export const accountData = ({ accountData }) => accountData
export const user = ({ user }) => user
export const loading = ({ loading }) => loading
export const isAutoLoading = ({ autoLogin }) => autoLogin
export const signUpAccount = ({ signUpForm }) => signUpForm.account
export const availableAccounts = ({ availableAccounts }) =>
	availableAccounts.list.data
export const availableAccountsLoaded = ({ availableAccounts }) =>
	availableAccounts.list.loaded
export const requestAccount = ({ requestAccount }) => requestAccount
