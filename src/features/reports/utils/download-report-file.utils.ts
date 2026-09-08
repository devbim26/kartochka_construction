import { getAxiosErrorMessage } from '@core';
import { ReportCategory } from '@features/constructor';
import { reportReceiveFloor, reportReceiveSingle } from '@features/constructor/services';

const resolveReportFileUrl = (data: unknown): string | null => {
	if (typeof data === 'string') {
		const trimmed = data.trim();
		if (!trimmed) return null;
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				return resolveReportFileUrl(JSON.parse(trimmed));
			} catch {
				return null;
			}
		}
		return trimmed;
	}

	if (data && typeof data === 'object') {
		const record = data as Record<string, unknown>;
		for (const key of ['fileUrl', 'url', 'downloadUrl', 'file', 'link']) {
			const value = record[key];
			if (typeof value === 'string' && value.trim()) return value.trim();
		}
	}

	return null;
};

const triggerReportFileDownload = (url: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

/** Скачивание файла отчёта по ReportInfoId — тот же receive, что на странице расчёта. */
export const downloadReportFileByInfoId = async (params: {
	reportInfoId: string;
	reportCategory: ReportCategory;
	fallbackError?: string;
}): Promise<void> => {
	const fallbackError = params.fallbackError || 'Ошибка скачивания отчета';
	const response =
		params.reportCategory === ReportCategory.Floor
			? await reportReceiveFloor(params.reportInfoId)
			: await reportReceiveSingle(params.reportInfoId);

	if (response?.status !== 200) {
		throw new Error(fallbackError);
	}

	const fileUrl = resolveReportFileUrl(response.data as unknown);
	if (!fileUrl) {
		throw new Error(fallbackError);
	}

	triggerReportFileDownload(fileUrl);
};

export const getDownloadReportErrorMessage = async (
	error: unknown,
	fallback = 'Ошибка скачивания отчета',
): Promise<string> => {
	if (error instanceof Error && error.message && !(error as { isAxiosError?: boolean }).isAxiosError) {
		return error.message;
	}
	return (await getAxiosErrorMessage(error, fallback)) || fallback;
};
