import { ReportCategory } from '@features/constructor/types';

/** Активный контекст (то, что открыто сейчас) — для сайдбара/хедера. */
export const ACTIVE_REPORT_ID_KEY = 'reportId';
export const ACTIVE_REPORT_TYPE_KEY = 'reportType';

/** Отдельные сессии: проект (Floor) и расчёт (Single) не затирают друг друга. */
export const PROJECT_REPORT_ID_KEY = 'projectReportId';
export const CALCULATION_REPORT_ID_KEY = 'calculationReportId';
/** Справочная (оригинальная) конструкция расчёта — не путать с клоном в отчёте. */
export const CALCULATION_CATALOG_CONSTRUCTION_ID_KEY = 'calculationCatalogConstructionId';

const migrateLegacyIntoSplitSessions = () => {
	if (typeof window === 'undefined') return;
	const legacyId = sessionStorage.getItem(ACTIVE_REPORT_ID_KEY);
	const legacyType = sessionStorage.getItem(ACTIVE_REPORT_TYPE_KEY);
	if (!legacyId || !legacyType) return;

	if (legacyType === ReportCategory.Floor && !sessionStorage.getItem(PROJECT_REPORT_ID_KEY)) {
		sessionStorage.setItem(PROJECT_REPORT_ID_KEY, legacyId);
	}
	if (
		legacyType === ReportCategory.Single &&
		!sessionStorage.getItem(CALCULATION_REPORT_ID_KEY)
	) {
		sessionStorage.setItem(CALCULATION_REPORT_ID_KEY, legacyId);
	}
};

export const getProjectReportId = (): string | null => {
	if (typeof window === 'undefined') return null;
	migrateLegacyIntoSplitSessions();
	return sessionStorage.getItem(PROJECT_REPORT_ID_KEY);
};

export const getCalculationReportId = (): string | null => {
	if (typeof window === 'undefined') return null;
	migrateLegacyIntoSplitSessions();
	return sessionStorage.getItem(CALCULATION_REPORT_ID_KEY);
};

export const persistProjectSession = (reportId: string) => {
	if (typeof window === 'undefined' || !reportId) return;
	sessionStorage.setItem(PROJECT_REPORT_ID_KEY, reportId);
	sessionStorage.setItem(ACTIVE_REPORT_ID_KEY, reportId);
	sessionStorage.setItem(ACTIVE_REPORT_TYPE_KEY, ReportCategory.Floor);
};

export const persistCalculationSession = (reportId: string) => {
	if (typeof window === 'undefined' || !reportId) return;
	sessionStorage.setItem(CALCULATION_REPORT_ID_KEY, reportId);
	sessionStorage.setItem(ACTIVE_REPORT_ID_KEY, reportId);
	sessionStorage.setItem(ACTIVE_REPORT_TYPE_KEY, ReportCategory.Single);
};

export const persistCalculationCatalogConstructionId = (constructionHeaderId: string) => {
	if (typeof window === 'undefined' || !constructionHeaderId) return;
	sessionStorage.setItem(CALCULATION_CATALOG_CONSTRUCTION_ID_KEY, constructionHeaderId);
};

export const getCalculationCatalogConstructionId = (): string | null => {
	if (typeof window === 'undefined') return null;
	return sessionStorage.getItem(CALCULATION_CATALOG_CONSTRUCTION_ID_KEY);
};

export const clearCalculationCatalogConstructionId = () => {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(CALCULATION_CATALOG_CONSTRUCTION_ID_KEY);
};

/** Синхронизирует активный контекст с сохранённым проектом (для навигации «Продолжить»). */
export const activateProjectSession = (): string | null => {
	const id = getProjectReportId();
	if (!id) return null;
	sessionStorage.setItem(ACTIVE_REPORT_ID_KEY, id);
	sessionStorage.setItem(ACTIVE_REPORT_TYPE_KEY, ReportCategory.Floor);
	return id;
};

export const activateCalculationSession = (): string | null => {
	const id = getCalculationReportId();
	if (!id) return null;
	sessionStorage.setItem(ACTIVE_REPORT_ID_KEY, id);
	sessionStorage.setItem(ACTIVE_REPORT_TYPE_KEY, ReportCategory.Single);
	return id;
};

export const clearProjectSession = () => {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(PROJECT_REPORT_ID_KEY);
	if (sessionStorage.getItem(ACTIVE_REPORT_TYPE_KEY) === ReportCategory.Floor) {
		sessionStorage.removeItem(ACTIVE_REPORT_ID_KEY);
		sessionStorage.removeItem(ACTIVE_REPORT_TYPE_KEY);
	}
};

export const clearCalculationSession = () => {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(CALCULATION_REPORT_ID_KEY);
	sessionStorage.removeItem(CALCULATION_CATALOG_CONSTRUCTION_ID_KEY);
	if (sessionStorage.getItem(ACTIVE_REPORT_TYPE_KEY) === ReportCategory.Single) {
		sessionStorage.removeItem(ACTIVE_REPORT_ID_KEY);
		sessionStorage.removeItem(ACTIVE_REPORT_TYPE_KEY);
	}
};

export const clearAllConstructorReportSessions = () => {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(PROJECT_REPORT_ID_KEY);
	sessionStorage.removeItem(CALCULATION_REPORT_ID_KEY);
	sessionStorage.removeItem(CALCULATION_CATALOG_CONSTRUCTION_ID_KEY);
	sessionStorage.removeItem(ACTIVE_REPORT_ID_KEY);
	sessionStorage.removeItem(ACTIVE_REPORT_TYPE_KEY);
};

/** HTTP-статусы «отчёт не найден / удалён» — сбрасываем сессию и создаём новый. */
export const isMissingReportHttpStatus = (status?: number) =>
	status === 404 || status === 410;
