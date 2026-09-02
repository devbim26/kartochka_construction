/** ConnectionType уходит на API как число > 0 (0 бэкенд отклоняет). Без Linear/Spot-маппинга. */

const CONNECTION_TYPE_PARAM = 'ConnectionType';

export const parseConnectionTypeValueForServer = (raw: string | undefined | null): number => {
	const text = String(raw ?? '').trim().replace(',', '.');
	if (!text) return 0;
	// Legacy form values from previous Linear/Spot select — не через 0.
	if (text === 'Spot') return 2;
	if (text === 'Linear') return 1;
	const n = Number(text);
	return Number.isFinite(n) ? n : 0;
};

export const mapConnectionTypeValueFromApi = (raw: unknown): string => {
	const text = String(raw ?? '').trim();
	if (!text) return '';
	const n = Number(text.replace(',', '.'));
	if (Number.isFinite(n)) return String(n);
	return text;
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
