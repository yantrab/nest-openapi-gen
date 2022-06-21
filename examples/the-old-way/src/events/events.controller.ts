import { Controller, Get, Param, Query } from "@nestjs/common";
import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
class Event {
  @ApiProperty() timestamp: number;
  @ApiProperty() type: EventType;
  @ApiProperty() locationId: number;
  @ApiProperty() id: number;
}

enum EventType {
  SYSTEM = "system",
  USER = "user",
}

class GetEventsPathParams {
  @ApiProperty({ required: true }) @IsNumber() locationId: number;
}

class GetEventsQueryParams {
  @ApiProperty({ required: false, type: ["number"] }) @IsArray() @IsOptional() ids?: number[];
  @ApiProperty({ required: false, type: EventType }) @IsEnum(EventType) @IsOptional() type?: EventType;
}

@Controller("events")
export class EventsController {
  @Get(":locationId")
  @ApiResponse({ type: [Event] })
  getEvents(@Param() params: GetEventsPathParams, @Query() query: GetEventsQueryParams): Promise<Event[]> {
    return new Promise((res) => res([]));
  }
}
