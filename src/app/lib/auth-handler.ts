import { graphql, HttpResponse, delay } from "msw";
import {
  LoginMutation,
  LoginMutationVariables,
} from "@/graphql/generated/graphql";
import { useUserStore } from "@/app/lib/stores";

export interface UserPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export const SECRET_KEY = "JWT_SECRET_KEY";

export const generateToken = (user: UserPayload): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })
  );
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
};

export const authHandlers = [
  graphql.mutation<LoginMutation, LoginMutationVariables>(
    "Login",
    async ({ variables }) => {
      try {
        await delay(800);
        if (!variables?.input) {
          return HttpResponse.json(
            { errors: [{ message: "Login input is required" }] },
            { status: 400 }
          );
        }

        const { email, password } = variables.input;
        const { getUsers } = useUserStore.getState();
        const allUsers = getUsers();

        // Find user by email - note: in real app, passwords would be hashed
        const user = allUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          return HttpResponse.json(
            { errors: [{ message: "Invalid email or password" }] },
            { status: 401 }
          );
        }

        // Check if user is active
        if (user.status !== "active") {
          return HttpResponse.json(
            { errors: [{ message: "Account is not active" }] },
            { status: 403 }
          );
        }

        // Generate JWT token
        const token = generateToken({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? "",
        });

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        return HttpResponse.json({
          data: {
            login: {
              token,
              user: userWithoutPassword,
            },
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        return HttpResponse.json(
          { errors: [{ message: "Internal server error during login" }] },
          { status: 500 }
        );
      }
    }
  ),

  // Register mutation handler
  graphql.mutation("Register", async ({ variables }) => {
    try {
      await delay(1000);

      if (!variables?.input) {
        return HttpResponse.json(
          { errors: [{ message: "Registration input is required" }] },
          { status: 400 }
        );
      }

      const { name, email, password, phone, country, role } = variables.input;
      const { getUsers, addUser } = useUserStore.getState();
      const allUsers = getUsers();

      // Check if user already exists
      if (allUsers.some((u) => u.email === email)) {
        return HttpResponse.json(
          { errors: [{ message: "User with this email already exists" }] },
          { status: 409 }
        );
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        name,
        email,
        password, // Note: In real app, this would be hashed
        phone,
        country,
        role: role ?? "user",
        status: "active",
        registrationDate: new Date().toISOString(),
      };

      addUser(newUser);

      // Generate JWT token
      const token = generateToken(newUser);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = newUser;

      return HttpResponse.json({
        data: {
          register: {
            token,
            user: userWithoutPassword,
          },
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return HttpResponse.json(
        { errors: [{ message: "Internal server error during registration" }] },
        { status: 500 }
      );
    }
  }),
];
