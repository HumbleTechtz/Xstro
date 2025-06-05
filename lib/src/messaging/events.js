import ConnectionUpdate from "./Controllers/Connection.js";
import MessageHistory from "./Controllers/MessageHistory.js";
import MessageUpsert from "./Controllers/MessageUpsert.js";
export default function (clientSocket, { saveCreds }) {
    clientSocket.ev.process(async (events) => {
        if (events["creds.update"]) {
            await saveCreds();
        }
        if (events["connection.update"]) {
            new ConnectionUpdate(clientSocket, events["connection.update"]);
        }
        if (events["messages.upsert"]) {
            await new MessageUpsert(clientSocket, events["messages.upsert"]).create();
        }
        if (events["messaging-history.set"]) {
            await new MessageHistory(events["messaging-history.set"]).create();
        }
    });
}
