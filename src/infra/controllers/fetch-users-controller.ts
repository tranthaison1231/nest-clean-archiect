import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipe";
import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { z } from "zod";
import { ExtendedPrismaClient } from "../database/prisma";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/users")
export class FetchUsersController {
  constructor(
    @Inject("PrismaService")
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const users = await this.prismaService.client.$kysely
      .selectFrom(["users"])
      .selectAll()
      .orderBy("id", "desc")
      .offset((page - 1) * 20)
      .execute();

    return { users };
  }
}
