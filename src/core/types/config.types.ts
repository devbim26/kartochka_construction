import type { FieldValues } from 'react-hook-form';
import type { ZodEffects, ZodObject } from 'zod';

export type EntityConfig = { defaultValues: FieldValues; schema: ZodObject<any> | ZodEffects<any> };
