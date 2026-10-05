const app = require('./app')
const config = require('./utils/config')


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err && err.message)
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
