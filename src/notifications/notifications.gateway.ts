import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class NotificationsGateway {
  @SubscribeMessage('notifications')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
