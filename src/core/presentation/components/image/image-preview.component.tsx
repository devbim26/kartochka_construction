type Props = {
	src: string;
	onClose: () => void;
};

export const ImagePreviewModal = ({ src, onClose }: Props) => {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			onClick={onClose}
		>
			<img
				src={src}
				alt="preview"
				className="max-h-[90vh] max-w-[90vw] rounded-[12px] shadow-lg"
				onClick={(e) => e.stopPropagation()}
			/>
		</div>
	);
};
