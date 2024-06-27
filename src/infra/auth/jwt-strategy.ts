import { Env } from "@/infra/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const UserPayloadSchema = z.object({
	sub: z.string().uuid(),
});

export type UserPayloadSchema = z.infer<typeof UserPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService<Env, true>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
		});
	}

	async validate(payload: UserPayloadSchema) {
		return UserPayloadSchema.parse(payload);
	}
}
