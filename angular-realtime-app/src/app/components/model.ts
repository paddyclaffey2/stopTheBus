export class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    isValid(): boolean {
        return !!this.name;
    }
}

export interface IGame {
    categoryInPlay: string;
    allCategories: string[];
    playedCategories: { name: string, scores: IScore[]}[];


}

export interface IScore {
    name: string;
    score: number;
}

export interface ICategory {
    name: string;
    currentCapacity: number;
}



