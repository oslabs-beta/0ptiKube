import http from 'k6/http';
import { sleep, check } from 'k6';

// export const options = {
//   // A number specifying the number of VUs to run concurrently.
//   vus: 100,
//   // A string specifying the total duration of the test run.
//   duration: '30s',

//   // The following section contains configuration options for execution of this
//   // test script in Grafana Cloud.

//   // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
//   // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.

//   // cloud: {
//   //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
//   //   // By default tests are executed in default project.
//   //   projectID: "",
//   //   // The name of the test in the k6 Cloud UI.
//   //   // Test runs with the same name will be grouped.
//   //   name: "my-first-test.ts"
//   // },

//   // Uncomment this section to enable the use of Browser API in your tests.
//   //
//   // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
//   // about using Browser API in your test scripts.
//   //
//   // scenarios: {
//   //   // The scenario name appears in the result summary, tags, and so on.
//   //   // You can give the scenario any name, as long as each name in the script is unique.
//   //   ui: {
//   //     // Executor is a mandatory parameter for browser-based tests.
//   //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
//   //     //
//   //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
//   //     executor: 'shared-iterations',
//   //     options: {
//   //       browser: {
//   //         // This is a mandatory parameter that instructs k6 to launch and
//   //         // connect to a chromium-based browser, and use it to run UI-based
//   //         // tests.
//   //         type: 'chromium',
//   //       },
//   //     },
//   //   },
//   // }
// };

// // The function that defines VU logic.
// //
// // See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// // about authoring k6 scripts.
// //
// export default function() {
//   http.get('https://test.k6.io');
//   sleep(1);
// }

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // Ramp up to 20 users
    { duration: '3m', target: 50 }, // Ramp up to 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Fixed syntax: p(95) instead of p95
    http_req_failed: ['rate<0.01'], // This syntax is correct
  },
};

// Rest of the code remains the same
(() => {
  // Simulate intensive data fetching
  for (let i = 0; i < 10; i++) {
    // Make multiple requests per iteration
    // Test cluster-level metrics
    const clusterResponses = http.batch([
      ['GET', 'http://localhost:3000/api/metrics/cluster/cpu/history'],
      ['GET', 'http://localhost:3000/api/metrics/cluster/cpu/percent'],
      ['GET', 'http://localhost:3000/api/metrics/cluster/memory/history'],
      ['GET', 'http://localhost:3000/api/metrics/cluster/memory/percent'],
    ]);

    // Test container-level metrics
    const containerResponses = http.batch([
      ['GET', 'http://localhost:3000/api/metrics/container/cpu/history'],
      ['GET', 'http://localhost:3000/api/metrics/container/cpu/percent'],
      ['GET', 'http://localhost:3000/api/metrics/container/memory/history'],
      ['GET', 'http://localhost:3000/api/metrics/container/memory/percent'],
    ]);

    // Add checks for all responses
    clusterResponses.forEach((response) => {
      check(response, {
        'cluster metrics status is 200': (r) => r.status === 200,
        'cluster metrics has data': (r) => r.body.length > 0,
      });
    });

    containerResponses.forEach((response) => {
      check(response, {
        'container metrics status is 200': (r) => r.status === 200,
        'container metrics has data': (r) => r.body.length > 0,
      });
    });

    // Add some CPU intensive operations
    for (let j = 0; j < 10000; j++) {
      Math.sqrt(j);
    }

    sleep(0.1); // Short sleep between iterations
  }

  sleep(1); // Sleep between VU iterations
})();
