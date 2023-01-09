# Simple-Kubernetes-Client

A simple and easy to use Kubernetes Client for Nodejs , the available kubernetes
client by kubernetes is very lengthy to pass a bunch of paramaters While this
Kubernetes Client lacks alot of functionality but its very simple to use

Also some function which are simple usage of the internal kuberntes function to
expose something i feel is very usefull eg list of status for all pods

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
