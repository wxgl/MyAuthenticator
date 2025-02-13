export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const query = getQuery(event);
  const { data: account, error } = await readValidatedBody(event, (body) =>
    accountEditSchema.safeParse(body)
  );
  if (error || !query.id)
    throw createError({
      statusCode: 400,
      message: "Validation Failed !!",
    });
  await useDrizzle()
    .update(tables.accounts)
    .set(account)
    .where(eq(tables.accounts.id, Number(query.id)));
  return {
    status: 200,
    message: "Updated successfully",
  };
});
