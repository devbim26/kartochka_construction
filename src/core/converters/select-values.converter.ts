export const convertToSelectValues = (data?: Array<object>) => {
	if (!data) return null;
	return data.map((el) => {
		const obj = el as {
			name: string;
			id: string;
			title: string;
			username: string;
			firstName: string;
			lastName: string;
			middleName: string;
		};
		const fullName =
			!!obj.firstName?.length && !!obj.lastName?.length
				? `${obj.lastName} ${obj.firstName.charAt(0)}.${
						obj.middleName?.length ? obj.middleName.charAt(0) + '.' : ''
					}`
				: '';

		return {
			label: obj.name ?? obj.title ?? fullName ?? obj.username,
			value: obj.id!,
		};
	});
};
