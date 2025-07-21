export default {
	meta: {
		lang: "en",
		botname: "Xstro",
		desc: "Simple WhatsApp Bot",
	},
	warn: { invaild_user: "_provide user number_" },
	reply_msg: "_reply a message_",
	reply_image: "_reply an image_",
	db_initialized: "Database Synced",
	bot_not_admin: "_i am not an admin of this group!_",
	sender_not_admin: "_you are not a group admin!_",
	cmd_not_exists: "_This command does not exist_",
	group_muted: "_group is now muted_",
	group_unmuted: "_group is now unmuted_",
	update: {
		uptodate: "Latest: true",
		outofdate: "Please update to Latest Version",
	},
	plugin: {
		anticall: {
			already_off: "_AntiCall is already turned off._",
			set_off: "_AntiCall has been turned off._",
			already_set_warn: "_AntiCall is already on with warn action._",
			set_warn: "_AntiCall has been turned on and set to warn caller._",
		},
		antidel: {
			enabled: "_Antidelete enabled._",
			already_enabled: "_Antidelete is already enabled._",
			disabled: "_Antidelete disabled._",
			already_disabled: "_Antidelete already disabled_",
		},
		antilink: {
			enabled: "_Antilink turned on_",
			disabled: "_Antilink turned off_",
			need_links: "_You need to add some specific links to prohibit_",
			link_warning: "_Links are not allowed here_",
		},
		antiword: {
			enabled: "_Antiword filter has been enabled._",
			disabled: "_Antiword filter has been disabled._",
			none: "_No blocked words are set._",
			invalid: "_No valid words detected._",
			invalid_command: '_❓ Invalid command. Use "on", "off", "get", or "set"._',
		},
		automute: {
			amute_usage: "Usage: amute 5:30pm",
			aunmute_usage: "Usage: aunmute 6:30am",
			invalid_format: "Invalid time format. Use format like `5:30pm` or `7:00am`.",
			deleted: "_Automute setting deleted for this group._",
			not_found: "_No automute setting found for this group._",
		},
		event: {
			enabled: "_Group event mode enabled_",
			disabled: "_Group event mode disabled_",
			usage: "_Usage: event <on|off>_",
		},
		goodbye: {
			none: "_No goodbye message set._",
			removed: "_Goodbye message removed._",
			no_content: "```Provide the goodbye message after setting on.```",
			set: "_Goodbye message set._",
		},
		welcome: {
			none: "_No welcome message set._",
			removed: "_Welcome message removed._",
			no_content: "```Provide the welcome message after on.```",
			set: "_Welcome message set._",
		},
		groups: {
			add: {
				success: "_participant add to group_",
				fail: "_failed to add participant, pls add manually_",
			},
			kick: {
				success: "_participant kicked from group_",
				fail: "_failed to kick participant_",
			},
			kickall: {
				success: "_all non-admin participants removed from group_",
			},
			newgc: {
				no_name: "_no name was provided_",
			},
			gpp: {
				no_image: "_reply an image_",
				success: "_group photo updated_",
			},
			rgpp: {
				success: "_group photo removed_",
			},
			gname: {
				no_name: "_provide new group name_",
				success: "_group name updated_",
			},
			gdesc: {
				no_desc: "_provide new group description_",
				success: "_group description updated_",
			},
			mute: {
				already_muted: "_group already muted_",
				success: "_group muted, only admins can send messages_",
			},
			unmute: {
				already_unmuted: "_group already unmuted_",
				success: "_group unmuted, all members can send messages_",
			},
			lock: {
				already_locked: "_group settings already restricted_",
				success: "_group settings restricted to admins_",
			},
			unlock: {
				already_unlocked: "_group settings already unrestricted_",
				success: "_group settings unrestricted_",
			},
			approval: {
				on: "_approval mode on_",
				off: "_approval mode off_",
			},
			poll: {
				no_question: "_provide a question and options_",
				min_options: "_add at least 2 options_",
			},
			requests: {
				none: "_no join requests found_",
			},
		},
		chats: {
			clear: {
				success: "_chat cleared_",
			},
			archive: {
				success: "_chat archived_",
			},
			unarchive: {
				success: "_chat unarchived_",
			},
			star: {
				success: "_message starred_",
			},
			unstar: {
				success: "_message unstarred_",
			},
		},
		settings: {
			prefix: {
				tutorial: "_prefix can be set: setprefix ._",
			},
		},
		contact: {
			tutorial: "_save a contact like this: scontact Astro|123456789_",
		},
		sticker: {
			not_replied: "_reply a sticker_",
			no_name_chose: "_provide a command name as sticker_",
			remove_option_null: "_provide a command name, eg ping_",
			cmd_not_used: "_that command wasn't used for sticker_",
		},
		ban: {
			already: "_user already banned from using commands_",
			user_banned: "_user is now banned from using commands_",
			not_banned: "_user was not banned before_",
			user_unbanned: "_ban lifted, you can now use bot commands_",
			none: "_no users where banned from using cmds_",
		},
		block: {
			blocked: "_blocked!_",
			unblocked: "_unblocked!_",
		},
		pp: {
			success: "_profile photo updated_",
		},
		forward: {
			success: "_message forwarded_",
			no_message: "_no message quoted to forward_",
			invalid_user: "_provide a valid user number_",
		},
		edit: {
			success: "_message edited_",
			not_own_message: "_you can only edit your own messages_",
		},
		save: {
			success: "_done!_",
		},
	},
};
