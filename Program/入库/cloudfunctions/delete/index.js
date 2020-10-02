// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'firsttest-n27bb'
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('out').where({
      done:false
    }).remove()
  } catch(e) {
    console.error(e)
  }
}