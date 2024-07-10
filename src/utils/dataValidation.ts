import Ajv from "ajv";
import { JSONSchema } from "json-schema-stream";
import { z, ZodError } from "zod";

export const dataValidation = async <T extends z.AnyZodObject>(
  data: object,
  schema: T | JSONSchema
): Promise<
  z.SafeParseReturnType<
    {
      [x: string]: any
    },
    {
      [x: string]: any
    }
  >
> => {
  if (schema instanceof z.ZodObject) {
    return await schema.safeParseAsync(data)
  }

  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const isValid = validate(data)

  return isValid ?
      {
        success: true,
        data: data
      }
    : {
        success: false,
        error: new ZodError([
          {
            message: `Data validation failed. Schema: ${JSON.stringify(schema)}`,
            code: z.ZodIssueCode.custom,
            path: []
          }
        ])
      }
}
