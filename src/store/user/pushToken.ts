import { makeVar } from "@apollo/client";

export const pushTokenVar = makeVar<string | null>(null);

export const setPushToken = (token: string) => {
  pushTokenVar(token);
}