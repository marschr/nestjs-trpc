import { Module } from '@nestjs/common';
import { UserRouter } from './user.router';
import { SSERouter } from './sse.router';
import { TRPCModule } from 'nestjs-trpc';
import { UserService } from './user.service';
import { ProtectedMiddleware } from './protected.middleware';
import { AppContext } from './app.context';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV === 'production' ? undefined : './src/@generated',
      context: AppContext,
    }),
  ],
  providers: [
    UserRouter,
    SSERouter,
    AppContext,
    UserService,
    ProtectedMiddleware,
  ],
})
export class AppModule {}
