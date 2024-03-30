import { EmitsEvent, Event } from '@libs/nestjs-events';

@Event('USER_SIGNED_UP')
export class UserSignedUp extends EmitsEvent {}
