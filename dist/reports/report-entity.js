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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const typeorm_1 = require("typeorm");
const reports_status_enum_1 = require("./reports-status.enum");
let Report = class Report extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Report.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Report.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
Report = __decorate([
    typeorm_1.Entity()
], Report);
exports.Report = Report;
//# sourceMappingURL=report-entity.js.map