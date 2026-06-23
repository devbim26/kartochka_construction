import { resolveFileDisplayName } from '@core/utils/helpers/file-display-name.helper';
import { useEffect, useMemo, useState } from 'react';

/** Подгружает отображаемые имена файлов (Content-Disposition), с fallback на URL. */
export const useResolvedFileNames = (fileRefs: string[]) => {
	const [namesByRef, setNamesByRef] = useState<Record<string, string>>({});

	const refsKey = useMemo(
		() =>
			fileRefs
				.map((ref) => ref.trim())
				.filter(Boolean)
				.join('\u0001'),
		[fileRefs],
	);

	useEffect(() => {
		const uniqueRefs = refsKey ? refsKey.split('\u0001') : [];
		if (!uniqueRefs.length) {
			setNamesByRef({});
			return;
		}

		let cancelled = false;

		Promise.all(
			uniqueRefs.map(async (ref) => [ref, await resolveFileDisplayName(ref)] as const),
		).then((entries) => {
			if (!cancelled) {
				setNamesByRef(Object.fromEntries(entries));
			}
		});

		return () => {
			cancelled = true;
		};
	}, [refsKey]);

	return namesByRef;
};
