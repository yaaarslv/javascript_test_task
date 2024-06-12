import {Controller, Get, Query} from '@nestjs/common';
import {AmoService} from '../services/amo.service';

@Controller('api')
export class AmoController {
    constructor(private readonly amoService: AmoService) {
    }

    @Get('leads')
    async getLeads(@Query('query') query?: string) {
        return await this.amoService.getLeadsWithContacts_Statuses_ResponsibleUsers(query);
    }
}
