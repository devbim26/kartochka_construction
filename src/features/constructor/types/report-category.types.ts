export enum ReportCategory {
	Floor = 'Floor',
	Single = 'Single',
}

/** Подписи из OpenAPI x-enum-descriptions (RU). */
export const RuReportCategoryLabels: Record<ReportCategory, string> = {
	[ReportCategory.Floor]: 'Поэтажный план',
	[ReportCategory.Single]: 'Одиночная конструкция',
};

export const EnReportCategoryLabels: Record<ReportCategory, string> = {
	[ReportCategory.Floor]: 'Floor plan',
	[ReportCategory.Single]: 'Single construction',
};

export const getReportCategoryLabel = (
	value: string | undefined | null,
	locale: 'ru' | 'en' = 'ru',
): string => {
	if (!value) return '—';
	const map = locale === 'ru' ? RuReportCategoryLabels : EnReportCategoryLabels;
	return map[value as ReportCategory] ?? value;
};
