import { Module } from '@nestjs/common';
import { UserRouter } from './user.router';
import { SSERouter } from './sse.router';
import { TRPCModule, AppRouterHost } from 'nestjs-trpc';
import { UserService } from './user.service';
import { ProtectedMiddleware } from './protected.middleware';
import { AppContext } from './app.context';
import { TrpcUiController } from './trpc-ui.controller';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV === 'production' ? undefined : './src/@generated',
      context: AppContext,
    }),
  ],
  controllers: [TrpcUiController],
  providers: [
    UserRouter,
    SSERouter,
    AppContext,
    UserService,
    ProtectedMiddleware,
  ],
})
export class AppModule {}
