# nest-openapi-gen
Generate openapi document from nest controller

## Problem 😕

You are already define your controllers with typescript, and you don't want to write it again in the openapi document, or add @ApiProperty() decorator anywhere

## Solution 😄

This package can generate the openapi document without add any code or decorators.
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

## Big advantage
Now that we have openapi doc, we can use [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator) instead of class validator.
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
- Play with @nestjs/swagger to add custom schemas.
- Multiple responses
- Explicit method parameter validations
- Explicit class properties validations
- support files in response and request body

## Dependencies
- [ts-morph](https://www.npmjs.com/package/ts-morph) - TypeScript Compiler API wrapper to parse your types to openapi schemas.

