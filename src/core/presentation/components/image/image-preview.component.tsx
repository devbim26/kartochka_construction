import { resolveMediaUrl } from '@core/utils/resolve-media-url.utils';
import { createPortal } from 'react-dom';
import { SafeImage } from './safe-image.component';

type Props = {
	src: string;
	onClose: () => void;
};

export const ImagePreviewModal = ({ src, onClose }: Props) => {
	if (typeof document === 'undefined') return null;

	const resolved = resolveMediaUrl(src);

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			onClick={onClose}
		>
			<SafeImage
				src={resolved}
				alt="preview"
				className="max-h-[90vh] max-w-[90vw] rounded-[12px] shadow-lg"
				fallbackClassName="h-[200px] w-[280px] bg-white"
				onClick={(e) => e.stopPropagation()}
			/>
		</div>,
		document.body,
	);
};
