"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var metadata_1 = require("./metadata");
var AuditLogInterceptor = /** @class */ (function () {
    function AuditLogInterceptor(reflector, auditLogService) {
        this.reflector = reflector;
        this.auditLogService = auditLogService;
    }
    AuditLogInterceptor.prototype.intercept = function (context, next) {
        var _this = this;
        return next.handle().pipe(operators_1.map(function (data) {
            var action = _this.reflector.get(metadata_1.METADATA.ACTION, context.getHandler());
            var exception = _this.reflector.get(metadata_1.METADATA.CONFIDENTIAL_BODY, context.getHandler());
            var module = _this.reflector.get(metadata_1.METADATA.MODULE, context.getClass());
            if (action) {
                var request = context.switchToHttp().getRequest();
                _this.auditLogService.writeLog(module, action, request, exception ? true : false);
            }
            return data;
        }));
    };
    AuditLogInterceptor = __decorate([
        common_1.Injectable()
    ], AuditLogInterceptor);
    return AuditLogInterceptor;
}());
exports.AuditLogInterceptor = AuditLogInterceptor;
