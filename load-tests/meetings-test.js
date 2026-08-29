import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

// setup() runs ONCE, before any virtual users start looping.
// Its return value gets passed into every default() call as "data".
export function setup() {
  const signinRes = http.post(
    "http://localhost:4000/api/auth/signin",
    JSON.stringify({ email: "test2@example.com", password: "testpass13" }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(signinRes, { "setup signin succeeded": (r) => r.status === 200 });

  // Extract the session cookie from the sign-in response so we can
  // manually attach it to every subsequent request ourselves.
  const cookies = signinRes.cookies;
  const sessionCookie = cookies["session_id"][0].value;

  return { sessionCookie };
}

// default() runs repeatedly, once per virtual user per loop, for the
// full test duration. "data" here is whatever setup() returned.
export default function (data) {
  const meetingsRes = http.get("http://localhost:4000/api/meetings", {
    headers: {
      Cookie: `session_id=${data.sessionCookie}`,
    },
  });

  check(meetingsRes, { "meetings fetch succeeded": (r) => r.status === 200 });

  sleep(1);
}
