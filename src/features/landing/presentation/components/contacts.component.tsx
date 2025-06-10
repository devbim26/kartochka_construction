import { LandingSections } from '@features/landing/constants';
import { EmailImage, PhoneImage } from '../images';

export const Contacts = () => {
	return (
		<div
			className="flex w-full justify-center bg-background-primary px-4 xs:px-6 sm:px-8 md:px-10 lg:px-16 xl:px-20"
			id={LandingSections.contacts.id}
		>
			<div className="mx-auto flex w-full max-w-screen-xl flex-col py-[40px] sm:py-[50px]">
				<div className="mb-[24px] font-montserrat text-[18px] font-normal leading-[22px] sm:mb-[36px] sm:text-[20px] sm:leading-[24px]">
					Контакты
				</div>

				<div className="flex flex-col gap-[24px] xs:flex-row xs:justify-center xs:gap-[130px] lg:gap-[160px]">
					<div className="flex max-w-[400px] flex-col gap-[10px] xs:gap-[12px]">
						<span className="font-montserrat text-[20px] font-medium leading-[26px] text-primary xs:text-[20px] sm:text-[25px] md:text-[25px] lg:text-[30px] xl:text-[35px]">
							ООО &quot;Акустиком&quot;
						</span>
						<span className="font-montserrat text-[18px] leading-[24px] xs:text-[22px] xs:leading-[27px]">
							Беларусь, Минск
						</span>
						<span className="font-montserrat text-[18px] leading-[24px] xs:text-[22px] xs:leading-[27px]">
							ул. Матусевича 35, офис 36
						</span>
					</div>

					<div className="flex max-w-[400px] flex-col justify-start gap-[10px] xs:justify-end xs:gap-[12px]">
						<div className="flex flex-row items-center gap-[6px] xs:gap-[7px]">
							<PhoneImage />
							<span className="font-montserrat text-[16px] leading-[22px] xs:text-[20px] xs:leading-[24px]">
								+375(44)570-89-48
							</span>
						</div>
						<div className="flex flex-row items-center gap-[6px] xs:gap-[7px]">
							<EmailImage />
							<span className="font-montserrat text-[16px] leading-[22px] xs:text-[20px] xs:leading-[24px]">
								info@transacoustic.ru
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
