import { z } from 'zod';

const PlacementRoomSchema = z.object({
	id: z.string().optional(),
	name: z.string().nullable(),
});

const FormPlacementRoomSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
});

type PlacementRoomDataSchemaType = z.infer<typeof PlacementRoomSchema>;
type FormPlacementRoomDataSchemaType = z.infer<typeof FormPlacementRoomSchema>;

export {
	PlacementRoomSchema,
	type PlacementRoomDataSchemaType,
	type FormPlacementRoomDataSchemaType,
	FormPlacementRoomSchema,
};
