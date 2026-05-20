/** Карточка главной → id модели в Open WebUI (URL param `model`). */
const FEATURE_ID_TO_OPENWEBUI_MODEL: Record<string, string> = {
	'arch-design': 'design',
	'expertise-general': 'Expertise_1',
	'expertise-subject': 'Expertise_2',
	'expertise-documents': 'Expertise_3',
	'expertise-norms': 'Expertise_4',
};

const DEFAULT_OPENWEBUI_BASE_URL = 'https://ai.devscience.by';

export function getOpenWebUiModelFromFeatureId(featureId: string): string | undefined {
	return FEATURE_ID_TO_OPENWEBUI_MODEL[featureId];
}

/** Собирает URL чата Open WebUI с предвыбранной моделью. */
export function buildOpenWebUiChatUrl(modelId?: string | null): string {
	const base = (
		process.env.REACT_APP_OPENWEBUI_URL || DEFAULT_OPENWEBUI_BASE_URL
	).replace(/\/$/, '');
	const url = new URL(`${base}/`);
	if (modelId) {
		url.searchParams.set('model', modelId);
	}
	return url.toString();
}
