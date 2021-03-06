"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const threats_service_1 = require("./threats.service");
let ThreatsController = class ThreatsController {
    constructor(threatsService) {
        this.threatsService = threatsService;
    }
    getAllThreats() {
        return this.threatsService.getAllThreats();
    }
    getThreatById(id) {
        return this.threatsService.getThreatById(id);
    }
    uploadFile(file) {
        console.log(file.buffer.toString());
        return this.threatsService.parse(file.buffer.toString(), file.originalname);
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "getAllThreats", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "getThreatById", null);
__decorate([
    common_1.Post('/upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "uploadFile", null);
ThreatsController = __decorate([
    common_1.Controller('/threats'),
    __metadata("design:paramtypes", [threats_service_1.ThreatsService])
], ThreatsController);
exports.ThreatsController = ThreatsController;
//# sourceMappingURL=threats.controller.js.map