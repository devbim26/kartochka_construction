import { Chevron } from '@core';
import { useState } from 'react';

export const HowOurServiceWorks = () => {
	const [selectedStep, setSelectedStep] = useState(0);

	const steps = [
		'Укажите характеристики вашего проекта',
		'Выберите оптимальные конструкции на основе расчётов',
		'Получите точные расчёты конструкций',
		'Создайте отчет',
		'Пройдите экспертизу',
	];

	const descriptions = [
		'Укажите основные характеристики вашего проекта, такие как тип здания, назначение помещений и другие параметры.\n\nЭто позволит системе точно учитывать все необходимые нормы и требования.',
		'Ознакомьтесь с предложенными конструкциями, сравните их по стоимости и параметрам. Это поможет вам выбрать наилучшее решение для вашего проекта.',
		'После выбора конструкций получите подробные расчёты, подтверждающие соответствие проектных решений всем строительным нормам, а также стоимость каждого решения.',
		'Детальные расчеты для выбранной конструкции: все необходимые параметры и данные.\n\nСпецификации материалов, полная информация о материалах.',
		'Отправьте расчеты на проверку нашим сертифицированным инженерам.\n\nПолучите заключение для успешного прохождения государственной экспертизы.',
	];

	const handleStepClick = (index: number) => {
		setSelectedStep(index);
	};

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="flex w-[73.18%] flex-col py-[50px]">
				<div className="mb-[49px] flex font-raleway text-[20px] font-normal leading-[24px]">
					Как работает наш сервис
				</div>
				<div className="flex flex-row gap-[30px]">
					<div className="flex w-[50%] flex-col">
						<div className="font-raleway text-[25px] font-medium leading-[30px]">
							Этапы проектирования
						</div>
						<div className="mt-[50px] flex flex-col gap-[30px]">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex cursor-pointer flex-row justify-between gap-[30px]"
									onClick={() => handleStepClick(index)}
								>
									<div
										className={`font-montserrat flex cursor-pointer text-[20px] font-medium leading-[24px] ${
											selectedStep === index ? 'text-primary' : ''
										}`}
									>
										{index + 1}. {step}
									</div>
									<div className="flex">
										<Chevron
											color={selectedStep === index ? 'primary' : 'gray'}
											direction={selectedStep === index ? 'right' : 'down'}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="shadow-blue flex h-full w-[50%] rounded-[20px] bg-white">
						{selectedStep !== null && (
							<div className="flex flex-col py-[45px]">
								<span className="flex mb-[90px] justify-between px-[20px] flex-row font-montserrat text-[20px] font-semibold leading-[24px]">
									{steps[selectedStep]}
								</span>
								<span className="font-montserrat px-[27px] text-[20px] font-normal leading-[24px] whitespace-pre-wrap">
									{descriptions[selectedStep]}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
