export const handlePresenceUpdate = async ({
  id,
  presences,
}: {
  id: string;
  presences: { [key: string]: { lastKnownPresence: string } };
}) => {};