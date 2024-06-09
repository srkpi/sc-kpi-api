import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true , transform: true}));
  app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
      })
  )
  await app.listen(3000);
}
bootstrap();
