import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigurationService } from '../config/configuration.service';
import { ConfigurationModule } from '../config/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from './crypto.service';
import { QueryParserMiddleware } from '../server/middlewares/request/queryParser.middleware';
import { AuthenticationMiddleware } from '../server/middlewares/request/authentication.middleware';
import { SanitizeMongoMiddleware } from '../server/middlewares/request/sanitizeMongo.middleware';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (config: ConfigurationService) => ({
        uri: config.mongo,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10, // Maintain up to 10 socket connections
        bufferMaxEntries: 0,
        useFindAndModify: false,
      }),
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, CryptoService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        QueryParserMiddleware,
        AuthenticationMiddleware,
        SanitizeMongoMiddleware,
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
