/** ConnectionType на API: линейный = 0, точечный = 1. */

const CONNECTION_TYPE_PARAM = 'ConnectionType';

export const parseConnectionTypeValueForServer = (raw: string | undefined | null): number => {
	const text = String(raw ?? '').trim().replace(',', '.');
	if (!text) return 0;
	if (text === 'Spot') return 1;
	if (text === 'Linear') return 0;
	const n = Number(text);
	if (!Number.isFinite(n)) return 0;
	// Legacy select: Linear=1, Spot=2 → backend: Linear=0, Spot=1.
	if (n === 2) return 1;
	return n;
};

export const mapConnectionTypeValueFromApi = (raw: unknown): string => {
	const text = String(raw ?? '').trim();
	if (!text) return '';
	if (text === 'Spot') return '1';
	if (text === 'Linear') return '0';
	const n = Number(text.replace(',', '.'));
	if (!Number.isFinite(n)) return text;
	// Legacy stored Spot=2 → select value '1'.
	if (n === 2) return '1';
	return String(n);
};

export const parseMaterialTypeValueForServer = (
	materialParameter: string,
	raw: string | undefined | null,
	parseNumeric: (value: string | undefined | null) => number,
): number => {
	if (materialParameter === CONNECTION_TYPE_PARAM) {
		return parseConnectionTypeValueForServer(raw);
	}
	return parseNumeric(raw);
};
