export const customFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  return async () => {
    const endPoint =
      process.env.NODE_ENV === "production"
        ? "https://task-manager-rouge-seven.vercel.app/graphql"
        : "http://localhost:3000/api/graphql";
    const res = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      throw new Error(message ?? "Error…");
    }

    return json.data;
  };
};
