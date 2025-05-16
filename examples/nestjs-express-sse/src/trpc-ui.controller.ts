import {
  Controller,
  Get,
  Res,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc'; // Assuming AppRouterHost is exported
import type { Response } from 'express';
// import { renderTrpcPanel } from 'trpc-ui'; // Will be dynamically imported
import { AppRouter } from './@generated/server'; // Import the AppRouter type

@Controller('trpc-ui')
export class TrpcUiController {
  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  @Get()
  async getPanel(@Res() res: Response) {
    if (process.env.NODE_ENV !== 'development') {
      throw new NotFoundException('Not Found');
    }

    // Dynamically import renderTrpcPanel
    const { renderTrpcPanel } = await import('trpc-ui');

    const appRouterInstance = this.appRouterHost.appRouter as AppRouter;

    if (!appRouterInstance) {
      res.status(500).send('tRPC AppRouter not available');
      return;
    }

    const panelHtml = renderTrpcPanel(appRouterInstance, {
      url: 'http://localhost:8080/trpc', // Adjust if your port/path is different
      // transformer: "superjson", // Add if you use superjson
      meta: {
        title: 'NestJS-tRPC SSE Example UI',
        description: 'tRPC UI for the example NestJS app with SSE support.',
      },
    });

    res.type('text/html').send(panelHtml);
  }
}
