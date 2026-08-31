/**
 * Unit-тесты валидации числовых параметров слоя конструкции.
 * Запуск: npm run test:validation
 *
 * Логика зеркалит material-parameter-value.validation.ts + MaterialTypeValues
 * (без webpack path-aliases — Node test runner).
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { z } = require('zod');

const MaterialParametrs = {
	Thickness: 'Thickness',
	Density: 'Density',
	RackStep: 'RackStep',
	ConnectionNumber: 'ConnectionNumber',
	ConnectionType: 'ConnectionType',
};

const MATERIAL_PARAMETER_MAX = {
	[MaterialParametrs.Thickness]: 1000,
	[MaterialParametrs.Density]: 20000,
	[MaterialParametrs.RackStep]: 10000,
	[MaterialParametrs.ConnectionNumber]: 10000,
};

const NUMERIC_MATERIAL_PARAMETERS = new Set([
	MaterialParametrs.Thickness,
	MaterialParametrs.Density,
	MaterialParametrs.RackStep,
	MaterialParametrs.ConnectionNumber,
	'Width',
]);

const parseMaterialParameterNumber = (value) => {
	const trimmed = String(value ?? '')
		.trim()
		.replace(',', '.');
	if (!trimmed) return null;
	const num = Number(trimmed);
	return Number.isFinite(num) ? num : null;
};

const getMaterialParameterValueError = (materialParameters, value) => {
	const raw = String(value ?? '').trim();
	if (!raw) return 'validation.required';

	if (!materialParameters || !NUMERIC_MATERIAL_PARAMETERS.has(materialParameters)) {
		return null;
	}

	const num = parseMaterialParameterNumber(raw);
	if (num == null) return 'validation.number';
	if (num <= 0) return 'validation.positiveNumber';

	const max = MATERIAL_PARAMETER_MAX[materialParameters];
	if (max != null && num > max) {
		if (materialParameters === MaterialParametrs.Thickness) {
			return 'validation.thicknessMax';
		}
		return 'validation.numberMax';
	}

	return null;
};

const MaterialTypeValues = z
	.object({
		value: z.string().min(1, 'validation.required'),
		materialParameters: z.string().min(1, 'validation.required'),
	})
	.superRefine((data, ctx) => {
		const errorKey = getMaterialParameterValueError(data.materialParameters, data.value);
		if (!errorKey || errorKey === 'validation.required') return;
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: errorKey,
			path: ['value'],
		});
	});

describe('getMaterialParameterValueError', () => {
	it('rejects negative thickness (−100)', () => {
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.Thickness, '-100'),
			'validation.positiveNumber',
		);
	});

	it('rejects zero thickness and density', () => {
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.Thickness, '0'),
			'validation.positiveNumber',
		);
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.Density, '0'),
			'validation.positiveNumber',
		);
	});

	it('rejects thickness above 1000 mm', () => {
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.Thickness, '1001'),
			'validation.thicknessMax',
		);
	});

	it('accepts valid thickness and density', () => {
		assert.equal(getMaterialParameterValueError(MaterialParametrs.Thickness, '100'), null);
		assert.equal(getMaterialParameterValueError(MaterialParametrs.Density, '650'), null);
	});

	it('rejects negative rack step, legacy width and connection count', () => {
		assert.equal(
			getMaterialParameterValueError('Width', '-1'),
			'validation.positiveNumber',
		);
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.RackStep, '-600'),
			'validation.positiveNumber',
		);
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.ConnectionNumber, '-5'),
			'validation.positiveNumber',
		);
	});

	it('ignores non-numeric parameters (ConnectionType)', () => {
		assert.equal(
			getMaterialParameterValueError(MaterialParametrs.ConnectionType, 'any'),
			null,
		);
	});
});

describe('MaterialTypeValues schema (−100 → validation error)', () => {
	it('fails safeParse for thickness −100 (FE gate before PUT; BE should return 400)', () => {
		const result = MaterialTypeValues.safeParse({
			materialParameters: MaterialParametrs.Thickness,
			value: '-100',
		});
		assert.equal(result.success, false);
		if (!result.success) {
			assert.ok(
				result.error.issues.some((i) => i.message === 'validation.positiveNumber'),
			);
		}
	});

	it('passes for positive thickness', () => {
		const result = MaterialTypeValues.safeParse({
			materialParameters: MaterialParametrs.Thickness,
			value: '120',
		});
		assert.equal(result.success, true);
	});
});
