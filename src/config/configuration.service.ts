import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get mongo(): string {
    return this.configService.get<string>('mongo.url');
  }

  get common(): { pageSize: number; maxPageSize: number } {
    return this.configService.get<{ pageSize: number; maxPageSize: number }>(
      'common',
    );
  }

  get app(): { name: string; version: number } {
    return this.configService.get<{ name: string; version: number }>('app');
  }

  get authenticationKey(): string {
    return this.configService.get<string>('authentication.key');
  }

  get port(): number {
    return this.configService.get<number>('port');
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('env') === 'development';
  }
}
