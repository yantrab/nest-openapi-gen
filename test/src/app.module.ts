import { Module } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
