import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller(":projectName/event-timeline")
export class App2Controller {
  @Get(":storeId")
  getHello(@Param("projectName") p: string, @Param("storeId") storeId: string) {}
}
