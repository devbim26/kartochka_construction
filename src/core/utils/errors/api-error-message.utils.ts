import { AxiosError } from 'axios';

function pickMessageFromRecord(record: Record<string, unknown>): string | null {
	for (const key of ['message', 'title', 'detail', 'error']) {
		const value = record[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
	}
	return null;
}

function formatValidationErrors(errors: unknown): string | null {
	if (!errors || typeof errors !== 'object') return null;

	const parts: string[] = [];
	for (const messages of Object.values(errors as Record<string, unknown>)) {
		if (Array.isArray(messages)) {
			for (const msg of messages) {
				if (typeof msg === 'string' && msg.trim()) parts.push(msg.trim());
			}
		} else if (typeof messages === 'string' && messages.trim()) {
			parts.push(messages.trim());
		}
	}

	return parts.length ? parts.join('\n') : null;
}

function extractErrorMessageFromResponseData(data: unknown, fallback: string): string {
	if (data == null || data === '') return fallback;

	if (typeof data === 'string') {
		return sanitizeMessage(data, fallback);
	}

	if (typeof data === 'object') {
		const record = data as Record<string, unknown>;
		const validationMessage = formatValidationErrors(record.errors);
		if (validationMessage) {
			return sanitizeMessage(validationMessage, fallback);
		}
		return sanitizeMessage(pickMessageFromRecord(record), fallback);
	}

	return fallback;
}

/** Отсекает «артефактные» тексты, которые нельзя показывать пользователю. */
function isUsableErrorMessage(message: string): boolean {
	const trimmed = message.trim();
	if (!trimmed) return false;
	if (trimmed === '[object Object]' || trimmed === '[object Blob]') return false;
	if (/^<!DOCTYPE|^<html[\s>]/i.test(trimmed)) return false;
	// Бинарный/служебный мусор или слишком длинный сырой ответ.
	if (trimmed.length > 500) return false;
	if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(trimmed)) return false;
	return true;
}

function sanitizeMessage(message: string | null | undefined, fallback: string): string {
	if (!message) return fallback;
	return isUsableErrorMessage(message) ? message.trim() : fallback;
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
					return pickMessageFromRecord(json as Record<string, unknown>) ?? null;
				}
			} catch {
				return isUsableErrorMessage(trimmed) ? trimmed : null;
			}
		}

		return isUsableErrorMessage(trimmed) ? trimmed : null;
	} catch {
		return null;
	}
}

/** Синхронный вариант — для RxJS catchError и прочих колбэков без async. */
export function getAxiosErrorMessageSync(error: unknown, fallback: string): string {
	if (!(error instanceof AxiosError)) {
		if (error instanceof Error && error.message.trim()) {
			return sanitizeMessage(error.message, fallback);
		}
		return fallback;
	}

	return extractErrorMessageFromResponseData(error.response?.data, fallback);
}

/** Безопасно извлекает текст ошибки из Axios (в т.ч. когда body — Blob). */
export async function getAxiosErrorMessage(
	error: unknown,
	fallback: string,
): Promise<string> {
	if (!(error instanceof AxiosError)) {
		if (error instanceof Error && error.message.trim()) {
			return sanitizeMessage(error.message, fallback);
		}
		return fallback;
	}

	const data = error.response?.data;
	if (data == null || data === '') return fallback;

	if (typeof data === 'string') {
		return sanitizeMessage(data, fallback);
	}

	if (data instanceof Blob) {
		return sanitizeMessage(await readBlobErrorMessage(data), fallback);
	}

	if (data instanceof ArrayBuffer) {
		return sanitizeMessage(
			await readBlobErrorMessage(new Blob([data], { type: 'application/json' })),
			fallback,
		);
	}

	return extractErrorMessageFromResponseData(data, fallback);
}
