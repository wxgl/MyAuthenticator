export default eventHandler(async (event) => {
  const { data, error } = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );
  if (error)
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Failed !!",
      message: error.message,
    });
  const runtimeConfig = useRuntimeConfig(event);
  if (
    data.username !== runtimeConfig.AUTH_USERNAME ||
    data.password !== runtimeConfig.AUTH_PASSWORD
  ) {
    throw createError({
      statusCode: 401,
      message: "Invalid Credentials",
    });
  }
  await setUserSession(event, { user: "ADMIN" });
  return {
    status: 200,
    message: "Login Successful",
  };
});
