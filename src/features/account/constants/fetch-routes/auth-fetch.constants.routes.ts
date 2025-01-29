export const ACCOUNT_FETCH_ROUTES = {
	group: 'account',
	getCurrent: {
		url: `${process.env.REACT_APP_API_URL}/Account/current`,
		fetch_name: 'getCurrent',
		async_thunk_route: 'account/current',
	},
	update: {
		url: `${process.env.REACT_APP_API_URL}/Account/update`,
		fetch_name: 'updateAccount',
		async_thunk_route: 'account/update',
	},
};
