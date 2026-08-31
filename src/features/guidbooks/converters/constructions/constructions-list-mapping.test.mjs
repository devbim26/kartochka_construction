/**
 * Unit-тесты маппинга priority / Rw / Lnw списка конструкций.
 * Запуск: npm run test:constructions-list
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const ClientPriority = {
	Zero: 'Zero',
	One: 'One',
	Two: 'Two',
	Three: 'Three',
	Four: 'Four',
	Five: 'Five',
	Six: 'Six',
	Seven: 'Seven',
	Eight: 'Eight',
	Nine: 'Nine',
	Ten: 'Ten',
};

const PRIORITY_BY_INDEX = [
	ClientPriority.Zero,
	ClientPriority.One,
	ClientPriority.Two,
	ClientPriority.Three,
	ClientPriority.Four,
	ClientPriority.Five,
	ClientPriority.Six,
	ClientPriority.Seven,
	ClientPriority.Eight,
	ClientPriority.Nine,
	ClientPriority.Ten,
];

const CLIENT_PRIORITY_VALUES = new Set(Object.values(ClientPriority));

const IndexType = {
	Rw: 'Rw',
	Lnw: 'Lnw',
};

const resolveClientPriorityValue = (value) => {
	if (value == null || value === '') return '';

	if (typeof value === 'number' && Number.isInteger(value)) {
		return PRIORITY_BY_INDEX[value] ?? '';
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) return '';

		if (/^\d+$/.test(trimmed)) {
			const index = Number(trimmed);
			return PRIORITY_BY_INDEX[index] ?? '';
		}

		if (CLIENT_PRIORITY_VALUES.has(trimmed)) return trimmed;
		return '';
	}

	return '';
};

const mapLaboratoryIndexValueToClient = (lab, expectedIndex) => {
	if (lab?.indexValue == null || !Number.isFinite(Number(lab.indexValue))) {
		return '';
	}
	if (expectedIndex && lab.index && lab.index !== expectedIndex) {
		return '';
	}
	return String(Math.round(Number(lab.indexValue)));
};

const mapConstructionRwToClient = (data) => {
	if (data.rw != null && data.rw !== '') {
		const n = Number(data.rw);
		if (Number.isFinite(n)) return String(Math.round(n));
	}

	const fromLab = mapLaboratoryIndexValueToClient(data.airNoiseLaboratoryData, IndexType.Rw);
	if (fromLab) return fromLab;

	const raw = data.labR;
	if (raw == null || raw === '') return '';
	const n = Number(raw);
	if (!Number.isFinite(n)) return '';
	return String(Math.round(n));
};

const mapConstructionLnwToClient = (data) => {
	if (data.lnw != null && data.lnw !== '') {
		const n = Number(data.lnw);
		if (Number.isFinite(n)) return String(Math.round(n));
	}

	return mapLaboratoryIndexValueToClient(data.impactNoiseLaboratoryData, IndexType.Lnw);
};

describe('resolveClientPriorityValue', () => {
	it('maps string enum', () => {
		assert.equal(resolveClientPriorityValue('Five'), 'Five');
	});

	it('maps numeric enum from JSON including 0', () => {
		assert.equal(resolveClientPriorityValue(0), 'Zero');
		assert.equal(resolveClientPriorityValue(5), 'Five');
		assert.equal(resolveClientPriorityValue('3'), 'Three');
		assert.equal(resolveClientPriorityValue(10), 'Ten');
	});

	it('returns empty for missing', () => {
		assert.equal(resolveClientPriorityValue(null), '');
		assert.equal(resolveClientPriorityValue(undefined), '');
		assert.equal(resolveClientPriorityValue(''), '');
	});
});

describe('getPriorityLabel (0–10)', () => {
	const getPriorityLabel = (value) => {
		if (value == null || value === '') return '—';
		if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10) {
			return String(value);
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (/^\d+$/.test(trimmed)) {
				const n = Number(trimmed);
				return n >= 0 && n <= 10 ? String(n) : '—';
			}
			const order = [
				'Zero',
				'One',
				'Two',
				'Three',
				'Four',
				'Five',
				'Six',
				'Seven',
				'Eight',
				'Nine',
				'Ten',
			];
			const index = order.indexOf(trimmed);
			return index >= 0 ? String(index) : '—';
		}
		return '—';
	};

	it('shows 0 for Zero / numeric 0 (not dash)', () => {
		assert.equal(getPriorityLabel(0), '0');
		assert.equal(getPriorityLabel('Zero'), '0');
	});

	it('shows 5 for Five', () => {
		assert.equal(getPriorityLabel('Five'), '5');
		assert.equal(getPriorityLabel(5), '5');
	});
});

describe('mapConstructionRwToClient', () => {
	it('prefers rw over lab data', () => {
		assert.equal(
			mapConstructionRwToClient({
				rw: 42,
				airNoiseLaboratoryData: { indexValue: 10, index: 'Rw' },
			}),
			'42',
		);
	});

	it('reads Rw from airNoiseLaboratoryData', () => {
		assert.equal(
			mapConstructionRwToClient({
				airNoiseLaboratoryData: { indexValue: 51.7, index: 'Rw' },
			}),
			'52',
		);
	});

	it('falls back to labR from legacy paginated list DTO', () => {
		assert.equal(mapConstructionRwToClient({ labR: 51.7 }), '52');
	});

	it('returns empty when both missing', () => {
		assert.equal(mapConstructionRwToClient({}), '');
	});
});

describe('mapConstructionLnwToClient', () => {
	it('prefers lnw over lab data', () => {
		assert.equal(
			mapConstructionLnwToClient({
				lnw: 58,
				impactNoiseLaboratoryData: { indexValue: 10, index: 'Lnw' },
			}),
			'58',
		);
	});

	it('reads Lnw from impactNoiseLaboratoryData', () => {
		assert.equal(
			mapConstructionLnwToClient({
				impactNoiseLaboratoryData: { indexValue: 57.4, index: 'Lnw' },
			}),
			'57',
		);
	});

	it('returns empty when both missing', () => {
		assert.equal(mapConstructionLnwToClient({}), '');
	});
});
