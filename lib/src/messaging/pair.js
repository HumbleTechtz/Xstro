import config from "../../config.mjs";
export async function pairClient(sock) {
    if (!sock.authState?.creds?.registered) {
        const phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, "") ?? "";
        if (phoneNumber.length < 11) {
            console.error("Please input a valid number");
            process.exit(1);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Pairing Code: ${await sock.requestPairingCode(phoneNumber)}`);
        await new Promise(resolve => {
            const isRegistered = setInterval(() => {
                if (sock.authState?.creds?.registered) {
                    clearInterval(isRegistered);
                    resolve();
                }
            }, 1000);
        });
    }
}
