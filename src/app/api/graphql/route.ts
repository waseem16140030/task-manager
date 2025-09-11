import { NextResponse } from "next/server";
import {
  verifyUserCredentials,
  createUser,
  findUserByEmail,
  generateJWT,
  getUsersList,
  deleteUser,
  editUserById,
} from "@/app/lib";
import {
  DeleteUserMutationVariables,
  EditUserMutationVariables,
  GetUsersQueryVariables,
  LoginInput,
  RegisterInput,
  User,
} from "@/graphql/generated/graphql";

type GraphQLRequestBody<TVariables = Record<string, unknown>> = {
  query: string;
  variables?: TVariables;
  operationName?: string;
};

export async function POST(req: Request) {
  try {
    let body: GraphQLRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { errors: [{ message: "Invalid or missing JSON body" }] },
        { status: 400 }
      );
    }

    const { query, variables } = body ?? {};

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: "Query is required" }] },
        { status: 400 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: "Query is required" }] },
        { status: 400 }
      );
    }

    //Login Mutation
    if (query.includes("Login")) {
      const payload = variables as LoginInput;
      const { email, password } = payload;

      const user = await verifyUserCredentials(email, password);
      if (!user) {
        return NextResponse.json(
          { errors: [{ message: "Invalid email or password" }] },
          { status: 401 }
        );
      }
      if (user.status !== "active") {
        return NextResponse.json(
          { errors: [{ message: "Account is not active" }] },
          { status: 403 }
        );
      }

      const token = generateJWT(user);
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        data: { login: { token, user: userWithoutPassword } },
      });
    }

    //Register Mutation
    if (query.includes("Register") || query.includes("CreateUser")) {
      const payload = variables as RegisterInput;
      if (!payload?.email) {
        return NextResponse.json(
          { errors: [{ message: "Missing input.email" }] },
          { status: 400 }
        );
      }

      const existingUser = await findUserByEmail(payload.email);
      if (existingUser) {
        return NextResponse.json(
          { errors: [{ message: "User with this email already exists" }] },
          { status: 409 }
        );
      }

      const newUser = await createUser({
        id: Date.now().toString(),
        ...payload,
      });
      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({ data: { register: userWithoutPassword } });
    }

    //GetUsersList Query
    if (query.includes("GetUsers") ?? query.includes("users")) {
      const payload = variables as GetUsersQueryVariables;
      const usersResponse = await getUsersList(payload);
      return NextResponse.json({ data: { users: usersResponse } });
    }

    //Delete User Mutation
    if (query.includes("DeleteUser")) {
      const payload = variables as DeleteUserMutationVariables;
      const deleteUserResponse = await deleteUser(payload.id);
      return NextResponse.json({ data: deleteUserResponse });
    }

    //Edit User Mutation
    if (query.includes("EditUser")) {
      const payload = variables as EditUserMutationVariables;
      console.log(payload, 'Payload')
      const { id, input } = payload ?? {};
      const editUserResponse = await editUserById(id, {
        ...(input as User),
      });
      return NextResponse.json({ data: { editUser: editUserResponse } });
    }

    return NextResponse.json(
      { errors: [{ message: "Unknown query operation" }] },
      { status: 400 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { errors: [{ message: "Internal server error" }] },
      { status: 500 }
    );
  }
}
