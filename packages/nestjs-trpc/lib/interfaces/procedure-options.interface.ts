import type { ProcedureType, AnyTRPCRootTypes } from '@trpc/server';

export type ProcedureOptions = {
  type?: ProcedureType;
  path?: string;
  rawInput?: unknown;
  input?: unknown;
  output?: unknown;
  meta?: AnyTRPCRootTypes['meta'];
  [key: string]: any;
};
