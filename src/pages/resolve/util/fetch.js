import axios from 'axios'

const NETWORK_HOST = process.env.NETWORK_HOST
const NETWORK_PROTOCOL = process.env.NETWORK_PROTOCOL

const TABLE_ROWS_SUFFIX = 'v1/chain/get_table_rows'
const TABLE_ROWS_ENDPOINT = `${NETWORK_PROTOCOL}://${NETWORK_HOST}/${TABLE_ROWS_SUFFIX}`

export const GET_TABLE_ROWS = async (config) => {
	const { data } = await axios({
		url: TABLE_ROWS_ENDPOINT,
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		data: {
			index_position: '1',
			json: true,
			key_type: 'i64',
			limit: 100,
			lower_bound: null,
			reverse: false,
			table_key: '',
			...config
		}
	})
	return data
}

export const getDstorLink = (hash) => {
	return `https://api.dstor.cloud/ipfs/${hash}`
}
