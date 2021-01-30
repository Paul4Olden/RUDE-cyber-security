import { ThreatsService } from './threats.service';
export declare class ThreatsController {
    private threatsService;
    private readonly logger;
    constructor(threatsService: ThreatsService);
    uploadFile(file: any): Promise<void>;
}
