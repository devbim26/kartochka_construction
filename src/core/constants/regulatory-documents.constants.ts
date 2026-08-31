/**
 * Единый перечень нормативных документов платформы.
 * Синхронизирован со справочником «Требования» и текстами лендинга (FAQ, блоки о сервисе).
 */
export const REGULATORY_DOCUMENTS = {
	ru: [
		'СП 51.13330',
		'СП 23-103-2003',
		'СП 02.04.03-2023',
		'СН 02.04.01-2020',
	],
	en: [
		'SP 51.13330',
		'SP 23-103-2003',
		'SP 02.04.03-2023',
		'SN 02.04.01-2020',
	],
} as const;

export type RegulatoryDocumentsLocale = keyof typeof REGULATORY_DOCUMENTS;

/** Маркированный список кодов нормативов для UI-текстов. */
export const formatRegulatoryDocumentsList = (locale: RegulatoryDocumentsLocale): string =>
	REGULATORY_DOCUMENTS[locale].map((doc) => `• ${doc}`).join('\n');
