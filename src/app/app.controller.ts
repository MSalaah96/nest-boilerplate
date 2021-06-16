import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Resource, Resources } from '../decorators/resource.decorator';
import { Access, AccessTypes } from '../decorators/access.decorator';
import { AuthGuard } from '../guards/auth/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@Resource(Resources.Root)
@ApiTags(Resources.Root)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Access(AccessTypes.readAny)
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  root(): { name: string; version: number } {
    return this.appService.root();
  }
}
