"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonEntity = void 0;
var typeorm_1 = require("typeorm");
var CommonEntity = /** @class */ (function () {
    function CommonEntity() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], CommonEntity.prototype, "id", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], CommonEntity.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.CreateDateColumn()
    ], CommonEntity.prototype, "createdAt", void 0);
    return CommonEntity;
}());
exports.CommonEntity = CommonEntity;
