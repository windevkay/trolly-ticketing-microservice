import { Message } from "node-nats-streaming";

import { Subjects, Listener, OrderCancelledEvent } from "@stagefirelabs/common";

import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./constants";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdated.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket } = data;
    const foundTicket = await Ticket.findById(ticket.id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    foundTicket.set({ orderId: undefined });
    await foundTicket.save();
    // after any change to a Ticket, we need to publish an event to ensure other refs to that ticket update their versions
    const { price, title, userId, orderId, version, id } = foundTicket;
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    });
    msg.ack();
  }
}
