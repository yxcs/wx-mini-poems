
exports.main = async (event, context) => {
  console.log(event)
  console.log(__dirname)
  console.log(__filename)
  return {
    test: true
  }
}

// var request = require('request');

// var  options = {
// 　method: 'GET',
//   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx14f9e0fdf55d8eaa&secret=328544c267281827ebb73972e355f1de',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// };

// var access_token = '28_KFhwusCVZJIwss3w1FF2ClX4C28NgzWAPjeUME5WULY5uelBQyalAsiM6iEOjYneuLcuIpNhx5WG3YbOWMOC8AsD-7Q2I8UYq7lO8yINQuR6w3UDnRbsLLUb_eqo-LTJuHCEnLvic7BVRFw6WMKdAIAKAY'

// var  options = {
// 　method: 'POST',
//   url: `https://api.weixin.qq.com/tcb/databasequery?access_token=${access_token}`,
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   json: {
//     // "access_token": access_token,
//     "env": "develop-094aba",
//     "query": "db.collection(\"category\").where({onlyId:\"1Ab26259653a5dA\"}).limit(10).get()"
//   }
//   // body: `access_token=${access_token}&env=develop-094aba&query=db.collection("category").where({onlyId:"1Ab26259653a5dA"}).limit(10).get()`
// };

// request(options, function (err, res, body) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(body);
//   }
// })