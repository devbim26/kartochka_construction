import type { ConstructionsAddData } from '@features/guidbooks/types';

import { useFormContext } from 'react-hook-form';

// interface Layer {
// 	id: string;
// }

export const Cladding = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, setValue, watch } = form;

	// const [layers, setLayers] = useState<Layer[]>([]);

	// const handleAddLayer = () => {
	// 	const newLayer = {
	// 		id: crypto.randomUUID(),
	// 	};
	// 	setLayers(() => [newLayer, ...layers]);
	// };

	// const handleDeleteLayer = (id: string) => {
	// 	setLayers(layers.filter((item) => item.id !== id));
	// };

	return (
		<div className="flex flex-col gap-[16px]">
			{/* <div className="flex flex-row items-center justify-between">
				<p className="font-sans text-sm font-semibold leading-5">2. Облицовка</p>
				<Button className="border border-solid border-red bg-background-button-red p-[7px] enabled:hover:bg-inherit">
					<DeleteIcon />
				</Button>
			</div>

			<div className="flex flex-col gap-[16px]">
				<div className="flex flex-row gap-[16px]">
					<Controller
						name="cladding.0.material"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: 'Воздух', value: '1' }]}
								error={formState.errors.cladding?.[0]?.material?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px] w-[178px]',
									formState.errors.cladding?.[0]?.material?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
								buttonClassName="text-sm rounded-[8px] w-[226px]"
								label={
									formState.errors.cladding?.[0]?.material?.message ||
									'Воздушный зазор'
								}
								placeholder="Выберите материал"
							/>
						)}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[0]?.thickness?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={formState.errors.cladding?.[0]?.thickness?.message || 'Толщина, мм'}
						error={formState.errors.cladding?.[0]?.thickness?.message}
						placeholder="Введите толщину"
						{...form.register('cladding.0.thickness')}
						type={'number'}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[0]?.density?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={
							formState.errors.cladding?.[0]?.density?.message || 'Плотность, кг/м³'
						}
						error={formState.errors.cladding?.[0]?.density?.message}
						placeholder="Введите плотность"
						{...form.register('cladding.0.density')}
						type={'number'}
					/>
				</div>
				<div className="flex flex-row gap-[16px]">
					<Controller
						name="cladding.1.material"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: 'Стальной каркас', value: '1' }]}
								error={formState.errors.cladding?.[1]?.material?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px] w-[178px]',
									formState.errors.cladding?.[1]?.material?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
								buttonClassName="text-sm rounded-[8px] w-[226px]"
								label={
									formState.errors.cladding?.[1]?.material?.message || 'Каркас'
								}
								placeholder="Выберите материал"
							/>
						)}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[1]?.thickness?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={formState.errors.cladding?.[1]?.thickness?.message || 'Толщина, мм'}
						error={formState.errors.cladding?.[1]?.thickness?.message}
						placeholder="Введите толщину"
						{...form.register('cladding.1.thickness')}
						type={'number'}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[1]?.racksStep?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={
							formState.errors.cladding?.[1]?.racksStep?.message || 'Шаг стоек, мм'
						}
						error={formState.errors.cladding?.[1]?.racksStep?.message}
						placeholder="Введите шаг стоек"
						{...form.register('cladding.1.racksStep')}
						type={'number'}
					/>
				</div>
				<div className="flex flex-row gap-[16px]">
					<Controller
						name="cladding.2.material"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: 'Isover Acoustic S', value: '1' }]}
								error={formState.errors.cladding?.[2]?.material?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px] w-[178px]',
									formState.errors.cladding?.[2]?.material?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
								buttonClassName="text-sm rounded-[8px] w-[226px]"
								label={
									formState.errors.cladding?.[2]?.material?.message ||
									'Заполнитель'
								}
								placeholder="Выберите материал"
							/>
						)}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[2]?.thickness?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={formState.errors.cladding?.[2]?.thickness?.message || 'Толщина, мм'}
						error={formState.errors.cladding?.[2]?.thickness?.message}
						placeholder="Введите толщину"
						{...form.register('cladding.2.thickness')}
						type={'number'}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[2]?.density?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={
							formState.errors.cladding?.[2]?.density?.message || 'Плотность, кг/м³'
						}
						error={formState.errors.cladding?.[2]?.density?.message}
						placeholder="Введите плотность"
						{...form.register('cladding.2.density')}
						type={'number'}
					/>
				</div>
				<div className="flex flex-row gap-[16px]">
					<Controller
						name="cladding.3.material"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: 'Виброфлекс КС', value: '1' }]}
								error={formState.errors.cladding?.[3]?.material?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px] w-[178px]',
									formState.errors.cladding?.[3]?.material?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
								buttonClassName="text-sm rounded-[8px] w-[226px]"
								label={
									formState.errors.cladding?.[3]?.material?.message || 'Тип связи'
								}
								placeholder="Выберите тип связи"
							/>
						)}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[3]?.numberOfConnections?.message
								? 'text-error'
								: '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={
							formState.errors.cladding?.[3]?.numberOfConnections?.message ||
							'Количество точечных связей, шт/м³'
						}
						error={formState.errors.cladding?.[3]?.numberOfConnections?.message}
						placeholder="Введите количество"
						{...form.register('cladding.3.numberOfConnections')}
						type={'number'}
					/>
				</div>
				<div className="flex flex-row gap-[16px]">
					<Controller
						name="cladding.4.material"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: 'Гипсокартон', value: '1' }]}
								error={formState.errors.cladding?.[4]?.material?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px] w-[178px]',
									formState.errors.cladding?.[4]?.material?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
								buttonClassName="text-sm rounded-[8px] w-[226px]"
								label={
									formState.errors.cladding?.[4]?.material?.message ||
									'Плитные материалы'
								}
								placeholder="Выберите материал"
							/>
						)}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[4]?.thickness?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={formState.errors.cladding?.[4]?.thickness?.message || 'Толщина, мм'}
						error={formState.errors.cladding?.[4]?.thickness?.message}
						placeholder="Введите толщину"
						{...form.register('cladding.4.thickness')}
						type={'number'}
					/>
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							formState.errors.cladding?.[4]?.density?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={
							formState.errors.cladding?.[4]?.density?.message || 'Плотность, кг/м³'
						}
						error={formState.errors.cladding?.[4]?.density?.message}
						placeholder="Введите плотность"
						{...form.register('cladding.4.density')}
						type={'number'}
					/>
				</div>
			</div>
			{/* {layers.map((layer) => (
				<div className="flex flex-row gap-[16px]">
					<BaseConstructionLayer key={layer.id} id={layer.id} />
					<Button
						className="border-[1px] border-solid border-red bg-background-button-red p-[7px] enabled:hover:bg-inherit"
						onClick={() => handleDeleteLayer(layer.id)}
					>
						<DeleteIcon />
					</Button>
				</div>
			))}
			{layers.length < 2 && (
				<AiOutlinePlusCircle
					className="h-[33px] w-[33px] cursor-pointer self-center text-primary"
					onClick={() => handleAddLayer()}
				/>
			)} */}
		</div>
	);
};
