// this subscribes to user crud action and add new cart on insert

import {
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "./User";
import { Cart } from "./Cart";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }
  async beforeInsert(event: InsertEvent<User>): Promise<any> {
    const cart:Cart = new Cart;
    await event.manager.getRepository(Cart).save(cart);
    event.entity.cart =  cart;
  }
}
