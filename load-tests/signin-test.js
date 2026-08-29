import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10, // 10 "virtual users" hitting the server at once
  duration: "30s", // for 30 seconds
};

export default function () {
  const res = http.post(
    "http://localhost:4000/api/auth/signin",
    JSON.stringify({ email: "test2@example.com", password: "testpass13" }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
