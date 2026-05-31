import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: "dental-booking-api",
      status: "ok"
    };
  }
}
