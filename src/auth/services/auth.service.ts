import {HttpException, HttpStatus} from '@nestjs/common';
import axios from 'axios';
import {Config} from "../../amo/configs/config";
import * as fs from 'fs/promises';

export class AuthService {
    private readonly baseUrl: string;
    private readonly code: string;
    private readonly client_id: string;
    private readonly client_secret: string;
    private readonly redirect_uri: string;

    constructor() {
        this.baseUrl = Config.AMOCRM_BASE_URL;
        this.code = Config.AMOCRM_AUTHORIZATION_CODE;
        this.client_id = Config.AMOCRM_CLIENT_ID;
        this.client_secret = Config.AMOCRM_CLIENT_SECRET;
        this.redirect_uri = Config.AMOCRM_REDIRECT_URI;
    }
    /**
     * Метод получения сохранённых токенов из json-файла
     */
    async getTokens() {
        // если файла нет, то он создаётся
        try {
            await fs.access("tokens.json");
        } catch {
            await fs.writeFile("tokens.json", '{}');
        }

        // чтение токенов из json файла
        const stringData = await fs.readFile("tokens.json", 'utf-8');
        return JSON.parse(stringData);
    }

    /**
     * Метод сохранения токенов в json-файл
     */
    async saveTokens(data: any): Promise<void> {
        return fs.writeFile('tokens.json', JSON.stringify(data));
    }

    /**
     * Метод авторизации на сайте amoCRM
     */
    async auth() {
        const url = `${this.baseUrl}/oauth2/access_token`;

        let tokens = await this.getTokens();

        let data;

        // если токенов в json файле нет, то для авторизации используется код авторизации, иначе - refresh token
        if (tokens.refresh_token == null) {
            data = {
                'client_id': this.client_id,
                'client_secret': this.client_secret,
                'redirect_uri': this.redirect_uri,
                'grant_type': "authorization_code",
                'code': this.code
            };
        } else {
            data = {
                'client_id': this.client_id,
                'client_secret': this.client_secret,
                'redirect_uri': this.redirect_uri,
                'grant_type': "refresh_token",
                'refresh_token': tokens.refresh_token
            };
        }

        const response = await axios.post(url, data);

        // если ответ сервера содержит токены, то сохраняем их
        if ("access_token" in response.data && "refresh_token" in response.data) {
            await this.saveTokens(response.data);
        }

    }
}