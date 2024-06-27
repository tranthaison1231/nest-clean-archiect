import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayloadSchema } from '@/infra/auth/jwt-strategy';
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayloadSchema,
  ) {
    const { title, content } = body;
    const userId = user.sub;
    
    await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });
  }
}
