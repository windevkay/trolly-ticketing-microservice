import { Message } from "node-nats-streaming";

import { Subjects, Listener, OrderCreatedEvent } from "@stagefirelabs/common";

import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./constants";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdated.publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;
    const foundTicket = await Ticket.findById(ticket.id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    foundTicket.set({ orderId: id });
    await foundTicket.save();
    // after any change to a Ticket, we need to publish an event to ensure other refs to that ticket update their versions
    const { price, title, userId, orderId, version } = foundTicket;
    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      price,
      title,
      userId,
      orderId,
      version,
    });
    msg.ack();
  }
}
