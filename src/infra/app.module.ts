import { envSchema } from "@/infra/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http.module";
import { CustomPrismaModule } from "nestjs-prisma";
import { extendedPrismaClient } from "./database/prisma";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: "PrismaService",
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
  ],
})
export class AppModule {}
