import { LandingSections } from '@features/landing/constants';
import { EmailImage, PhoneImage } from '../images';

export const Contacts = () => {
	return (
		<div
			className="flex w-full justify-center bg-background-primary px-4 sm:px-6 lg:px-10"
			id={LandingSections.contacts.id}
		>
			<div className="flex w-full max-w-screen-xl flex-col py-[40px] sm:py-[50px]">
				<div className="mb-[24px] font-montserrat text-[18px] font-normal leading-[22px] sm:mb-[36px] sm:text-[20px] sm:leading-[24px]">
					Контакты
				</div>
				<div className="flex flex-col gap-[24px] sm:flex-row sm:justify-between sm:gap-0">
					<div className="flex flex-col gap-[10px] sm:gap-[12px]">
						<span className="font-montserrat text-[20px] font-medium leading-[26px] text-primary sm:text-[25px] sm:leading-[30px]">
							ООО &quot;Акустиком&quot;
						</span>
						<span className="font-montserrat text-[18px] leading-[24px] sm:text-[22px] sm:leading-[27px]">
							Беларусь, Минск
						</span>
						<span className="font-montserrat text-[18px] leading-[24px] sm:text-[22px] sm:leading-[27px]">
							ул. Матусевича 35, офис 36
						</span>
					</div>
					<div className="flex flex-col justify-start gap-[10px] sm:justify-end sm:gap-[12px]">
						<div className="flex flex-row items-center gap-[6px] sm:gap-[7px]">
							<PhoneImage />
							<span className="font-montserrat text-[16px] leading-[22px] sm:text-[20px] sm:leading-[24px]">
								+375(44)570-89-48
							</span>
						</div>
						<div className="flex flex-row items-center gap-[6px] sm:gap-[7px]">
							<EmailImage />
							<span className="font-montserrat text-[16px] leading-[22px] sm:text-[20px] sm:leading-[24px]">
								info@transacoustic.ru
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
