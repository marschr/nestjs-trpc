import { PROCEDURE_METADATA_KEY, PROCEDURE_TYPE_KEY } from '../trpc.constants';
import { ProcedureType } from '../trpc.enum';
import { ProcedureOptions } from '../interfaces';

export function Subscription(options?: ProcedureOptions): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      PROCEDURE_TYPE_KEY,
      ProcedureType.Subscription,
      descriptor.value,
    );
    Reflect.defineMetadata(PROCEDURE_METADATA_KEY, options, descriptor.value);
    return descriptor;
  };
}
