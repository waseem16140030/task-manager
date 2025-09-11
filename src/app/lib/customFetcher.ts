export const customFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  return async () => {
    const endPoint = process.env.NEXT_PUBLIC_API_URL!;

    const res = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] ?? {};
      throw new Error(message ?? "Error…");
    }

    return json.data;
  };
};
