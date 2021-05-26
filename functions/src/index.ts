import * as admin from 'firebase-admin';
admin.initializeApp();

export { teamsMeetingRoomCreateMember } from './meeting/room/createMember';
export { teamsMeetingRoomDeleteMember } from './meeting/room/deleteMember';
