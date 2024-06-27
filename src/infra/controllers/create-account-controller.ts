import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipe";
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Inject,
  Post,
  UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { CustomPrismaService } from "nestjs-prisma";
import { z } from "zod";
import { ExtendedPrismaClient } from "../database/prisma";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(
    @Inject("PrismaService")
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const userWithEmailAlreadyExists =
      await this.prismaService.client.user.findUnique({
        where: {
          email,
        },
      });

    if (userWithEmailAlreadyExists) {
      throw new ConflictException("User already exists.");
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.client.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      name,
      email,
    };
  }
}
