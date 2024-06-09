import {ClassSerializerInterceptor, INestApplication, ValidationPipe} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export function setup(app: INestApplication) {
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            strategy: 'excludeAll',
            excludeExtraneousValues: true,
        })
    );
    app.useGlobalPipes(new ValidationPipe({ whitelist: true , transform: true}));

    const config = new DocumentBuilder()
        .setTitle('Api test')
        .setDescription('Api description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    return app;
}
