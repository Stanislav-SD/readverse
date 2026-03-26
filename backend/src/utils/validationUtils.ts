import { z } from 'zod';

const ConditionSchema: any = z.lazy(() =>
    z.union([
        z.object({
            type: z.string(),
            operator: z.enum([">=", "<=", "==", "includes"]),
            value: z.any()
        }),
        z.object({ all: z.array(ConditionSchema) }),
        z.object({ any: z.array(ConditionSchema) })
    ])
);

export { ConditionSchema };