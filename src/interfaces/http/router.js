const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler }) => {
  const router = Router();


  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  
  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware);

  
  apiRouter.use('/users', controller('user/UsersController'));
  apiRouter.use('/policies', controller('policy/PoliciesController'));

  router.use('/api', apiRouter);
  router.use(errorHandler);

  return router;
};
