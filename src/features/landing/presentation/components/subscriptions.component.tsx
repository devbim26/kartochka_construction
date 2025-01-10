import { Button } from '@core';
import { Switch } from '../../../../core/presentation/components/switch';
import { CheckMarkImage } from '../images';

export const Subscriptions = () => {
	const titles = ['Trial', 'Standart', 'Pro'];

	const descriptions = [
		'Идеально для ознакомления и небольших проектов',
		'Оптимальный выбор для регулярного использования',
		'Максимальные возможности для крупных компаний',
	];

	const prices = ['бесплатно', '350$/месяц', '550$/месяц'];

	const points = [
		[
			'1 отчет в месяц',
			'1 конструкция в отчете',
			'Работа с одним этажом',
			'Новости партнеров',
			'Ограниченая база материалов',
			'Ограниченые узлы примыкания',
		],
		[
			'20 отчетов в месяц',
			'До 20 конструкций',
			'Работа с 4 этажами',
			'База данных материалов',
			'Расчёт: звукоизоляции, теплотехнических, противопожарных характеристика',
			'Типовые узлы примыкания',
			'Создание конструкций, выполнение расчетов',
			'Подпись отчета',
			'Проверка отчета',
			'Полный отчет',
		],
		[
			'Подпись отчета',
			'До 50 конструкций',
			'Работа с 10 этажами',
			'База данных материалов',
			'Расчёт: звукоизоляции, теплотехнических, противопожарных характеристика',
			'Специальные сгенерированные узлы примыкания',
			'Создание конструкций, выполнение расчетов',
			'Приоритетная поддержка',
			'Подпись отчета',
			'Проверка отчета',
			'Интеграция AutoCAD, Revit',
		],
	];

	const crossedPoints = [['Проверка отчета', 'Подпись отчета'], [], []];

	return (
		<div className="flex w-[73.18%] flex-col py-[50px]">
			<div className="mb-[34px] flex font-montserrat text-[20px] font-normal leading-[24px]">
				Подписки
			</div>
			<div className="flex flex-col items-center text-center">
				<Switch
					onText="год"
					offText="месяц"
					onColor="primary"
					offColor="primary"
					className="mb-[12px] h-[30px] w-[180px] p-[3px]"
					onTextClassName="font-semibold font-montserrat text-[16px] leading-[20px] right-[29px]"
					offTextClassName="font-semibold font-montserrat text-[16px] leading-[20px] left-[17px]"
				/>
				<div className="mb-[12px] font-montserrat text-[12px] font-normal">
					При покупке на год первые 3 месяца бесплатно
				</div>
				<div className="flex w-full gap-[10px]">
					{titles.map((title, index) => (
						<div
							key={index}
							className="flex flex-col rounded-[20px] border border-grey-border px-[16px] pb-[16px] pt-[41px]"
						>
							<div className="mx-[17px] border-b-2 border-b-grey-border pb-[9px] font-montserrat text-[25px] font-bold leading-[30px] text-primary">
								{title}
							</div>
							<div className="mb-[25px] font-montserrat text-[16px] font-medium leading-[145%]">
								{descriptions[index]}
							</div>
							<div className="mb-[18px] font-montserrat text-[20px] font-medium leading-[24px] text-primary">
								{prices[index]}
							</div>
							<Button className="mb-[14px] w-full text-[16px]">
								Оформить подписку
							</Button>
							<div className="flex flex-col">
								{points[index].map((point, index) => (
									<div key={index} className="mb-[10px] flex flex-row gap-[10px]">
										<span className="flex items-center">
											<CheckMarkImage />
										</span>
										<span className="flex text-start font-montserrat text-[18px] leading-[145%]">
											{point}
										</span>
									</div>
								))}
								{crossedPoints[index].map((point, index) => (
									<div
										key={index}
										className="mb-[10px] ml-[26px] flex flex-row gap-[10px] text-start font-montserrat text-[18px] font-semibold leading-[145%] text-grey-text line-through"
									>
										{point}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
