import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate-user-controller";
import { CreateAccountController } from "./controllers/create-account-controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DatabaseModule } from "./database/database.module";
import { FetchUsersController } from "./controllers/fetch-users-controller";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchUsersController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
