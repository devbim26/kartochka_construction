import { API_URL } from '@api-gen';

/** Absolute URL for API media (issuer logos, material images, SVG markup, etc.). */
export const resolveMediaUrl = (url?: string | null): string => {
	const raw = String(url ?? '').trim();
	if (!raw) return '';
	if (
		raw.startsWith('data:') ||
		raw.startsWith('blob:') ||
		raw.startsWith('http://') ||
		raw.startsWith('https://')
	) {
		return raw;
	}
	// SvgConstruction API may return raw SVG markup instead of a URL.
	if (raw.startsWith('<svg') || raw.startsWith('<?xml')) {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}`;
	}
	const base = String(API_URL || '').replace(/\/$/, '');
	if (!base) return raw;
	if (raw.startsWith('/')) return `${base}${raw}`;
	return `${base}/${raw}`;
};
