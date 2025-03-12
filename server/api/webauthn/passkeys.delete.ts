export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const query = getQuery(event);
  if (!query.id)
    throw createError({ statusCode: 400, message: "Validation Failed !!" });
  const passkey = await useDrizzle()
    .delete(tables.credentials)
    .where(and(eq(tables.credentials.id, String(query.id))));
  return {
    status: 200,
    message: "Deleted successfully",
  };
});
