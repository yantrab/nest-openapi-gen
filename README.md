# nest-openapi-gen
Generate openapi document from nest controller

## Problem 😕

You already defined your controllers with typescript, and you don't want to write it again in the open API document, or add @ApiProperty() decorator anywhere

## Solution 😄

This package can generate the openapi document without adding any code or decorators.
## Usage

#### Install
```npm i -D nest-openapi-gen```

#### Generate
```typescript
import { generate } from 'nest-openapi-gen';
generate({ prefix:'/api' });
```
This will generate openapi.schema.json file in the root folder.

#### Options
- prefix - global prefix
- filePath - The path to the generated file
- tsConfigFilePath - tsconfig.json file path. default - [root].tsconfig.json

### Decorators

#### Validation decorators
- Min
- Max
- Pattern
- Date
- Time
- DateTime
- Duration
- Uri
- UriReference
- UriTemplate
- Email
- Hostname
- Ipv4
- Ipv6
- Regex
- Uuid
- JsonPointer
- RelativeJsonPointer
- NumberString
examples
```typescript
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
```

#### Schema decorator
you can set openapi schema by using Schema decorator.
```typescript
  @Post("schema/:mail")
  schema(
    @Param("mail") @Schema({ description: "User email" }) @Email mail: string,
    @Query() @Schema({ properties: { someInt: { type: "integer" } } }) query: SomeInterfaceWithInt
  ) {}
```
## Big advantage
Now that we have openapi doc, we can use [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator) instead of class-validator.
This ugly code:
```typescript
export class GetEventsTimelineParams {
  // eslint-disable-next-line no-restricted-syntax
  @IsString() projectName!: string;
  // eslint-disable-next-line no-restricted-syntax
  @IsNumber() storeId!: number;
}

export class GetEventsTimelineQuery {
  // eslint-disable-next-line no-restricted-syntax
  @IsString() uuid!: string;
  // eslint-disable-next-line no-restricted-syntax
  @IsNumber() startTime!: number;
  @IsNumber() @IsOptional() endTime?: number;
}
@Controller(':projectName/event-timeline')
export class EventTimelineController {
  @Get(":storeId")
  getEventTimeline(@Param() params: GetEventsTimelineParams,
                   @Query() query: GetEventsTimelineQuery): Promise<ActivityTimeline[]> {
  }
}
```

Became to :
```typescript
export interface GetEventsTimelineQuery {
  uuid: string;
  startTime: number;
  endTime?: number;
}

@Controller(':projectName/event-timeline')
export class EventTimelineController {
  @Get(":storeId")
  getEventTimeline(@Param('projectName') projectName: string,
                   @Param('storeId') storeId: number,
                   @Query() query: GetEventsTimelineQuery): Promise<ActivityTimeline[]> {
  }
}
```

## TODO
- ci/cd
- cli commands
- Multiple responses
- support files in response and request body

## Dependencies
- [ts-morph](https://www.npmjs.com/package/ts-morph) - TypeScript Compiler API wrapper to parse your types to openapi schemas.

