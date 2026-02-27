import { Chevron, FormElementLabel, Switch } from '@core';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export const DocumentFlags = () => {
	const { setValue, control, watch } = useFormContext<FormReportSchemaType>();
	const [showGeneralInfo, setShowGeneralInfo] = useState(true);
	const [showSoundInfo, setShowSoundInfo] = useState(true);

	const [showThermalInfo, setShowThermalInfo] = useState(true);

	const generalCharacteristics = watch('floorDocumentFlags.generalCharacteristics');
	const isGeneralEnabled =
		generalCharacteristics?.takeFloorMaterialsVolumesCalculation ||
		generalCharacteristics?.takeRoomCharacteristic ||
		generalCharacteristics?.takeWallMaterialsVolumesCalculation;

	const soundBaseReportInfoFlags = useWatch({
		control,
		name: 'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags',
	});
	const thermalBaseReportInfoFlags = useWatch({
		control,
		name: 'floorDocumentFlags.thermalInsulationCalculation.baseReportInfoFlags',
	});

	return (
		<div className="flex w-full flex-col gap-[20px] px-[300px] font-semibold">
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					Титульный лист
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeTitleList"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">Содержание</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeContent"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">Введение</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeIntroduction"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[200px] text-[#383838]">
					1. Общая характеристика
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue('floorDocumentFlags.generalCharacteristics', {
							takeFloorMaterialsVolumesCalculation: isEnabled,
							takeRoomCharacteristic: isEnabled,
							takeWallMaterialsVolumesCalculation: isEnabled,
						});
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowGeneralInfo(!showGeneralInfo)}
				/>
			</div>
			{showGeneralInfo && (
				<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							1.1 Характеристика помещений
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							1.2 Расчет объемов материалов стен
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							1.3 Расчет объемов материалов перекрытий
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
				</div>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[400px] text-[#383838]">
					2. Расчет звукоизоляции ограждающих конструкций
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue('floorDocumentFlags.soundInsulationCalculation', {
							takeEnclosingStructuresSoundInsulationCalculation: isEnabled,
						});
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowSoundInfo(!showSoundInfo)}
				/>
			</div>
			{showSoundInfo && (
				<>
					<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
						<div className="flex w-full items-center justify-start gap-[10px]">
							<FormElementLabel className="w-[350px]">
								2.1 Расчет звукоизоляции ограждающих конструкций
							</FormElementLabel>
							<Controller
								control={control}
								name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
								render={({ field }) => (
									<Switch
										isEnabledProp={watch(
											'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
										)}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
										}}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-[20px] pl-[100px] font-semibold text-input-label-primary">
						{soundBaseReportInfoFlags?.map((baseFlag, baseIndex) => {
							return (
								<>
									<div
										key={baseFlag.floorNumber}
										className="flex w-full items-center justify-start gap-[10px]"
									>
										<FormElementLabel className="w-[350px]">
											2.1.{baseIndex + 1} Конструкции на отметке{' '}
											{baseFlag.floorNumber}.000
										</FormElementLabel>
										<Controller
											control={control}
											name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
											render={({ field }) => (
												<Switch
													isEnabledProp={watch(
														'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
													)}
													onChange={(isEnabled) => {
														field.onChange(isEnabled);
													}}
												/>
											)}
										/>
									</div>
									{baseFlag.namedConstructionFlags?.map((namedConst, index) => {
										return (
											<>
												<div
													key={namedConst.reportConstructionId}
													className="flex w-full items-center justify-start gap-[10px]"
												>
													<FormElementLabel className="w-[350px]">
														2.1.{baseIndex + 1}.{index + 1} Конструкция{' '}
														{namedConst.constructionName}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
												<div className="flex w-full items-center justify-start gap-[10px] pl-[80px]">
													<FormElementLabel className="w-[350px]">
														2.1.{baseIndex + 1}.{index + 1}.1 Расчет
														звукоизоляции
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
												<div className="flex w-full items-center justify-start gap-[10px] pl-[80px]">
													<FormElementLabel className="w-[350px]">
														2.1.{baseIndex + 1}.{index + 1}.2 Анализ
														лабораторных данных
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
											</>
										);
									})}
								</>
							);
						})}
					</div>
				</>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[400px] text-[#383838]">
					3. Расчет теплоизоляции ограждающих конструкций
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue(
							'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod',
							isEnabled,
						);
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowThermalInfo(!showThermalInfo)}
				/>
			</div>
			{showThermalInfo && (
				<>
					<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
						<div className="flex w-full items-center justify-start gap-[10px]">
							<FormElementLabel className="w-[350px]">
								3.1 Детальный метод расчета приведенного сопротивления теплопередаче
							</FormElementLabel>
							<Controller
								control={control}
								name="floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod"
								render={({ field }) => (
									<Switch
										isEnabledProp={watch(
											'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod',
										)}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
										}}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-[20px] pl-[100px] font-semibold text-input-label-primary">
						{soundBaseReportInfoFlags?.map((baseFlag, baseIndex) => {
							return (
								<div
									key={baseFlag.floorNumber}
									className="flex flex-col gap-[20px]"
								>
									<div className="flex w-full items-center justify-start gap-[10px]">
										<FormElementLabel className="w-[350px]">
											3.1.{baseIndex + 1} Конструкции на отметке{' '}
											{baseFlag.floorNumber}.000
										</FormElementLabel>
										<Controller
											control={control}
											name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
											render={({ field }) => (
												<Switch
													isEnabledProp={watch(
														'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
													)}
													onChange={(isEnabled) => {
														field.onChange(isEnabled);
													}}
												/>
											)}
										/>
									</div>
									{baseFlag.namedConstructionFlags?.map((namedConst, index) => {
										return (
											<div
												key={namedConst.reportConstructionId}
												className="flex flex-col gap-[20px]"
											>
												<div className="flex w-full items-center justify-start gap-[10px]">
													<FormElementLabel className="w-[350px]">
														3.1.{baseIndex + 1}.{index + 1} Конструкция{' '}
														{namedConst.constructionName}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">Выводы</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeConclusion"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[250px] text-[#383838]">
					Список используемой литературы
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeUsedLiteratureList"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					ПРИЛОЖЕНИЕ 1. Звукоизоляция. Протоколы с расчетом
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementSoundInsulationProtocolsWithCalculation"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					ПРИЛОЖЕНИЕ 2. Теплоизоляция. Протоколы с расчетом
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementThermalInsulationProtocolsWithCalculation"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
};
