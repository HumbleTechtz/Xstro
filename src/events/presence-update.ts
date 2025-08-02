export const PresenceUpdate = async ({
  id,
  presences,
}: {
  id: string;
  presences: { [key: string]: { lastKnownPresence: string } };
}) => {};
