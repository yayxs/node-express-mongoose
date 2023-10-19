import express from 'express'
import { NODE_ENV } from './config/index.js'
import { ErrorMiddleware } from './middlewares/error.middleware.js'
import { logger } from './utils/logger.js'
import { dbConnection } from './database/index.js'
export class App {
  // app // app 应用
  // env // string 应用的环境
  // port // string | number
  // // 参数 路由表数组
  constructor(routes) {
    this.app = express()
    this.env = NODE_ENV || 'development'
    this.port = 3000

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
  }

  listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`)
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info(`=================================`)
    })
  }

  getServer() {
    return this.app
  }

  async connectToDatabase() {
    await dbConnection()
  }
  initializeMiddlewares() {
    this.app.use(express.json()) // 取到json数据 在 req.body 之中
  }
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
  }
  initializeErrorHandling() {
    this.app.use(ErrorMiddleware)
  }
}
