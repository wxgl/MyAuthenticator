export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { data: accounts, error } = await readValidatedBody(event, (body) =>
    accountsSchema.safeParse(body)
  );
  if (error)
    throw createError({
      statusCode: 400,
      message: "Validation Failed !!",
    });
  await useDrizzle().insert(tables.accounts).values(accounts);
  return {
    status: 200,
    message: "Added successfully",
  };
});
