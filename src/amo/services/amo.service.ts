import {Injectable} from '@nestjs/common';
import {Config} from "../configs/config";
import axios from "axios";
import {AuthService} from "../../auth/services/auth.service";
import {Lead} from "../models/lead";
import {format} from 'date-fns';
import {Contact} from "../models/contact";

@Injectable()
export class AmoService {
    private readonly baseUrl: string;

    constructor(private authService: AuthService) {
        this.baseUrl = Config.AMOCRM_BASE_URL;
    }

    /**
     * Метод получения всех сделок с их контактами, статусами и ответственными лицами
     */
    async getLeadsWithContacts_Statuses_ResponsibleUsers(query?: string): Promise<Lead[]> {
        const allLeads = await this.getLeads(query);
        const allContacts = await this.getContacts();
        const allPipelines = await this.getPipelines();
        const allResponsibleUsers = await this.getUsers();

        let leads: Lead[] = []

        for (const lead of allLeads) {
            const name = lead.name;
            const price = lead.price;
            const createDate = format(new Date(lead.created_at * 1000), 'HH:mm:ss dd-MM-yyyy');
            const pipeline_id = lead.pipeline_id;
            const status_id = lead.status_id;
            const status = await this.findStatusByPipelineId(status_id, pipeline_id, allPipelines);
            const responsible_user_id = lead.responsible_user_id;
            const responsibleUser = await this.findResponsibleUserById(responsible_user_id, allResponsibleUsers);
            let contacts: Contact[] = [];
            for (const contact of lead._embedded.contacts) {
                const contact_id = contact.id;
                const isMain = contact.is_main;
                const namePhoneNumberEmail = await this.findEmailAndPhoneNumberByContactId(contact_id, allContacts);
                const contactName = namePhoneNumberEmail["name"];
                const phoneNumber = namePhoneNumberEmail["phoneNumber"];
                const email = namePhoneNumberEmail["email"];
                contacts.push(new Contact(contactName, email, phoneNumber, isMain));
            }

            leads.push(new Lead(name, price, status, responsibleUser, contacts, createDate));
        }

        return leads;
    }

    /**
     * Метод получения всех сделок
     */
    async getLeads(query?: string) {
        if (query) {
            return this.makeRequest('leads', `${query}`, 'contacts');
        } else {
            return this.makeRequest('leads', '', 'contacts');
        }
    }

    /**
     * Метод получения всех контактов
     */
    async getContacts() {
        return this.makeRequest('contacts');
    }

    /**
     * Метод получения всех пайплайнов
     */
    async getPipelines() {
        return this.makeRequest('leads/pipelines');
    }

    /**
     * Метод получения всех ответственных лиц
     */
    async getUsers() {
        return this.makeRequest('users');
    }

    /**
     * Метод запроса данных с сервера amoCRM
     */
    async makeRequest(endpoint: string, query: string = '', with_: string = '') {
        await this.authService.auth();
        const url = `${this.baseUrl}/api/v4/${endpoint}?query=${query}&with=${with_}`;

        let tokens = await this.authService.getTokens();
        const response = await axios.get(url, {
            headers: {'Authorization': 'Bearer ' + tokens.access_token}
        });

        let dataName = endpoint.split("/").at(-1);
        return response.data._embedded[dataName];
    }

    /**
     * Метод поиска статуса по id пайплайна
     */
    async findStatusByPipelineId(status_id: number, pipeline_id: number, allPipelines: any[]): Promise<string> {
        const pipeline = allPipelines.find(p => p.id === pipeline_id);
        if (pipeline) {
            const status = pipeline._embedded.statuses.find(s => s.id === status_id);
            if (status) {
                return status.name;
            }
        }

        return ""
    }

    /**
     * Метод поиска ответственного лица по его id
     */
    async findResponsibleUserById(user_id: number, allResponsibleUsers: any[]): Promise<string> {
        const user = allResponsibleUsers.find(user => user.id === user_id);
        if (user) {
            return user.name;
        }

        return ""
    }

    /**
     * Метод поиска электронной почты и номера по id контакта
     */
    async findEmailAndPhoneNumberByContactId(contact_id: number, allContacts: any[]): Promise<{}> {
        const contact = allContacts.find(contact => contact.id === contact_id);

        if (contact) {
            const name = contact.name;
            let phoneNumber = '';
            let email = '';

            if (contact.custom_fields_values != null) {
                contact.custom_fields_values.forEach((field) => {
                    if (field.field_name === "Телефон") {
                        phoneNumber = field.values[0].value;
                    } else if (field.field_name === "Email") {
                        email = field.values[0].value;
                    }
                });
            }

            return {name: name, phoneNumber: phoneNumber, email: email};
        }

        return {};
    }

}
