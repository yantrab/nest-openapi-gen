import { Controller, Get, Param, Query } from "@nestjs/common";
import { Min, Uuid } from "nest-openapi-gen/decorators";
interface Event {
  timestamp: number;
  type: EventType;
  locationId: number;
  id: number;
}

enum EventType {
  SYSTEM = "system",
  USER = "user",
}

@Controller("events")
export class EventsController {
  @Get(":locationId")
  getEvents(
    @Param("locationId") @Min(100) locationId: number,
    @Query("ids") @Min(2) ids?: number[],
    @Query("type") type?: EventType
  ): Promise<Event[]> {
    return new Promise((resolve) => resolve([]));
  }
}
