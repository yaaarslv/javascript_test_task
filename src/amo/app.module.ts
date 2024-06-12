import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {AmoService} from './services/amo.service';
import {AmoController} from './controllers/amo.controller';
import {AuthService} from "../auth/services/auth.service";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';

@Module({
    imports: [
        HttpModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'frontend/dist'),
        }),
    ],
    controllers: [AmoController],
    providers: [AmoService, AuthService],
})
export class AppModule {
}
