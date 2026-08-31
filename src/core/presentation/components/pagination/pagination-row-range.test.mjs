/**
 * Unit-тесты подписи диапазона строк пагинации.
 * Запуск: npm run test:pagination
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const getPaginationRowRangeLabel = (state) => {
	const pageNumber = Math.max(Number(state.pageNumber) || 1, 1);
	const pageSize = Math.max(Number(state.pageSize) || 10, 1);
	const totalCount = Math.max(Number(state.totalCount) || 0, 0);
	const rangeStart = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
	const rangeEnd = Math.min(pageNumber * pageSize, totalCount);
	return `${rangeStart}-${rangeEnd} из ${totalCount}`;
};

describe('getPaginationRowRangeLabel', () => {
	it('shows 1-4 из 4 for a short first page (not 1-1 из 1)', () => {
		assert.equal(
			getPaginationRowRangeLabel({ pageNumber: 1, pageSize: 10, totalCount: 4 }),
			'1-4 из 4',
		);
	});

	it('shows full page range against totalCount', () => {
		assert.equal(
			getPaginationRowRangeLabel({ pageNumber: 1, pageSize: 10, totalCount: 52 }),
			'1-10 из 52',
		);
	});

	it('shows middle page range', () => {
		assert.equal(
			getPaginationRowRangeLabel({ pageNumber: 2, pageSize: 10, totalCount: 52 }),
			'11-20 из 52',
		);
	});

	it('shows last partial page', () => {
		assert.equal(
			getPaginationRowRangeLabel({ pageNumber: 6, pageSize: 10, totalCount: 52 }),
			'51-52 из 52',
		);
	});

	it('shows 0-0 из 0 when empty', () => {
		assert.equal(
			getPaginationRowRangeLabel({ pageNumber: 1, pageSize: 10, totalCount: 0 }),
			'0-0 из 0',
		);
	});
});
