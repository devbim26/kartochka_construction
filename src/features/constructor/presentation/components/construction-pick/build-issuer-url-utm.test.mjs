/**
 * Unit-тесты UTM-хелпера ссылок производителя.
 * Логика зеркалит buildIssuerUrlWithUtm из construction-card-sections.component.tsx
 * (node --test не запускает TS) — править синхронно.
 * Запуск: npm run test:utm-helper
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const buildIssuerUrlWithUtm = (url, constructionId) => {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return url;
		const hasUtm = ['utm_source', 'utm_medium', 'utm_content'].some((key) =>
			parsed.searchParams.has(key),
		);
		if (hasUtm) return url;
		parsed.searchParams.set('utm_source', 'devbim');
		parsed.searchParams.set('utm_medium', 'catalog');
		if (constructionId) parsed.searchParams.set('utm_content', constructionId);
		return parsed.toString();
	} catch {
		return url;
	}
};

const ID = 'c1f2a3b4-0001-4000-8000-0000000000a1';
const UTM = `utm_source=devbim&utm_medium=catalog&utm_content=${ID}`;

describe('buildIssuerUrlWithUtm', () => {
	it('добавляет UTM к ссылке без параметров', () => {
		assert.equal(buildIssuerUrlWithUtm('https://keramzit.by', ID), `https://keramzit.by/?${UTM}`);
	});

	it('не затирает существующие query-параметры', () => {
		assert.equal(
			buildIssuerUrlWithUtm('https://example.com/page?lang=ru&tab=2', ID),
			`https://example.com/page?lang=ru&tab=2&${UTM}`,
		);
	});

	it('сохраняет якорь в конце URL', () => {
		assert.equal(
			buildIssuerUrlWithUtm('https://example.com/docs#section', ID),
			`https://example.com/docs?${UTM}#section`,
		);
	});

	it('не меняет ссылку, где UTM уже есть', () => {
		const url = 'https://example.com/?utm_source=google&utm_medium=cpc';
		assert.equal(buildIssuerUrlWithUtm(url, ID), url);
	});

	it('не трогает не-http(s) адреса', () => {
		assert.equal(buildIssuerUrlWithUtm('mailto:sales@example.com', ID), 'mailto:sales@example.com');
	});

	it('без constructionId не добавляет utm_content', () => {
		assert.equal(
			buildIssuerUrlWithUtm('https://example.com'),
			'https://example.com/?utm_source=devbim&utm_medium=catalog',
		);
	});

	it('пустой url даёт null', () => {
		assert.equal(buildIssuerUrlWithUtm(null, ID), null);
		assert.equal(buildIssuerUrlWithUtm('', ID), null);
	});
});
