import { LandingSections } from '@features/landing/constants';
import { EmailImage, PhoneImage } from '../images';

export const Contacts = () => {
	return (
		<div
			className="mx-auto w-full px-4 py-[50px] xs:w-[90%] sm:w-4/5 md:w-[73.18%]"
			id={LandingSections.contacts.id}
		>
			<div className="mb-[36px] font-montserrat text-[18px] font-normal leading-[24px] xs:text-[20px]">
				Контакты
			</div>
			<div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
				<div className="flex flex-col gap-[12px]">
					<span className="font-montserrat text-[20px] font-medium leading-[24px] text-primary sm:text-[25px] sm:leading-[30px] md:text-[25px] md:leading-[30px] lg:text-[30px] lg:leading-[36px] xl:text-[35px] xl:leading-[42px]">
						ООО&quot;Акустиком&quot;
					</span>
					<span className="font-montserrat text-[16px] leading-[20px] xs:text-[18px] xs:leading-[22px] sm:text-[22px] sm:leading-[27px]">
						Беларусь, Минск
					</span>
					<span className="font-montserrat text-[16px] leading-[20px] xs:text-[18px] xs:leading-[22px] sm:text-[22px] sm:leading-[27px]">
						ул. Матусевича 35, офис 36
					</span>
				</div>
				<div className="flex flex-col gap-[12px] sm:justify-end">
					<div className="flex flex-row gap-[7px]">
						<PhoneImage />
						<span className="font-montserrat text-[14px] leading-[18px] xs:text-[16px] xs:leading-[20px] sm:text-[20px] sm:leading-[24px]">
							+375(44)570-89-48
						</span>
					</div>
					<div className="flex flex-row gap-[7px]">
						<EmailImage />
						<span className="font-montserrat text-[14px] leading-[18px] xs:text-[16px] xs:leading-[20px] sm:text-[20px] sm:leading-[24px]">
							info@transacoustic.ru
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
