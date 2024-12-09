interface AdIconProps {
	className?: string;
}

export const SearchIcon = ({ className }: AdIconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			className={className}
		>
			<path
				d="M11.2152 11.2094L15.75 15.75M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z"
				stroke="#91969E"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
