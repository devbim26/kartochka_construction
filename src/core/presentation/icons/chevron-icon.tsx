interface ChevronIconProps {
	className?: string;
}

export const ChevronIcon = ({ className }: ChevronIconProps) => {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path d="M9 12L4.5 7.5H13.5L9 12Z" fill="#162843" />
		</svg>
	);
};
