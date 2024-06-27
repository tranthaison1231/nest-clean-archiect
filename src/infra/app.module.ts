import { envSchema } from "@/infra/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HttpModule,
	],
})
export class AppModule {}
