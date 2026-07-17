import { Chevron, FormElementLabel, Switch, useI18n } from '@core';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export const DocumentFlags = () => {
	const { setValue, control, watch, getValues } = useFormContext<FormReportSchemaType>();
	const [showSoundInfo, setShowSoundInfo] = useState(true);
	const { t } = useI18n();

	const soundBaseReportInfoFlags = useWatch({
		control,
		name: 'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags',
	});
	const isSoundEnabled =
		!!watch(
			'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
		) ||
		(soundBaseReportInfoFlags ?? []).some(
			(baseFlag) =>
				!!baseFlag?.takeFloor ||
				(baseFlag?.namedConstructionFlags ?? []).some(
					(namedFlag) => !!namedFlag?.takeConstruction,
				),
		);
	const toggleSoundSection = (isEnabled: boolean) => {
		setValue(
			'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
			isEnabled,
		);
		const baseFlags = getValues(
			'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags',
		);
		(baseFlags ?? []).forEach((_, baseIndex) => {
			setValue(
				`floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags.${baseIndex}.takeFloor` as const,
				isEnabled,
			);
			const namedFlags = getValues(
				`floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags.${baseIndex}.namedConstructionFlags` as const,
			);
			(namedFlags ?? []).forEach((__, namedIndex) => {
				setValue(
					`floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags.${baseIndex}.namedConstructionFlags.${namedIndex}.takeConstruction` as const,
					isEnabled,
				);
			});
		});
	};

	return (
		<div className="flex w-full flex-col gap-[20px] px-[300px] font-semibold">
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.titleList')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeTitleList"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.contents')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeContent"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.introduction')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeIntroduction"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[400px] text-[#383838]">
					{t('constructor.reportForm.docs.sound.section')}
				</FormElementLabel>
				<Switch
					isEnabledProp={isSoundEnabled}
					onChange={toggleSoundSection}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showSoundInfo ? 'down' : 'up'}
					onClick={() => setShowSoundInfo(!showSoundInfo)}
				/>
			</div>
			{showSoundInfo && (
				<>
					<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
						<div className="flex w-full items-center justify-start gap-[10px]">
							<FormElementLabel className="w-[350px]">
								{t('constructor.reportForm.docs.sound.calc')}
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
								<div key={baseFlag.floorNumber || `sound-floor-${baseIndex}`}>
									<div
										className="flex w-full items-center justify-start gap-[10px]"
									>
										<FormElementLabel className="w-[350px]">
											{`1.1.${baseIndex + 1} ${t('constructor.reportForm.docs.sound.constructionsAt')} ${baseFlag.floorNumber}.000`}
										</FormElementLabel>
										<Controller
											control={control}
											name={`floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags.${baseIndex}.takeFloor` as const}
											render={({ field }) => (
												<Switch
													isEnabledProp={!!field.value}
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
												key={namedConst.reportConstructionId || `sound-construction-${baseIndex}-${index}`}
											>
												<div
													className="flex w-full items-center justify-start gap-[10px]"
												>
													<FormElementLabel className="w-[350px]">
														{`1.1.${baseIndex + 1}.${index + 1} ${t('constructor.reportForm.docs.sound.construction')} ${namedConst.constructionName}`}
													</FormElementLabel>
													<Controller
														control={control}
														name={`floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags.${baseIndex}.namedConstructionFlags.${index}.takeConstruction` as const}
														render={({ field }) => (
															<Switch
																isEnabledProp={!!field.value}
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
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.conclusion')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeConclusion"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[250px] text-[#383838]">
					{t('constructor.reportForm.docs.literature')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeUsedLiteratureList"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					{t('constructor.reportForm.docs.appendix1')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementSoundInsulationProtocolsWithCalculation"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					{t('constructor.reportForm.docs.appendix2')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementSoundInsulationAlternativeProtocols"
					render={({ field }) => (
						<Switch
							isEnabledProp={!!field.value}
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
