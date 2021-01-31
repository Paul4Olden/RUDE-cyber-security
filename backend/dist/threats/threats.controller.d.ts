import { ThreatsService } from './threats.service';
export declare class ThreatsController {
    private threatsService;
    constructor(threatsService: ThreatsService);
    getAllThreats(): import("./data/threats.interface").Threat[];
    getThreatById(id: string): import("./data/threats.interface").Threat;
    uploadFile(file: any): import("./data/threats.interface").Threat;
}
