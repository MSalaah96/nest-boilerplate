import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class AppService {
  constructor(private readonly configurationService: ConfigurationService) {}

  root(): { name: string; version: number } {
    return this.configurationService.app;
  }
}
