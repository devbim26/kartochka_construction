/** Убирает HTML-теги для превью и валидации «пустого» текста. */
export const stripHtmlToPlainText = (html?: string | null): string => {
	if (!html) return '';
	return html
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, ' ')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&quot;/gi, '"')
		.replace(/\s+/g, ' ')
		.trim();
};

export const isRichTextEmpty = (html?: string | null): boolean =>
	stripHtmlToPlainText(html).length === 0;
