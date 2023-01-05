# simple-k8-Client

A simple and easy to use Kubernetes Client for Nodejs , the available k8 client
by kubernetes is great but for simple use-cases it is very unintuitive as it expects 
you to pass a bunch of empty params which could confuse a lot of users who are not looking 
to learn these

simple-k8-client is a very lightweight client which makes the k8 functions much easier 
to user for beginners and also serves as a mere example for more complex operation for 
others


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
