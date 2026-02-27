import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

export const errorRate = new Rate("errors");

export const options = {
  vus: 50,
  duration: "60s",

  thresholds: {
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.02"],
    errors: ["rate<0.02"],
  },
};

export default function () {
  const url = "http://localhost:8000/generate";

  const payload = JSON.stringify({
    query: "Data Protection and Privacy Act",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  const success = check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 1500ms": (r) => r.timings.duration < 1500,
  });

  if (!success) {
    errorRate.add(1);
  }

  sleep(1);
}
