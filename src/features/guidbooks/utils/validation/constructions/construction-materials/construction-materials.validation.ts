import { z } from 'zod';

export const SelectableMaterialTypeSchema = z.object({
	materialType: z.string().min(1, 'Поле обязательно для заполнения'),
	material: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const HeavyMaterialTypeSchema = z.object({
	material: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const AirGapMaterialTypeSchema = z.object({
	airGap: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const LinkMaterialTypeSchema = z.object({
	link: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const FrameMaterialTypeSchema = z.object({
	frame: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const FillerMaterialTypeSchema = z.object({
	filler: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const BoardMaterialTypeSchema = z.object({
	board: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const ZPanelMaterialTypeSchema = z.object({
	zPanel: z.string().min(1, 'Поле обязательно для заполнения'),
});

export type HeavyMaterialTypeSchemaType = z.infer<typeof HeavyMaterialTypeSchema>;
export type SelectableMaterialTypeSchemaType = z.infer<typeof SelectableMaterialTypeSchema>;
export type AirGapMaterialTypeSchemaType = z.infer<typeof AirGapMaterialTypeSchema>;
export type LinkMaterialTypeSchemaType = z.infer<typeof LinkMaterialTypeSchema>;
export type FrameMaterialTypeSchemaType = z.infer<typeof FrameMaterialTypeSchema>;
export type FillerMaterialTypeSchemaType = z.infer<typeof FillerMaterialTypeSchema>;
export type BoardMaterialTypeSchemaType = z.infer<typeof BoardMaterialTypeSchema>;
export type ZPanelMaterialTypeSchemaType = z.infer<typeof ZPanelMaterialTypeSchema>;
