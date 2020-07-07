import {
  WAClient,
  getNotificationType,
  MessageType,
  decodeMediaMessage,
  Presence,
  MessageOptions,
  Mimetype,
  WALocationMessage,
  MessageLogLevel,
  
} from 'whatstrackerapp'
import * as fs from 'fs'

async function test() {
  //MyFireBase.GetName();
  const client = new WAClient() // instantiate
  client.autoReconnect = true // auto reconnect on disconnect
  client.logLevel = MessageLogLevel.none // set to unhandled to see what kind of stuff you can implement

  // connect or timeout in 20 seconds (loads the auth file credentials if present)
  const [user, chats, contacts, unread] = await client.connect('./auth_info.json', 20 * 1000)

  console.log('oh hello ' + user.name + ' (' + user.id + ')')
  console.log('you have ' + unread.length + ' unread messages')
  console.log('you have ' + chats.length + ' chats & ' + contacts.length + ' contacts')

  const authInfo = client.base64EncodedAuthInfo() // get all the auth info we need to restore this session
  fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
  client.setOnUnexpectedDisconnect(err => console.log('disconnected unexpectedly: ' + err))
}

test().catch((err) => console.log(`encountered error: ${err}`))
