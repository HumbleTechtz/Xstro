import { Command } from '../messaging/plugins.ts';

Command({
 name: 'add',
 fromMe: true,
 isGroup: true,
 desc: 'Add a participant to a group',
 type: 'group',
 function: async (message, match) => {
  const isAdmin = await message.isAdmin();
  const isBotAdmin = await message.isBotAdmin();

  if (!isAdmin && !isBotAdmin) {
   return message.send('_Requires admin and bot admin privileges_');
  }

  const user = message.user(match);
  if (!user) return message.send('_Provide a number_');

  if (!(await message.client.onWhatsApp(user))) {
   return message.send('_This number is invaild!_');
  }

  await message.client.groupParticipantsUpdate(message.jid, [user], 'add');
  return await message.send(
   `_@${user.split('@')[0]} has been added to the  Group_`,
  );
 },
});

Command({
 name: 'kick',
 fromMe: false,
 isGroup: true,
 desc: 'Ability to remove a participant from a Group',
 type: 'group',
 function: async (message, match) => {
  const isAdmin = await message.isAdmin();
  const isBotAdmin = await message.isBotAdmin();

  if (!isAdmin && !isBotAdmin) {
   return message.send('_Requires admin and bot admin privileges_');
  }

  const user = message.user(match);
  if (!user) return message.send('_Provide a number_');

  await message.client.groupParticipantsUpdate(message.jid, [user], 'remove');
  return await message.send(`_@${user.split('@')[0]} kicked from Group_`);
 },
});

Command({
 name: 'promote',
 fromMe: false,
 isGroup: true,
 desc: 'Ability to make a participant admin, if the bot is an Admin',
 type: 'group',
 function: async (message, match) => {
  const isAdmin = await message.isAdmin();
  const isBotAdmin = await message.isBotAdmin();

  if (!isAdmin && !isBotAdmin) {
   return message.send('_Requires admin and bot admin privileges_');
  }

  const user = message.user(match);
  if (!user) return message.send('_Provide a number_');

  const groupData = await message.client.groupMetadata(message.jid);
  const admins = groupData.participants
   .filter((v) => v.admin !== null)
   .map((v) => v.id);

  if (admins.includes(user)) {
   return await message.send(`_@${user.split('@')[0]} was already an admin_`);
  }

  await message.client.groupParticipantsUpdate(message.jid, [user], 'promote');
  return await message.send(`_@${user.split('@')[0]} is now an admin_`);
 },
});

Command({
 name: 'demote',
 fromMe: false,
 isGroup: true,
 desc: 'Ability to remove admin roles from a participant',
 type: 'group',
 function: async (message, match) => {
  const isAdmin = await message.isAdmin();
  const isBotAdmin = await message.isBotAdmin();

  if (!isAdmin || !isBotAdmin) {
   return message.send('_Requires admin and bot admin privileges_');
  }

  const user = message.user(match);
  if (!user) return message.send('_Provide a number_');

  const groupData = await message.client.groupMetadata(message.jid);
  const admins = groupData.participants
   .filter((v) => v.admin !== null)
   .map((v) => v.id);

  if (!admins.includes(user)) {
   return await message.send(`_@${user.split('@')[0]} is not an admin_`);
  }

  await message.client.groupParticipantsUpdate(message.jid, [user], 'demote');
  return await message.send(`_@${user.split('@')[0]} is no longer an admin_`);
 },
});

Command({
 name: 'newgc',
 fromMe: true,
 isGroup: false,
 desc: 'Create a new Group',
 type: 'group',
 function: async (message, match) => {
  if (!match) return message.send('_Provide a group name!_');

  const gc = await message.client.groupCreate(match, [message.owner]);
  const invite = await message.client.groupInviteCode(gc.id);
  const url = `https://chat.whatsapp.com/${invite}`;

  return await message.send(url, {
   contextInfo: {
    isForwarded: true,
    externalAdReply: {
     title: match,
     body: `Click here to join ${match}`,
     sourceUrl: url,
     showAdAttribution: true,
    },
   },
  });
 },
});

Command({
 name: 'tag',
 fromMe: false,
 isGroup: true,
 desc: 'Mention an entire Group',
 type: 'group',
 function: async (message, match) => {
  if (!(await message.isAdmin())) return message.send('_For Admins only!_');
  if (!(await message.isBotAdmin()))
   return message.send('_I to be an need admin!_');

  const { participants } = await message.client.groupMetadata(message.jid);
  if (!participants?.length) return message.send('No participants');

  return message.client.relayMessage(
   message.jid,
   {
    extendedTextMessage: {
     text: `@${message.jid} ${match ?? ''}`,
     contextInfo: {
      mentionedJid: participants.filter((p) => p.id).map((p) => p.id),
      groupMentions: [{ groupJid: message.jid, groupSubject: 'everyone' }],
     },
    },
   },
   {},
  );
 },
});
