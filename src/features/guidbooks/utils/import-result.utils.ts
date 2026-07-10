import type { ImportResultDto } from '@api-gen';
import type { AxiosResponse } from 'axios';
import {
	extractFilenameFromUrl,
	triggerExportDownload,
	type ExportDownloadAction,
} from './download-export.utils';

export async function parseImportResultFromResponse(
	response: AxiosResponse<unknown>,
): Promise<ImportResultDto | null> {
	const data = response.data;
	if (data == null) return null;

	if (typeof data === 'object' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
		return data as ImportResultDto;
	}

	if (data instanceof Blob) {
		try {
			const text = await data.text();
			const parsed = JSON.parse(text) as unknown;
			if (parsed && typeof parsed === 'object') {
				return parsed as ImportResultDto;
			}
		} catch {
			/* ignore */
		}
	}

	return null;
}

export function resolveImportDownloadAction(
	result: ImportResultDto,
	fallbackFilename: string,
): ExportDownloadAction | null {
	const fileUrl = result.fileUrl?.trim();
	if (!fileUrl) return null;

	const failed = result.failedCount ?? 0;
	const nameFromUrl = extractFilenameFromUrl(fileUrl);
	const filename = nameFromUrl ?? (failed > 0 ? fallbackFilename : '');

	return {
		type: 'url',
		url: fileUrl,
		filename,
	};
}

export async function triggerFileUrlDownload(url: string, filename: string): Promise<void> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.status}`);
		}
		const blob = await response.blob();
		triggerExportDownload({ type: 'blob', blob, filename });
	} catch {
		const link = document.createElement('a');
		link.href = url;
		if (filename) link.download = filename;
		link.rel = 'noopener noreferrer';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

export async function triggerDownloadAction(action: ExportDownloadAction): Promise<void> {
	if (action.type === 'url') {
		await triggerFileUrlDownload(action.url, action.filename);
		return;
	}
	triggerExportDownload(action);
}

export type ImportResultToast = {
	variant: 'success' | 'warning';
	message: string;
};

export function formatImportResultToast(
	result: ImportResultDto,
	messages: { success: string; summary: string },
): ImportResultToast {
	const total = result.totalCount ?? 0;
	const failed = result.failedCount ?? 0;
	const success = Math.max(0, total - failed);

	if (failed > 0) {
		return {
			variant: 'warning',
			message: messages.summary
				.replace('{success}', String(success))
				.replace('{total}', String(total))
				.replace('{failed}', String(failed)),
		};
	}

	return { variant: 'success', message: messages.success };
}
