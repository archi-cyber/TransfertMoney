import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      country: "CAMEROON" | "CANADA";
      role: "USER" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    country: "CAMEROON" | "CANADA";
    role: "USER" | "ADMIN";
  }
}

export interface TransactionForm {
  amount: number;
  currency: "CAD" | "XAF";
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  paymentMethod: string;
}