import { Body, Controller, Get, Header, Param, Post, Query } from "@nestjs/common";
import { Email, Max, Min, Uuid } from "../../../src/decorators";

class FormatClass {
  @Uuid uuid: string;
}

class MinMaxClass {
  @Min(1) from: number;
  @Max(5) to: number;

  @Min(1) array: string[];

  @Min(1) object: { a: number };
}

@Controller("")
export class App3Controller {
  @Post("format/:mail")
  format(@Param("mail") @Email mail: string, @Query() query: FormatClass, @Body() body: FormatClass) {}

  @Post("minmax/:mail")
  minmax(@Param("mail") @Min(5) @Email mail: string, @Query() query: MinMaxClass, @Body() body: MinMaxClass) {}
}
