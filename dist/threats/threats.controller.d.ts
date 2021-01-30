import { ThreatsService } from './threats.service';
export declare class ThreatsController {
    private threatsService;
    constructor(threatsService: ThreatsService);
    uploadFile(file: any): Promise<void>;
}
