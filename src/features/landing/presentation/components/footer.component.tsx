import { APP_ROUTES, Button, LogoIcon, LogoTextIcon } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';
import { EmailImage, PhoneImage } from '../images';

export const Footer = () => {
	const navigate = useNavigate();

	return (
		<div className="flex w-full justify-center bg-background-primary px-4 sm:px-6 lg:px-10">
			<div className="flex w-full max-w-screen-xl flex-col gap-[40px] py-[40px] sm:flex-row sm:justify-between sm:gap-0 sm:py-[50px]">
				<div className="flex flex-row items-center gap-[12px] self-start">
					<LogoIcon className="size-[42px] sm:h-[49px] sm:w-[48px]" />
					<LogoTextIcon className="h-[60px] w-[160px] sm:h-[79px] sm:w-[209px]" />
				</div>

				<div className="flex flex-col gap-[20px] sm:gap-[30px]">
					<span
						onClick={() =>
							navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
						}
						className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
					>
						Главная
					</span>
					<span
						onClick={() =>
							navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
						}
						className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
					>
						О нас
					</span>
					<span
						onClick={() =>
							navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
						}
						className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
					>
						Контакты
					</span>
				</div>

				<div className="flex flex-col gap-[20px] sm:gap-[30px]">
					<span
						onClick={() =>
							navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
						}
						className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
					>
						Проектирование
					</span>
					<span
						onClick={() =>
							navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
						}
						className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
					>
						Подписки
					</span>
					<div className="flex flex-row gap-[16px] sm:gap-[23px]">
						<Button className="rounded-[12px] p-[10px] sm:rounded-[14px]">
							<PhoneImage color="white" />
						</Button>
						<Button className="rounded-[12px] p-[10px] sm:rounded-[14px]">
							<EmailImage color="white" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
