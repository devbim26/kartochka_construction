import { AxiosError } from 'axios';

function pickMessageFromRecord(record: Record<string, unknown>): string | null {
	for (const key of ['message', 'title', 'detail', 'error']) {
		const value = record[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
	}
	return null;
}

async function readBlobErrorMessage(blob: Blob): Promise<string | null> {
	try {
		const text = await blob.text();
		const trimmed = text.trim();
		if (!trimmed) return null;

		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				const json = JSON.parse(trimmed) as unknown;
				if (json && typeof json === 'object') {
					return pickMessageFromRecord(json as Record<string, unknown>) ?? trimmed;
				}
			} catch {
				return trimmed;
			}
		}

		return trimmed;
	} catch {
		return null;
	}
}

/** Безопасно извлекает текст ошибки из Axios (в т.ч. когда body — Blob). */
export async function getAxiosErrorMessage(
	error: unknown,
	fallback: string,
): Promise<string> {
	if (!(error instanceof AxiosError)) {
		return error instanceof Error && error.message.trim() ? error.message.trim() : fallback;
	}

	const data = error.response?.data;
	if (data == null || data === '') return fallback;

	if (typeof data === 'string') {
		const trimmed = data.trim();
		return trimmed || fallback;
	}

	if (data instanceof Blob) {
		return (await readBlobErrorMessage(data)) ?? fallback;
	}

	if (data instanceof ArrayBuffer) {
		return (
			(await readBlobErrorMessage(new Blob([data], { type: 'application/json' }))) ?? fallback
		);
	}

	if (typeof data === 'object') {
		return pickMessageFromRecord(data as Record<string, unknown>) ?? fallback;
	}

	return fallback;
}
