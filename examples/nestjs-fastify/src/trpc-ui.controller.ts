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
    // Dynamically import renderTrpcPanel
    const { renderTrpcPanel } = await import('trpc-ui');

    const appRouterInstance: AnyTRPCRouter = this.appRouterHost.appRouter;

    if (!appRouterInstance) {
      // For Fastify, res.status().send() is the pattern
      reply.status(500).send('tRPC AppRouter not available');
      return;
    }

    const panelHtml = renderTrpcPanel(appRouterInstance, {
      url: 'http://localhost:8080/trpc', // Port is 8080 as per main.ts
      // transformer: "superjson", // Add if you use superjson
      meta: {
        title: 'NestJS-tRPC Fastify Example UI',
        description: 'tRPC UI for the example NestJS Fastify app.',
      },
    });
    // For Fastify, res.type().send() is correct via NestJS adapter
    reply.type('text/html').send(panelHtml);
  }
}
