import { memo } from 'react';
import { IconBaseProps } from 'react-icons';

export const CleanUpIcon = memo((props: IconBaseProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="16"
			viewBox="0 0 17 16"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.60205 2C7.60205 1.44772 8.04977 1 8.60205 1C9.15434 1 9.60205 1.44772 9.60205 2V6.60223C10.5487 6.83026 11.1882 7.48448 11.4575 9H5.48096C5.95222 7.48249 6.64161 6.82854 7.60205 6.60134V2ZM11.4647 10H5.4647L4.11918 14.4851C4.04219 14.7417 4.23437 15 4.50231 15H9.83653L9.23144 12.7418C9.15997 12.475 9.31826 12.2009 9.58499 12.1294C9.85173 12.0579 10.1259 12.2162 10.1974 12.4829L10.8718 15H12.4271C12.695 15 12.8872 14.7417 12.8102 14.4851L11.4647 10Z"
				fill="#2175F3"
			/>
		</svg>
	);
});

CleanUpIcon.displayName = 'CleanUpIcon';
