import { Router, Subscription, Input } from 'nestjs-trpc';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

@Router()
export class SSERouter {
  @Subscription({
    // Subscriptions in tRPC usually don't have a separate 'output' schema defined at the procedure level.
    // The type is defined by the observable.
  })
  randomNumberStream() {
    return observable<{
      randomNumber: number;
      timestamp: string;
    }>((emit) => {
      let count = 0;
      const timer = setInterval(() => {
        count++;
        emit.next({
          randomNumber: Math.random(),
          timestamp: new Date().toISOString(),
        });

        if (count >= 10) {
          emit.complete();
          clearInterval(timer);
        }
      }, 500);

      return () => {
        clearInterval(timer);
      };
    });
  }

  @Subscription({
    input: z.object({
      start: z.number().default(0),
      limit: z.number().default(5),
    }),
  })
  countUp(@Input('start') start: number, @Input('limit') limit: number) {
    return observable<number>((emit) => {
      let current = start;
      const timer = setInterval(() => {
        emit.next(current);
        current++;
        if (current > start + limit) {
          emit.complete();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    });
  }
}
