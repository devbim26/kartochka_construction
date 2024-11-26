import { ImExit } from 'react-icons/im';

export const LogoutHeader = () => {
	const logout = () => {};

	return (
		<div className="flex flex-row items-center gap-[21px]">
			<p className="text-sm font-normal leading-5 tracking-tight text-[#14181F]">Admin</p>
			<div
				className="relative size-[32px] cursor-pointer rounded-lg border border-solid border-[#EDEFF2]"
				onClick={logout}
			>
				<ImExit className="absolute left-[6px] top-[6px] size-[20px]" />
			</div>
		</div>
	);
};
