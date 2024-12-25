import { Static, Type } from '@sinclair/typebox';

export const SensorsSchema = Type.Object(
  {
    temperature: Type.Union([Type.Number(), Type.Null()]),
    humidity: Type.Union([Type.Number(), Type.Null()]),
  },
  { additionalProperties: false }
);

export type SensorsReqBody = Static<typeof SensorsSchema>;

export const DeleteIdsSchema = Type.Object(
  {
    ids: Type.Array(Type.String(), { minItems: 1 }),
  },
  { additionalProperties: false }
);

export type DeleteIdsReqBody = Static<typeof DeleteIdsSchema>;
