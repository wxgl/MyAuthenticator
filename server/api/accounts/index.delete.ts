export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const query = getQuery(event);
  if (!query.id)
    throw createError({ statusCode: 400, message: "Validation Failed !!" });
  const account = await useDrizzle()
    .delete(tables.accounts)
    .where(and(eq(tables.accounts.id, Number(query.id))));
  return {
    status: 200,
    message: "Deleted successfully",
  };
});
