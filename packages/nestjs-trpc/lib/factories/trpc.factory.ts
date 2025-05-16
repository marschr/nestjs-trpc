import { Inject, Injectable } from '@nestjs/common';
// import { MergeRouters } from '@trpc/server/dist/core/internals/mergeRouters'; // Removed
// import { AnyRouterDef } from '@trpc/server/dist/core/router'; // Removed
import { RouterFactory } from './router.factory';
import {
  TRPCRouter,
  TRPCPublicProcedure,
} from '../interfaces/factory.interface';
import { AnyRouter } from '@trpc/server';

@Injectable()
export class TRPCFactory {
  @Inject(RouterFactory)
  private readonly routerFactory!: RouterFactory;

  serializeAppRoutes(
    router: TRPCRouter,
    procedure: TRPCPublicProcedure,
  ): AnyRouter {
    const routerSchema = this.routerFactory.serializeRoutes(router, procedure);
    return router(routerSchema);
  }
}
