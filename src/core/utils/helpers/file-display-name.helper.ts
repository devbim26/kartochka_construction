export type FileAttachment = {
	name?: string | null;
	url?: string | null;
};

export const getFileNameFromUrl = (url: string) => {
	try {
		const pathname = new URL(url, window.location.origin).pathname;
		const name = pathname.split('/').pop();
		return name ? decodeURIComponent(name) : url;
	} catch {
		return url.split('/').pop() || url;
	}
};

const parseNameAndUrl = (text: string) => {
	const urlMatch = text.match(/https?:\/\/[^\s]+/i);
	if (!urlMatch) return { name: text.trim(), url: undefined as string | undefined };
	const url = urlMatch[0];
	const name = text.replace(url, '').trim();
	return { name: name || url, url };
};

const parseContentDispositionFileName = (header: string | null | undefined): string | undefined => {
	if (!header) return undefined;

	const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
	if (utf8Match?.[1]) {
		try {
			return decodeURIComponent(utf8Match[1].trim());
		} catch {
			return utf8Match[1].trim();
		}
	}

	const quotedMatch = header.match(/filename="([^"]+)"/i);
	if (quotedMatch?.[1]) {
		try {
			return decodeURIComponent(quotedMatch[1].trim());
		} catch {
			return quotedMatch[1].trim();
		}
	}

	const plainMatch = header.match(/filename=([^;]+)/i);
	if (plainMatch?.[1]) {
		const raw = plainMatch[1].trim().replace(/^["']|["']$/g, '');
		try {
			return decodeURIComponent(raw);
		} catch {
			return raw;
		}
	}

	return undefined;
};

/** Имя файла: из строки «название url», из Content-Disposition или из пути URL. */
export const resolveFileDisplayName = async (fileRef: string): Promise<string> => {
	const trimmed = fileRef.trim();
	if (!trimmed) return '';

	const { name, url } = parseNameAndUrl(trimmed);
	const resolvedUrl = url ?? trimmed;

	if (name && name !== resolvedUrl) {
		return name;
	}

	try {
		const response = await fetch(resolvedUrl, { method: 'HEAD' });
		const fromHeader = parseContentDispositionFileName(
			response.headers.get('Content-Disposition'),
		);
		if (fromHeader) return fromHeader;
	} catch {
		// CORS / HEAD not supported — fallback below
	}

	return getFileNameFromUrl(resolvedUrl);
};

export const normalizeAttachments = (value: unknown): FileAttachment[] => {
	if (!Array.isArray(value)) return [];

	return value
		.map((item): FileAttachment | null => {
			if (typeof item === 'string') {
				const url = item.trim();
				return url ? { name: null, url } : null;
			}

			if (item && typeof item === 'object') {
				const record = item as Record<string, unknown>;
				const urlValue = record.url ?? record.fileUrl ?? record.path ?? record.href;
				const nameValue = record.name ?? record.fileName ?? record.FileName;
				const url = typeof urlValue === 'string' ? urlValue.trim() : '';
				if (!url) return null;

				const name = typeof nameValue === 'string' ? nameValue.trim() : '';
				return { name: name || null, url };
			}

			return null;
		})
		.filter((item): item is FileAttachment => item !== null && Boolean(item.url?.trim()));
};

export const getAttachmentDisplayName = (attachment: FileAttachment): string => {
	const name = attachment.name?.trim();
	if (name) return name;

	const url = attachment.url?.trim();
	return url ? getFileNameFromUrl(url) : '';
};
