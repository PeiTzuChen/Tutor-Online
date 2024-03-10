const fs = require('fs')
const path = require('path')
const fspromises = fs.promises
const localFileHandler = (file) => {
  // 將temp資料透過fs緩衝方法，複製一份到upload資料夾，避免multer資料不完整
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    // 要寫入的圖片路徑

    // const fileName = path.join(__dirname, `../upload/${file.originalname}`)
    const fileName = `upload/${file.originalname}`
    return fspromises
      .readFile(file.path)
      .then((data) => {
        fspromises.writeFile(fileName, data)
        const data1 = fs.readFileSync(fileName)
        console.log('filehelperdata1:', data1)
        const data2 = path.join(__dirname, `../${fileName}`)
        console.log('filehelperdata2:', data2)
      })
      .then(() => resolve(`/${fileName}`))
      .catch((err) => reject(err))
  })
}

// 要删除文件的目录
const tempPath = path.join(__dirname, '../temp/')
const uploadPath = path.join(__dirname, '../upload/')

// 删除文件的函数
const deleteFiles = function (directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err)
        } else {
          console.log(`File: ${file} deleted successfully:`, file)
        }
      })
    })
  })
}
setInterval(() => deleteFiles(tempPath), 3600000) // 每一小時刪除暫存temp資料
setInterval(() => deleteFiles(uploadPath), 604800000) // 開發階段每一週刪除一次照片
module.exports = { localFileHandler }
