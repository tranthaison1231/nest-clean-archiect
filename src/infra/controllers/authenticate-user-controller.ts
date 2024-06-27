import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipe";
import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { CustomPrismaService } from "nestjs-prisma";
import { z } from "zod";
import { ExtendedPrismaClient } from "../database/prisma";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    @Inject("PrismaService")
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { email, password } = body;

    const user = await this.prismaService.client.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordValid = await compare(password, user!.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException("User credentials do not match");
    }

    const token = this.jwt.sign({ sub: user.id });
    return { token };
  }
}
