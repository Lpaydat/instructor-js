import { z, ZodError } from "zod";

import { Validator } from "@cfworker/json-schema";

import type { Schema } from "@cfworker/json-schema";

export const dataValidation = async <T extends z.AnyZodObject>(
  data: { [x: string]: unknown },
  schema: T | Schema
): Promise<
  z.SafeParseReturnType<
    {
      [x: string]: unknown
    },
    {
      [x: string]: unknown
    }
  >
> => {
  if (schema instanceof z.ZodObject) {
    return await schema.safeParseAsync(data)
  }

  const validator = new Validator(schema)
  const result = validator.validate(data)


  return result.valid ?
      {
        success: true,
        data: data
      }
    : {
        success: false,
        error: new ZodError([
          {
            message: `Data validation failed: ${result.errors.map(e => e.error).join(", ")}`,
            code: z.ZodIssueCode.custom,
            path: []
          }
        ])
      }
}
