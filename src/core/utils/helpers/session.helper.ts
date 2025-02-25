export const getSessionStorageData = <T>(key: string): T => {
	const storedValue = sessionStorage.getItem(key);
	if (storedValue) {
		try {
			return JSON.parse(storedValue) as T;
		} catch {
			return storedValue as unknown as T;
		}
	} else {
		return storedValue as unknown as T;
	}
};
