export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const accounts = await useDrizzle().select().from(tables.accounts).all();
  return accounts;
});
