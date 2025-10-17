import type * as pdfjs from 'pdfjs-dist';
import { useCallback, useRef, useState } from 'react';

export const useRenderPage = (
	pdfFile: pdfjs.PDFDocumentProxy,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	scale: number,
) => {
	const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
	const [isRendering, setIsRendering] = useState(false);

	const renderPage = useCallback(
		async (pageNum: number) => {
			if (!pdfFile || !canvasRef.current) return;

			if (renderTaskRef.current) {
				try {
					renderTaskRef.current.cancel();
				} catch (error) {
					console.warn('Ошибка отмены рендера:', error);
				}
			}

			const page = await pdfFile.getPage(pageNum);
			const viewport = page.getViewport({ scale });

			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			if (!context) return;

			canvas.width = viewport.width;
			canvas.height = viewport.height;

			setIsRendering(true);

			renderTaskRef.current = page.render({ canvasContext: context, viewport });

			try {
				await renderTaskRef.current.promise;
			} catch (error) {
				console.warn('Ошибка рендера:', error);
			} finally {
				setIsRendering(false);
				renderTaskRef.current = null;
			}
		},
		[pdfFile, scale],
	);

	return { renderPage, isRendering };
};
