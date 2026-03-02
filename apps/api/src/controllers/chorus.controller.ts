import type { FastifyReply, FastifyRequest } from 'fastify';
import { ChorusService } from '../services/chorus.service.js';

export class ChorusController {
    private chorusService: ChorusService;

    constructor({ chorusService }: { chorusService: ChorusService }) {
        this.chorusService = chorusService;
    }

    async create(req: FastifyRequest<{ Body: { payload: string } }>, reply: FastifyReply) {
        const record = await this.chorusService.processAndSavePayload(req.body.payload);
        return reply.status(201).send({ status: 'success', data: record });
    }

    async getAll(_req: FastifyRequest, reply: FastifyReply) {
        const records = await this.chorusService.getAllRecords();
        return reply.send({ status: 'success', data: records });
    }

    async getOne(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const record = await this.chorusService.getRecordById(parseInt(req.params.id, 10));
        return reply.send({ status: 'success', data: record });
    }

    async update(req: FastifyRequest<{ Params: { id: string }, Body: { payload: string } }>, reply: FastifyReply) {
        const record = await this.chorusService.updateRecord(parseInt(req.params.id, 10), req.body.payload);
        return reply.send({ status: 'success', data: record });
    }

    async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const id = parseInt(req.params.id, 10);
        
        // The service still does the heavy lifting
        await this.chorusService.deleteRecord(id);

        // 204 No Content: We set the status and send nothing
        return reply.status(204).send(); 
    }
}