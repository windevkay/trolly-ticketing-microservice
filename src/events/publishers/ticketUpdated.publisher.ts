import { Publisher, Subjects, TicketUpdatedEvent } from "@stagefirelabs/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
