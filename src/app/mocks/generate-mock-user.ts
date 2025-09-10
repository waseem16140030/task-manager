import { User } from "@/graphql/generated/graphql";
export function generateMockUsers(): User[] {
  return [{
    id: 'waseem6140030',
    name: 'Muhammad Waseem',
    password:'admin@6Well',
    email: 'waseem16140030@gmail.com',
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    country: "Pakistan",
    role: "admin",
    status: "active",
    registrationDate: new Date(
      Date.now() - Math.random() * 31536000000
    ).toISOString(),
  }]
}
