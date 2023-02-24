import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  // thresholds: {
  //   http_req_duration: [
  //     { threshold: 'max < 500', abortOnFail: false },
  //     { threshold: 'p(95) < 200', abortOnFail: false}
  //   ],
  //   http_req_failed: [{ threshold: 'rate < 0.01', abortOnFail: true}]
  // },
  stages: [
    // {duration: '10s', target: 1000},
    // {duration: '10m', target:1500}

    {duration: '1m', target: 1800},
    {duration: '5m', target: 2000},
    {duration: '3m', target: 3000}

    // {duration: '15s', target: 200},
    // {duration:'15s', target: 00},
    // {duration: '15s', target: 0}
  ]
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export default function () {

  const randomQuestion = getRandomIntInclusive(950000, 1000011);

  http.get(`http://35.166.81.113:3001/qa/questions?product_id=${randomQuestion}`);
  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}