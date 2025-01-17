export const paginate = ({ current, max }: { current: number; max: number }) => {
	const prev = current === 1 ? null : current - 1,
		next = current === max ? null : current + 1,
		items = [1];

	if (current === 1 && max === 1) return { current, prev, next, items };
	if (current > 5) items.push(-1);

	const r = 2,
		r1 = current - r,
		r2 = current + r;

	for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);

	if (r2 + 1 < max) items.push(-1);
	if (r2 < max) items.push(max);

	return { current, prev, next, items };
};
