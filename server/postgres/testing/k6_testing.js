import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  thresholds: {
    http_req_duration: [
      { threshold: 'max < 500', abortOnFail: false },
      { threshold: 'p(95) < 200', abortOnFail: false}
    ],
    http_req_failed: [{ threshold: 'rate < 0.01', abortOnFail: true}]
  },
  stages: [
    {duration: '30s', target: 1000},
  ],
};

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default function () {

  const randomQuestion = Math.floor(Math.random() * 1000011);

  http.get(`http://localhost:3001/qa/questions?product_id=${randomQuestion}`);
  sleep(1);
}
