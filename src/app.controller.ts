import { Controller, Get, Put, Param, Body, Req, Delete, BadRequestException, NotFoundException, Res, HttpStatus } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { AppService } from './app.service';
import { Request } from 'express'
import { pairDto } from './dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {};

  @Put('/store/:key')
  async storePair(@Param('key') key: string, @Req() req: Request): Promise<string[]> {
    if (req.readable) {
      const raw = await rawbody(req);
      const value = raw.toString().trim();
      this.appService.storePair(key, value);
      return [key, value]
    } else {
      throw new BadRequestException("Request must have a plaintext body (utf-8) payload")
    }
  }

  @Put('/storemultiple')
  storePairs(@Body() pairs: pairDto[]): pairDto[] {
    pairs.forEach(pair => {
      if (!pair.key || !pair.value || typeof pair.key !== 'string' || typeof pair.value !== 'string') {
        throw new BadRequestException(`Request body must be a JSON list of objects with entries "key" and "value", both of type string`)
      }
    })
    this.appService.storePairs(pairs)
    return pairs
  }

  @Get('/findall')
  findAll(): string[] {
    return this.appService.findAll();
  }

  @Get('/store/:key')
  find(@Param('key') key: string): string {
    const val = this.appService.find(key);
    if (val) 
      return val
    else 
      throw new NotFoundException('Key not found')
  }

  @Delete('/store/:key')
  deletePair(@Param('key') key: string): string {
    const didDelete = this.appService.deletePair(key);
    if (didDelete) 
      return `DELETED pair with key: "${key}"`
    else 
      throw new NotFoundException('Key not found')
  }
}