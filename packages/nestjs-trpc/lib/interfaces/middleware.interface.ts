import type { ProcedureType, AnyTRPCRootTypes } from '@trpc/server';

// Placeholder for MiddlewareReturn as it's not directly exported
type NestTRPCMiddlewareReturn = any; // Or a more specific structural type if needed later

export type MiddlewareResponse =
  | Promise<NestTRPCMiddlewareReturn> // Replaced MiddlewareReturn<AnyTRPCRootTypes>
  | (<$Context>(opts: { ctx: $Context }) => Promise<NestTRPCMiddlewareReturn>); // Replaced MiddlewareReturn<AnyTRPCRootTypes>

export type MiddlewareOptions<TContext extends object = object> = {
  ctx: TContext;
  type: ProcedureType;
  path: string;
  input: unknown;
  rawInput: unknown;
  meta: unknown; // Consider AnyTRPCRootTypes['meta'] if appropriate
  next: (opts?: {
    ctx: Record<string, unknown>;
  }) => Promise<NestTRPCMiddlewareReturn>; // Replaced MiddlewareReturn<AnyTRPCRootTypes>
};

export interface TRPCMiddleware {
  use(
    opts: MiddlewareOptions,
  ): MiddlewareResponse | Promise<MiddlewareResponse>;
}
