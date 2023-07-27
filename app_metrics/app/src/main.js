const express = require("express");
const app = express();
const port = 8081;

const client = require("prom-client");

const counter = new client.Counter({
  name: "test_counter",
  help: "Example of a counter",
  labelNames: ["code"],
});

const gauge = new client.Gauge({
  name: "test_gauge",
  help: "Example of a gauge",
  labelNames: ["method", "code"],
});

setInterval(() => {
  counter.inc({ code: 200 });
}, 1000);

setInterval(() => {
  counter.inc({ code: 400 });
}, 4000);

setInterval(() => {
  gauge.set({ method: "get", code: 200 }, Math.random());
  gauge.set(Math.random());
  gauge.labels("post", "300").inc();
}, 1000);

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
