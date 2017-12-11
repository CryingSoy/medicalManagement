let serect = () => { //Token密钥
  let str = ''
  for (let i = 0; i < 16; i++) {
    let base = Math.random() < 0.5 ? 65 : 97
    let num = Math.random() < 0.5 ? true : false
    if (num) {
      base = Math.floor(Math.random() * 100)
      str += base
    } else {
      str += String.fromCharCode(base + Math.floor(Math.random() * 26))
    }
  }
  return str
}

module.exports = serect