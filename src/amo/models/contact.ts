export class Contact {
    private _name: string;
    private _email: string;
    private _phoneNumber: string;
    private _isMain: boolean;


    constructor(name: string, email: string, phoneNumber: string, isMain: boolean) {
        this._name = name;
        this._email = email;
        this._phoneNumber = phoneNumber;
        this._isMain = isMain;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    get isMain(): boolean {
        return this._isMain;
    }
}