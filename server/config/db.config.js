module.exports = {
  MONGODB_USERNAME: encodeURIComponent(process.env.MONGODB_USERNAME),
  MONGODB_PASSWORD: encodeURIComponent(process.env.MONGODB_PASSWORD),
  MONGODB_CLUSTER: process.env.MONGODB_CLUSTER
}
