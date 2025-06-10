import { LogoIcon, LogoTextIcon } from '@core';
import { useState } from 'react';
import { ImMenu } from 'react-icons/im';
import { useLocation } from 'react-router-dom';
import { HeaderNav } from './header-nav.component';
import { LogoutHeader } from './logout-header.component';

export const HomeHeader = () => {
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	return (
		<>
			<header className="flex w-full flex-row items-center justify-between border-b border-solid border-[#EDEFF2] bg-white px-[25px] pb-[6px] xs:px-[15px]">
				<div className="flex flex-row items-center gap-4">
					<button
						onClick={toggleMenu}
						className="block p-2 text-primary hover:text-[#1a60cc] focus:outline-none sm:hidden"
					>
						<ImMenu className="size-6" />
					</button>

					<div className="flex flex-row items-center gap-[12px]">
						<LogoIcon className="h-[40px] w-[39px] xs:h-[30px] xs:w-[29px]" />
						<LogoTextIcon className="h-[64px] w-[170px] xs:h-[44px] xs:w-[120px]" />
					</div>
				</div>

				<div className="hidden items-center gap-6 sm:flex">
					<HeaderNav />
				</div>

				{pathname.startsWith('/') && (
					<div className="hidden sm:flex">
						<LogoutHeader />
					</div>
				)}
			</header>

			<div
				className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out sm:hidden ${
					isMenuOpen ? 'bg-black/50' : 'pointer-events-none bg-transparent'
				}`}
			>
				<div
					className={`fixed left-0 top-0 h-full w-3/4 bg-white shadow-xl transition-all duration-300 ease-in-out ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className="flex h-full flex-col p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex flex-row items-center gap-[12px]">
								<LogoIcon className="h-[32px] w-[31px]" />
								<LogoTextIcon className="h-[48px] w-[130px]" />
							</div>
							<button
								onClick={toggleMenu}
								className="p-1 text-gray-600 hover:text-gray-900"
							>
								✕
							</button>
						</div>

						<div className="flex-1">
							<HeaderNav mobile onItemClick={() => setIsMenuOpen(false)} />
						</div>

						{pathname.startsWith('/') && (
							<div className="mt-4">
								<LogoutHeader mobile />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
