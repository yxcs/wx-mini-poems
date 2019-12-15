
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  return {
    test: true
  }
}
exports.tt = () => {
  console.log(0)
}