import { ConstructionTypeShema } from '@features/guidbooks/utils/validation/constructions';
import { z } from 'zod';

/**
 * Схема формы проектирования / расчёта.
 * Должна совпадать с `constructionTypeObject` (left/center/right + materialTypeValue),
 * иначе `form.trigger()` пропускает отрицательную толщину слоёв.
 */
export const DesigningSchema = z.object({
	constructionTypeObject: ConstructionTypeShema,
});

export type DesigningSchemaType = z.infer<typeof DesigningSchema>;
