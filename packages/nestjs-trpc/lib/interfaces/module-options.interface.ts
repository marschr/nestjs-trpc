// import { RootConfigTypes } from '@trpc/server/dist/core/internals/config'; // Removed
import type { AnyRouter, CombinedDataTransformer } from '@trpc/server'; // ErrorFormatter and DefaultErrorShape removed from this line and the one below
import type { inferRouterContext } from '@trpc/server';
import type {
  SSEPingOptions,
  SSEClientOptions,
} from '@trpc/server/dist/unstable-core-do-not-import/stream/sse';
import { TRPCContext } from './context.interface';
import type { Class } from 'type-fest';
import { ZodTypeAny } from 'zod';

// Local definition for DefaultErrorShape (as it's not directly exported)
interface NestTRPCDefaultErrorShape {
  message: string;
  code: string; // Simplified from TRPC_ERROR_CODE_KEY
  data: {
    code: string; // Simplified from TRPC_ERROR_CODE_NUMBER
    httpStatus: number;
    path?: string;
    stack?: string;
  };
}

// Local definition for ErrorFormatter (as it's not directly exported)
type NestTRPCErrorFormatter<
  TContext,
  TShape extends NestTRPCDefaultErrorShape,
> = (opts: {
  error: any /* TRPCError */;
  type: string;
  path?: string;
  input?: unknown;
  ctx?: TContext;
  shape: TShape;
}) => TShape;

export type SchemaImports =
  | ((...args: Array<unknown>) => unknown)
  | object
  | ZodTypeAny;

/**
 * @internal
 */
export interface TRPCSSEOptions {
  /**
   * SSE Ping options.
   */
  ping?: SSEPingOptions;
  /**
   * Maximum duration in milliseconds for the request before ending the stream.
   * @default undefined
   */
  maxDurationMs?: number;
  /**
   * End the request immediately after data is sent.
   * Only useful for serverless runtimes that do not support streaming responses.
   * @default false
   */
  emitAndEndImmediately?: boolean;
  /**
   * Client-specific SSE options - these will be sent to the client as part of the first message.
   * @default {}
   */
  client?: SSEClientOptions;
}

/**
 * "TRPCModule" options object.
 */
export interface TRPCModuleOptions {
  /**
   * Path to trpc app router and helpers types output.
   */
  autoSchemaFile?: string;

  /**
   * Specifies additional imports for the schema file. This array can include functions, objects, or Zod schemas.
   * While `nestjs-trpc` typically handles imports automatically, this option allows manual inclusion of imports for exceptional cases.
   * Use this property only when automatic import resolution is insufficient.
   *
   * Please consider opening an issue on Github so we can update the adapter to better handle your case.
   */
  schemaFileImports?: Array<SchemaImports>;

  /**
   * The base path for all trpc requests.
   * @default "/trpc"
   */
  basePath?: string;

  /**
   * The exposed trpc options when creating a route with either `createExpressMiddleware` or `createFastifyMiddleware`.
   * If not provided, the adapter will use a default createContext.
   * @link https://nestjs-trpc.io/docs/context
   */
  context?: Class<TRPCContext>;

  /**
   * Use custom error formatting
   * @link https://trpc.io/docs/error-formatting
   */
  errorFormatter?: NestTRPCErrorFormatter<
    any, // TContext placeholder
    NestTRPCDefaultErrorShape
  >;

  /**
   * Use a data transformer
   * @link https://trpc.io/docs/data-transformers
   */
  transformer?: CombinedDataTransformer;

  /**
   * Server-Sent Events (SSE) options.
   */
  sse?: TRPCSSEOptions;
}
