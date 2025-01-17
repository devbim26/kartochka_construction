import { Button, LogoIcon, LogoTextIcon } from '@core';
import { useNavigate } from 'react-router-dom';
import { EmailImage, PhoneImage } from '../images';

export const Footer = () => {
	const navigate = useNavigate();

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="flex w-[73.18%] flex-row justify-between py-[50px]">
				<div className="mb-[23px] flex flex-row items-center gap-[12px] self-start">
					<LogoIcon className="h-[49px] w-[48px]" />
					<LogoTextIcon className="h-[79px] w-[209px]" />
				</div>
				<div className="flex flex-col gap-[30px]">
					<span
						onClick={() => navigate('/main')}
						className="cursor-pointer font-montserrat text-[20px] leading-[24px]"
					>
						Главная
					</span>
					<span
						onClick={() => navigate('/main')}
						className="cursor-pointer font-montserrat text-[20px] leading-[24px]"
					>
						О нас
					</span>
					<span
						onClick={() => navigate('/main')}
						className="cursor-pointer font-montserrat text-[20px] leading-[24px]"
					>
						Контакты
					</span>
				</div>
				<div className="flex flex-col gap-[30px]">
					<span
						onClick={() => navigate('/main')}
						className="cursor-pointer font-montserrat text-[20px] leading-[24px]"
					>
						Проектирование
					</span>
					<span
						onClick={() => navigate('/main')}
						className="cursor-pointer font-montserrat text-[20px] leading-[24px]"
					>
						Подписки
					</span>
					<div className="flex flex-row justify-end gap-[23px]">
						<Button className="rounded-[14px] p-[10px]">
							<PhoneImage color="white" />
						</Button>
						<Button className="rounded-[14px] p-[10px]">
							<EmailImage color="white" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
