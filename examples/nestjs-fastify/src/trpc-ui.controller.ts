import {
  Controller,
  Get,
  Res,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
// For Fastify, Res type might be from 'fastify', but NestJS abstracts it.
// We'll use generic 'any' or rely on NestJS to correctly type 'res.type().send()'.
// For simplicity, we'll keep 'Response' from express and assume NestJS handles it.
import type { Response } from 'express'; // Or import FastifyReply and adjust if needed
import { AppRouter } from './@generated/server'; // Assuming similar path for generated router

@Controller('trpc-ui')
export class TrpcUiController {
  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  @Get()
  async getPanel(@Res() res: Response) {
    // res type might need to be FastifyReply for strictness
    // Dynamically import renderTrpcPanel
    const { renderTrpcPanel } = await import('trpc-ui');

    const appRouterInstance = this.appRouterHost.appRouter as AppRouter;

    if (!appRouterInstance) {
      // For Fastify, res.status().send() is the pattern
      (res as any).status(500).send('tRPC AppRouter not available');
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
    (res as any).type('text/html').send(panelHtml);
  }
}
