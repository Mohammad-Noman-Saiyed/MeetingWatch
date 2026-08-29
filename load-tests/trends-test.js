import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

export function setup() {
  const signinRes = http.post(
    "http://localhost:4000/api/auth/signin",
    JSON.stringify({ email: "test2@example.com", password: "testpass13" }),
    { headers: { "Content-Type": "application/json" } },
  );
  const sessionCookie = signinRes.cookies["session_id"][0].value;
  return { sessionCookie };
}

export default function (data) {
  const res = http.get(
    "http://localhost:4000/api/meetings/trends?period=monthly&metric=rating",
    { headers: { Cookie: `session_id=${data.sessionCookie}` } },
  );
  check(res, { "trends fetch succeeded": (r) => r.status === 200 });
  sleep(1);
}
