import { DisconnectReason, jidNormalizedUser } from "baileys";
import { syncPlugins } from "../plugin.js";
import { setSudo } from "../../models/index.js";
import { auth, sendPayloadBootMsg } from "../../utils/index.js";
export default class Connection {
    client;
    events;
    constructor(client, events) {
        this.client = client;
        this.events = events;
        this.handleConnectionUpdate();
    }
    async handleConnectionUpdate() {
        const { connection, lastDisconnect } = this.events;
        switch (connection) {
            case "connecting":
                await this.handleConnecting();
                break;
            case "close":
                await this.handleClose(lastDisconnect);
                break;
            case "open":
                await this.handleOpen();
                break;
        }
    }
    async handleConnecting() {
        console.info("Connecting to WhatsApp...");
        await syncPlugins("../plugins", [".ts"]);
        console.info("Plugins Synced");
    }
    async handleClose(lastDisconnect) {
        const error = lastDisconnect?.error;
        const reason = error?.output?.statusCode;
        /** List of disconnect reasons that warrant a safe exit */
        const resetReasons = [
            DisconnectReason.connectionClosed,
            DisconnectReason.connectionLost,
            DisconnectReason.timedOut,
            DisconnectReason.connectionReplaced,
        ];
        const resetWithClearStateReasons = [
            DisconnectReason.loggedOut,
            DisconnectReason.badSession,
        ];
        if (resetReasons.includes(reason)) {
            console.warn(`Disconnected: ${reason} — resetting`);
            process.exit(0);
        }
        else if (resetWithClearStateReasons.includes(reason)) {
            console.warn(`Critical error: ${reason} — clearing state and exiting`);
            /** Clean up memory */
            this.client.ev.flush(true);
            /** Close the websocket */
            await this.client.ws.close();
            /** Clear the authenication state */
            await auth.truncate();
            console.log("Cleared auth state");
            process.exit(1);
        }
        else if (reason === DisconnectReason.restartRequired) {
            console.info("Restart required — exiting to allow restart");
            process.exit(0);
        }
        else {
            console.error("Unexpected disconnect reason:", reason);
            try {
                await auth.truncate();
                console.log("Cleared auth state");
            }
            catch (e) {
                console.error("Failed to clear auth state:", e);
            }
            console.log("Please re-pair again");
            process.exit(1);
        }
    }
    async handleOpen() {
        console.info("Connected to WhatsApp");
        await sendPayloadBootMsg(this.client);
        await setSudo([
            jidNormalizedUser(this.client?.user?.id),
            jidNormalizedUser(this.client?.user?.lid),
        ]);
    }
}
