const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const jwksRsa = require('jwks-rsa');

const app = new Koa();

console.log(`USER_POOL_ID: ${process.env.USER_POOL_ID}`);
console.log(`PRODUCTS_TABLE_NAME: ${process.env.PRODUCTS_TABLE_NAME}`);
console.log(`AWS_REGION: ${process.env.AWS_REGION}`);
app.use(createAuthMiddleware()
    .unless({path: '/hello'}));
app.use(bodyParser());
app.use(buildRouter().routes());
app.listen(3000);

function buildRouter() {
    const router = new Router();
    router.get('/hello', require('./hello'));
    router.patch('/products/:id', require('./products/updateProduct'));
    router.post('/products', require('./products/createProduct'));
    router.get('/products', require('./products/listProducts'));
    return router;
}

function createAuthMiddleware() {
  return jwt({
    secret: jwksRsa.koaJwtSecret({
      cache: true,
      jwksUri: 'https://cognito-idp.us-east-1.amazonaws.com/' + process.env.USER_POOL_ID + '/.well-known/jwks.json'
    }),
    algorithms: ['RS256']
  });
}

