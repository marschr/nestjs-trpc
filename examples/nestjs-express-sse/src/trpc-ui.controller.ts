import { Controller, Get, Res, Inject } from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
import type { Response } from 'express';
import { AnyTRPCRouter } from '@trpc/server'; // Changed from AppRouter from generated

@Controller('trpc-ui')
export class TrpcUiController {
  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  @Get()
  async getPanel(@Res() res: Response) {
    const { renderTrpcPanel } = await import('trpc-ui');

    const appRouterInstance: AnyTRPCRouter = this.appRouterHost.appRouter;

    if (!appRouterInstance) {
      res.status(500).send('tRPC AppRouter not available');
      return;
    }

    const panelHtml = renderTrpcPanel(appRouterInstance, {
      url: 'http://localhost:8080/trpc',
      meta: {
        title: 'NestJS-tRPC SSE Example UI',
        description: 'tRPC UI for the example NestJS Express SSE app.',
      },
    });

    res.type('text/html').send(panelHtml);
  }
}
