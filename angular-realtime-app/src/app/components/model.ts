export class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    isValid(): boolean {
        return !!this.name;
    }
}

export interface IRoom {
    name: string;
    maxCapacity: number;
    currentCapacity: number;
}