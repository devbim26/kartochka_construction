import type * as pdfjs from 'pdfjs-dist';
import { useCallback, useRef, useState } from 'react';

const isRenderingCancelled = (error: unknown): boolean =>
	error instanceof Error && error.name === 'RenderingCancelledException';

export const useRenderPage = (
	pdfFile: pdfjs.PDFDocumentProxy,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	scale: number,
) => {
	const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
	const renderGenerationRef = useRef(0);
	const [isRendering, setIsRendering] = useState(false);

	const renderPage = useCallback(
		async (pageNum: number) => {
			if (!pdfFile || !canvasRef.current) return;

			const generation = ++renderGenerationRef.current;

			if (renderTaskRef.current) {
				try {
					renderTaskRef.current.cancel();
				} catch {
					// ignore
				}
			}

			const page = await pdfFile.getPage(pageNum);
			if (generation !== renderGenerationRef.current) return;

			const viewport = page.getViewport({ scale });

			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			if (!context) return;

			canvas.width = viewport.width;
			canvas.height = viewport.height;

			setIsRendering(true);

			const task = page.render({ canvasContext: context, viewport });
			renderTaskRef.current = task;

			try {
				await task.promise;
			} catch (error) {
				if (generation !== renderGenerationRef.current) return;
				if (!isRenderingCancelled(error)) {
					console.warn('Ошибка рендера:', error);
				}
			} finally {
				if (generation === renderGenerationRef.current) {
					renderTaskRef.current = null;
					setIsRendering(false);
				}
			}
		},
		[pdfFile, scale, canvasRef],
	);

	return { renderPage, isRendering };
};
