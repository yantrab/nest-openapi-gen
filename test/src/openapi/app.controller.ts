import { Body, Controller, Get, Post, Query, Param } from "@nestjs/common";
class SomeClass {
  a: number;
  b?: string;
}
class SomeOtherClass extends SomeClass {}

interface SomeInterface {
  a: number;
  b?: string;
}

interface SomeOtherInterface extends SomeInterface {}

/**
 * Controller description
 * this is second line
 */
@Controller()
export class AppController {
  @Get("response-promise")
  getHello3(): Promise<string[]> {
    return new Promise<string[]>((resolve) => resolve["a"]);
  }

  @Get("response-array-of-string")
  getHello2() {
    return ["a"];
  }

  @Get("response-string")
  getHello(): string {
    return "";
  }

  @Get("response-object1")
  responseObject1(): { a: string; b?: number } {
    return { a: "a" };
  }

  @Get("response-object2")
  responseObject2() {
    return { a: "a" };
  }

  @Get("response-class")
  responseClass(): SomeClass {
    return { a: 1 };
  }

  @Get("response-interface")
  responseInterface(): SomeInterface {
    return { a: 1 };
  }

  @Post("body-string")
  bodyString(@Body() a: string) {}

  @Post("body-object")
  bodyObject(@Body() a: { b: number }) {}

  @Post("body-class")
  bodyClass(@Body() a: SomeOtherClass) {}

  @Post("body-interface")
  bodyInterface(@Body() a: SomeOtherInterface) {}

  @Post("body-object-path")
  bodyObjectPath(@Body("a") a: string, @Body("b") b?: number) {}

  @Post("query-object")
  queryObject(@Query() a: { b: number }) {}

  @Post("query-class")
  queryClass(@Query() a: SomeOtherClass) {}

  @Post("query-interface")
  queryInterface(@Query() a: SomeOtherInterface) {}

  @Post("query-object-path")
  queryObjectPath(@Query("a") a: string, @Query("b") b?: number) {}

  @Get(":p/optional-params/:id?/:timestamp?")
  optionalPathParams(@Param("p") p: string, @Param("id") id?: number, @Param("timestamp") timestamp?: number) {}
}
