export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const passkeys = await useDrizzle()
    .select({
      id: tables.credentials.id,
      displayName: tables.credentials.displayName,
      createdAt: tables.credentials.createdAt,
    })
    .from(tables.credentials)
    .all();
  return passkeys;
});
