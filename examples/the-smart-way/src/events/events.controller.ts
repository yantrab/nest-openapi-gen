import { Controller, Get, Param, Query } from "@nestjs/common";

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
  getEvents(@Param("locationId") locationId: number,
            @Query("ids") ids?: number[],
            @Query("type") type?: EventType): Promise<Event[]> {
    return new Promise(resolve => resolve([]));
  }
}
