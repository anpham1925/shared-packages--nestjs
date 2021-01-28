"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
var typeorm_1 = require("typeorm");
var common_entity_1 = require("../common/entities/common.entity");
var AuditLog = /** @class */ (function (_super) {
    __extends(AuditLog, _super);
    function AuditLog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.Column()
    ], AuditLog.prototype, "action", void 0);
    __decorate([
        typeorm_1.Column()
    ], AuditLog.prototype, "module", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], AuditLog.prototype, "userId", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], AuditLog.prototype, "role", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], AuditLog.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column({ type: 'json', nullable: true })
    ], AuditLog.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column({
            default: '',
        })
    ], AuditLog.prototype, "url", void 0);
    AuditLog = __decorate([
        typeorm_1.Entity()
    ], AuditLog);
    return AuditLog;
}(common_entity_1.CommonEntity));
exports.AuditLog = AuditLog;
