import { Publisher, Subjects, TicketCreatedEvent } from "@stagefirelabs/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
