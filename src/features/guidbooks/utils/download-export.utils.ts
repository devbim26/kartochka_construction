import type { AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

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

export function normalizeExportFilename(filename: string, fallback: string): string {
	const trimmed = filename.trim();
	if (!trimmed) return fallback;

	if (/^https?:\/\//i.test(trimmed)) {
		try {
			const segment = new URL(trimmed).pathname.split('/').pop() || '';
			if (segment) return decodeURIComponent(segment);
		} catch {
			/* ignore */
		}
	}

	const baseName = trimmed.split(/[/\\]/).pop() || trimmed;
	if (/\.(xlsx|xls|csv)$/i.test(baseName)) return baseName;
	return baseName.includes('.') ? baseName : `${baseName}.xlsx`;
}

function extractFileUrlFromJson(payload: unknown): string | null {
	if (!payload || typeof payload !== 'object') return null;
	const record = payload as Record<string, unknown>;
	for (const key of ['fileUrl', 'url', 'downloadUrl']) {
		const value = record[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
	}
	return null;
}

async function readBlobAsJson(blob: Blob): Promise<unknown | null> {
	try {
		const text = await blob.text();
		if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) return null;
		return JSON.parse(text) as unknown;
	} catch {
		return null;
	}
}

function isZipArchiveBuffer(buffer: ArrayBuffer): boolean {
	if (buffer.byteLength < 4) return false;
	const bytes = new Uint8Array(buffer.slice(0, 4));
	return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

async function isZipArchiveBlob(blob: Blob): Promise<boolean> {
	return isZipArchiveBuffer(await blob.slice(0, 4).arrayBuffer());
}

function toExcelBlob(data: ArrayBuffer, contentType: string): Blob {
	const mime = contentType.split(';')[0]?.trim();
	return new Blob([data], {
		type: mime && mime.includes('spreadsheet') ? mime : XLSX_MIME,
	});
}

/** Бинарное тело ответа с типом из Content-Type (важно для Excel и расширения из заголовка). */
export function createBlobFromExportResponse(
	response: AxiosResponse<Blob | ArrayBuffer>,
): Blob {
	const ct = getHeader(response.headers, 'content-type') ?? '';
	const mime = ct.split(';')[0]?.trim();

	const data = response.data;
	if (data instanceof Blob) {
		const needsRetype =
			mime &&
			(!data.type ||
				data.type === 'application/octet-stream' ||
				data.type === 'binary/octet-stream' ||
				data.type.includes('json'));
		return needsRetype ? new Blob([data], { type: mime }) : data;
	}

	return new Blob([data], { type: mime || XLSX_MIME });
}

export type ExportDownloadAction =
	| { type: 'blob'; blob: Blob; filename: string }
	| { type: 'url'; url: string; filename: string };

/**
 * API экспорта может вернуть файл (xlsx) или JSON с fileUrl (MinIO).
 * Во втором случае открываем ссылку напрямую — как для отчётов.
 */
export async function resolveExportDownloadAction(
	response: AxiosResponse<unknown>,
	fallbackFilename: string,
): Promise<ExportDownloadAction | null> {
	const headers = response.headers;
	const filename = normalizeExportFilename(
		getFilenameFromExportHeaders(headers, fallbackFilename),
		fallbackFilename,
	);
	const contentType = getHeader(headers, 'content-type')?.toLowerCase() ?? '';
	const data = response.data;

	if (data == null) return null;

	if (typeof data === 'object' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
		const fileUrl = extractFileUrlFromJson(data);
		if (fileUrl) return { type: 'url', url: fileUrl, filename };
	}

	if (data instanceof ArrayBuffer) {
		if (contentType.includes('json')) {
			try {
				const fileUrl = extractFileUrlFromJson(JSON.parse(new TextDecoder().decode(data)));
				if (fileUrl) return { type: 'url', url: fileUrl, filename };
			} catch {
				/* ignore */
			}
		}
		if (isZipArchiveBuffer(data)) {
			return { type: 'blob', blob: toExcelBlob(data, contentType), filename };
		}
		return null;
	}

	const blob =
		data instanceof Blob
			? data
			: new Blob([data as BlobPart], {
					type: contentType.split(';')[0] || 'application/octet-stream',
				});

	if (contentType.includes('json') || blob.type.includes('json')) {
		const fileUrl = extractFileUrlFromJson(await readBlobAsJson(blob));
		if (fileUrl) return { type: 'url', url: fileUrl, filename };
	}

	if (!(await isZipArchiveBlob(blob))) {
		const fileUrl = extractFileUrlFromJson(await readBlobAsJson(blob));
		if (fileUrl) return { type: 'url', url: fileUrl, filename };
		return null;
	}

	const mime = blob.type;
	const needsRetype =
		!mime ||
		mime === 'application/octet-stream' ||
		mime === 'binary/octet-stream' ||
		mime.includes('json');
	const fileBlob = needsRetype
		? new Blob([await blob.arrayBuffer()], { type: XLSX_MIME })
		: blob;

	return { type: 'blob', blob: fileBlob, filename };
}

export function triggerExportDownload(action: ExportDownloadAction): void {
	if (action.type === 'url') {
		const link = document.createElement('a');
		link.href = action.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return;
	}

	const url = window.URL.createObjectURL(action.blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = action.filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}
