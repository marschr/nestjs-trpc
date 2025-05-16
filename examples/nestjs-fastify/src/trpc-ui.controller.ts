import { Controller, Get, Res, Inject } from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
import type { FastifyReply } from 'fastify'; // Specific to Fastify
import { AnyTRPCRouter } from '@trpc/server';

@Controller('trpc-ui')
export class TrpcUiController {
  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  @Get()
  async getPanel(@Res() reply: FastifyReply) {
    // Use FastifyReply
    const { renderTrpcPanel } = await import('trpc-ui');

    const appRouterInstance: AnyTRPCRouter = this.appRouterHost.appRouter;

    if (!appRouterInstance) {
      reply.status(500).send('tRPC AppRouter not available');
      return;
    }

    const panelHtml = renderTrpcPanel(appRouterInstance, {
      url: 'http://localhost:8080/trpc',
      meta: {
        title: 'NestJS-tRPC Fastify Example UI',
        description: 'tRPC UI for the example NestJS Fastify app.',
      },
    });

    reply.type('text/html').send(panelHtml);
  }
}
