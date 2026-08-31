/** Собирает document.title: «Страница | devBIM», суффикс сайта не бывает пустым. */
export const formatPageTitle = (pageTitle: string, siteName: string): string => {
	const page = pageTitle.trim();
	const site = siteName.trim() || 'devBIM';

	if (!page) {
		return site;
	}

	return `${page} | ${site}`;
};
