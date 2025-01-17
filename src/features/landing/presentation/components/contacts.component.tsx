import { EmailImage, PhoneImage } from '../images';

export const Contacts = () => {
	return (
		<div className="flex w-[73.18%] flex-col py-[50px]">
			<div className="font-montserrat mb-[36px] flex text-[20px] font-normal leading-[24px]">
				Контакты
			</div>
			<div className="flex flex-row justify-between">
				<div className="flex flex-col gap-[12px]">
					<span className="font-montserrat text-[25px] font-medium leading-[30px] text-primary">
						ООО&quot;Акустиком&quot;
					</span>
					<span className="font-montserrat text-[22px] leading-[27px]">
						Беларусь, Минск
					</span>
					<span className="font-montserrat text-[22px] leading-[27px]">
						ул. Матусевича 35, офис 36
					</span>
				</div>
				<div className="flex flex-col justify-end gap-[12px]">
					<div className="flex flex-row gap-[7px]">
						<PhoneImage />
						<span className="font-montserrat text-[20px] leading-[24px]">
							+375(44)570-89-48
						</span>
					</div>
					<div className="flex flex-row gap-[7px]">
						<EmailImage />
						<span className="font-montserrat text-[20px] leading-[24px]">
							info@transacoustic.ru
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
