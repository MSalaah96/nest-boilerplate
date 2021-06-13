import * as compression from 'compression';
import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app/app.module';
import { ConfigurationService } from '../config/configuration.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class Server {
  async start() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigurationService>(ConfigurationService);
    const port = config.port;
    const { name, version } = config.app;
    app.useGlobalPipes(new ValidationPipe());
    app.use(compression());
    app.use(helmet());
    app.enableCors();
    this._setupDocs(app, { name, description: 'description', version });
    await app.listen(port);
    console.log(`API [${name}] started at [${port}] `);
  }

  _setupDocs(app, { name, description, version }) {
    const config = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}
