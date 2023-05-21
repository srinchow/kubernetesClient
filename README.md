# simple-k8-client
[![Node.js CI](https://github.com/srinchow/kubernetesClient/actions/workflows/node.yml/badge.svg)](https://github.com/srinchow/kubernetesClient/actions/workflows/node.yml)

A simple and easy to use Kubernetes Client for Nodejs , the available k8 client
by kubernetes is great but for simple/common use-cases it is very unintuitive as
it expects you to pass a bunch of empty params which could confuse a lot of
users who are not looking to learn these

simple-k8-client is a very lightweight client which makes the k8 functions much
easier to use for simple/common usecases

Minimalist Kubernetes framework for [Node.js](http://nodejs.org).

Examples:

```js
const { getPod } = require("simple-kubernetes-client");
getPod("abc", "default").then((data) => {
  console.log(data);
}).catch((err) => {
});
```

Test : <br> Coverage is still not 100% will add more unit test, yet to write
integration test

```
npm run test
```

Future addition:

1. Cursor addition to fetch data via scroll
2. More Functions
