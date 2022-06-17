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

## TODO
- Play with @nestjs/swagger to add custom schemas.
- Multiple responses
- Optional path params
- Explicit method parameter validations
- Explicit class properties validations
- support files in response and request body

## Dependencies
- [ts-morph](https://www.npmjs.com/package/ts-morph) - TypeScript Compiler API wrapper to parse your types to openapi schemas.

