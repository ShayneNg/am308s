import { DataRepository } from '../repositories/data.repository';

export class DataService {
    private repository: DataRepository;

    constructor() {
        this.repository = new DataRepository();
    }

    async processIngestion(payload: string) {
        // Future business logic can go here (e.g., checking for duplicates)
    }
}