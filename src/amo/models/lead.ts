import {Contact} from "./contact";

export class Lead {
    private readonly _name: string;
    private readonly _price: number;
    private readonly _status: string;
    private readonly _responsibleUser: string;
    private readonly _contact: Contact[];
    private readonly _createDate: string;


    constructor(name: string, price: number, status: string, responsibleUser: string, contact: Contact[], createDate: string) {
        this._name = name;
        this._price = price;
        this._status = status;
        this._responsibleUser = responsibleUser;
        this._contact = contact;
        this._createDate = createDate;
    }


    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    get status(): string {
        return this._status;
    }

    get responsibleUser(): string {
        return this._responsibleUser;
    }

    get contact(): Contact[] {
        return this._contact;
    }

    get createDate(): string {
        return this._createDate;
    }
}