
var http = require('http');
var wa = require('whatstrackerapp');
var fs = require('fs');
var fb = require('myfirebaseapp');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  testapp().catch((err) => console.log(`encountered error: ${err}`));
  res.end('Hello World11111!');
}).listen(8081);

const testapp= async function test() {
  //MyFireBase.GetName();
  let db = await fb.connectFireStore();
  const client = new wa.WAClient() // instantiate
  client.autoReconnect = true // auto reconnect on disconnect
  client.logLevel = wa.MessageLogLevel.none // set to unhandled to see what kind of stuff you can implement

  // connect or timeout in 20 seconds (loads the auth file credentials if present)
  const [user, chats, contacts, unread] = await client.connect('./auth_info.json', 20 * 1000)

  console.log('oh hello ' + user.name + ' (' + user.id + ')')
  console.log('you have ' + unread.length + ' unread messages')
  console.log('you have ' + chats.length + ' chats & ' + contacts.length + ' contacts')

  const authInfo = client.base64EncodedAuthInfo() // get all the auth info we need to restore this session
  fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file

  client.setOnPresenceUpdate(json => {
    console.log(JSON.stringify(json));
    fb.saveTracker(db,json.id,json.type)
  }
  )
  await client.requestPresenceUpdate("919930869930@s.whatsapp.net")

  client.setOnUnexpectedDisconnect(err => console.log('disconnected unexpectedly: ' + err))
}

//test().catch((err) => console.log(`encountered error: ${err}`))
