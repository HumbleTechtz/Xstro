import { serialize } from "../serialize.js";
import handlers from "../handlers.js";
import { saveMsg } from "../../models/messages.js";
export default class MessageUpsert {
    client;
    data;
    constructor(client, upserts) {
        this.client = client;
        this.data = upserts;
    }
    async create() {
        const msg = this.data.messages[0];
        const cloned = structuredClone(JSON.parse(JSON.stringify(msg)));
        const serialized = await serialize(this.client, cloned);
        await Promise.all([handlers(serialized), saveMsg(serialized)]);
    }
}
