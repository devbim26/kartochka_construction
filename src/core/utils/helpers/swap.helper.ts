export const swap = (obj: Record<string, unknown>) =>
	Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
