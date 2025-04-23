import { FormElementLabel } from '@core';

export const GeneralInformationForm = () => {
	return (
		<div className="flex flex-row gap-[20px] border-b">
			<div className="flex flex-col gap-[24px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Общая информация
				</FormElementLabel>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Название
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Ф2332
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Конструкция разделяет
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Жил. комната/ жил. комната
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Длина, м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Ширина (высота), м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Площадь, м2
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая толщина, мм
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						123
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая масса, кг
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						1212
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-[20px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Соответствие нормам
				</FormElementLabel>
				<table className="w-[400px]">
					<tr className="border-b-2 border-black">
						<th className="w-[200px] text-left">Физические</th>
						<th>Значения</th>
						<th>Требования</th>
					</tr>
					<tr>
						<td className="w-[200px] text-right">Толщина, мм</td>
						<td>276</td>
						<td>276</td>
					</tr>
					<tr>
						<td className="w-[200px] text-right">Масса, кг/м²</td>
						<td>451</td>
						<td>451</td>
					</tr>
					<tr>
						<td className="w-[200px] text-right">Высота, м</td>
						<td>3</td>
						<td>3</td>
					</tr>
				</table>
				<table className="w-[400px]">
					<tr className="border-b-2 border-black">
						<th className="w-[200px] text-left">Звукоизоляционные</th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<td className="w-[200px] text-right">
							<p className="mr-2 inline italic text-blue-500 underline">Расчёт</p>
							<p className="inline">Rw, dB</p>
						</td>
						<td>45</td>
						<td>450</td>
					</tr>
					<tr>
						<td className="w-[200px] text-right">
							<p className="mr-2 inline italic text-blue-500 underline">Лаб.тест</p>
							<p className="inline">Rw, dB</p>
						</td>
						<td>45</td>
						<td>450</td>
					</tr>
				</table>
				<table className="w-[400px]">
					<tr className="border-b-2 border-black">
						<th className="w-[200px] text-left">Тепловая изоляция</th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<td className="w-[200px] text-right">
							<p className="mr-2 inline italic text-blue-500 underline">Расчёт</p>
							<p className="inline">R, м²·К/Вт</p>
						</td>
						<td>45</td>
						<td>450</td>
					</tr>
				</table>
				<table className="w-[400px]">
					<tr className="border-t-2 border-black">
						<th className="w-[200px] text-left">Огнестойкость</th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<td className="w-[200px] text-right">
							<p className="mr-2 inline italic">Справочно</p>
							<p className="inline">EI</p>
						</td>
						<td>45</td>
						<td>45</td>
					</tr>
				</table>
			</div>
		</div>
	);
};
