import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { InstituteGroupModule } from './modules/institute-group/institute-group.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { RouteModule } from './modules/route/route.module';
import { RoleModule } from './modules/role/role.module';
import { ModulesAndActionModule } from './modules/modules-and-action/modules-and-action.module';
import { ModuleVersioningModule } from './modules/module-versioning/module-versioning.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import {PackagesModule} from './modules/packages/packages.module'
import { LicenseModule } from './modules/license/license.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    AuthModule,
    InstitutionsModule,
    InstituteGroupModule,
    RoleModule,
    RouteModule,
    ModulesAndActionModule,
    ModuleVersioningModule,
    SystemUsersModule,
    PackagesModule,
    LicenseModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*'); 
  }
}
