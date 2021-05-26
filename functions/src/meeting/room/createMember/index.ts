'use strict'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as v from './v'

const adminDatabase = admin.database()

export const teamsMeetingRoomCreateMember = functions.database.ref([
  '{env}/teams',
  'meetings/{meetingId}',
  'rooms/{roomId}',
  '_broadcast_/{broadcastId}',
].join('/'))
.onCreate(async (snapshot, context) => {
  const { env } = context.params
  const databaseRootFunctionV: any = await new Promise((resolve) => {
    // tslint:disable-next-line: no-floating-promises
    adminDatabase.ref([
      `${env}/teams`,
      'FUNCTION_V'
    ].join('/')).once("value", (functionSnapshot: any) => {
      resolve(functionSnapshot.val())
    })
  })

  const functionVersion = databaseRootFunctionV?.teamsMeetingRoomCreateMember || 'unknown'
  if (!databaseRootFunctionV?.teamsMeetingRoomCreateMember) {
    throw new Error (`There is no vertion : ${functionVersion}`)
  }

  const version: any = v
  const selectedFunction: (
    snapshot: functions.database.DataSnapshot,
    context: functions.EventContext
  ) => Promise<void> = version[functionVersion]
  await selectedFunction(snapshot, context)
})
