import { FastifyRequest, FastifyReply } from 'fastify';
import { DataService } from '../services/data.service';

export class DataController {
    private service: DataService;

    constructor() {
        this.service = new DataService();
    }

    // Use an arrow function to preserve the 'this' context
    ingestData = async (
        request: FastifyRequest<{ Body: { payload: string } }>,
        reply: FastifyReply
    ) => {
        try {
        const { payload } = request.body;
        const result = await this.service.processIngestion(payload);

        return reply.code(201).send({
            success: true,
            data: result
        });
        } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
            success: false,
            message: 'Internal Server Error'
        });
        }
    };
}