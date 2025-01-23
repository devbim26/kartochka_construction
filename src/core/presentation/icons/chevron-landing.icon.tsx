interface ChevronIconProps {
	color?: string;
	direction?: 'up' | 'down' | 'left' | 'right';
}

export const ChevronLandingIcon = ({ color = '#2175F3', direction = 'down' }: ChevronIconProps) => {
	let transform;
	switch (direction) {
		case 'right':
			transform = 'rotate(0deg)';
			break;
		case 'up':
			transform = 'rotate(180deg)';
			break;
		case 'left':
			transform = 'rotate(-90deg)';
			break;
		case 'down':
		default:
			transform = 'rotate(90deg)';
			break;
	}
	return (
		<svg
			width="11"
			height="17"
			viewBox="0 0 11 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{ transition: 'transform 0.1s ease-in-out', transform }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.3778 16.5021C2.02868 17.166 3.08395 17.166 3.73483 16.5021L10.4015 9.70208C11.0524 9.03819 11.0524 7.96181 10.4015 7.29792L3.73483 0.497919C3.08395 -0.165974 2.02868 -0.165974 1.3778 0.497919C0.72693 1.16181 0.72693 2.23819 1.3778 2.90208L6.86596 8.5L1.3778 14.0979C0.72693 14.7618 0.72693 15.8382 1.3778 16.5021Z"
				fill={color}
			/>
		</svg>
	);
};
