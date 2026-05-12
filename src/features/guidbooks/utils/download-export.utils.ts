import type { AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

function getHeader(
	headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
	name: string,
): string | undefined {
	const withGet = headers as { get?: (key: string) => unknown };
	if (typeof withGet.get === 'function') {
		const direct = withGet.get(name);
		if (typeof direct === 'string') return direct;
		const lower = withGet.get(name.toLowerCase());
		if (typeof lower === 'string') return lower;
	}
	const raw = headers as Record<string, unknown>;
	const key = Object.keys(raw).find((k) => k.toLowerCase() === name.toLowerCase());
	const value = key ? raw[key] : undefined;
	return typeof value === 'string' ? value : undefined;
}

/** Имя файла из Content-Disposition (как при «Сохранить по ссылке»). */
export function getFilenameFromExportHeaders(
	headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
	fallback: string,
): string {
	const cd = getHeader(headers, 'content-disposition');
	if (!cd) return fallback;

	const utf8Star = /filename\*=(?:UTF-8''|utf-8'')([^;\r\n]+)/i.exec(cd);
	if (utf8Star?.[1]) {
		try {
			return decodeURIComponent(utf8Star[1].trim().replace(/^"|"$/g, ''));
		} catch {
			/* ignore */
		}
	}

	const quoted = /filename="([^"]+)"/i.exec(cd);
	if (quoted?.[1]) return quoted[1];

	const unquoted = /filename=([^;\r\n]+)/i.exec(cd);
	if (unquoted?.[1]) return unquoted[1].trim().replace(/^"|"$/g, '');

	return fallback;
}

/** Бинарное тело ответа с типом из Content-Type (важно для Excel и расширения из заголовка). */
export function createBlobFromExportResponse(
	response: AxiosResponse<Blob | ArrayBuffer>,
): Blob {
	const ct = getHeader(response.headers, 'content-type');
	const mime = ct?.split(';')[0]?.trim();

	const data = response.data;
	if (data instanceof Blob) {
		const needsRetype =
			mime &&
			(!data.type ||
				data.type === 'application/octet-stream' ||
				data.type === 'binary/octet-stream');
		return needsRetype ? new Blob([data], { type: mime }) : data;
	}

	return new Blob([data], { type: mime || 'application/octet-stream' });
}
