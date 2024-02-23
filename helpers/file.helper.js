const fs = require('fs') // 引入 fs 模組
const path = require('path')
const fspromises = fs.promises
const localFileHandler = (file) => {
  // file 是 multer 處理完的檔案，以下將temp資料透過fs方法，複製一份到upload資料夾
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileName = path.join(__dirname, `../upload/${file.originalname}`) // 要寫入的圖片路徑
    return fspromises
      .readFile(file.path)
      .then((data) => {
        fspromises.writeFile(fileName, data)
      })
      .then(() => resolve(`${fileName}`))
      .catch((err) => reject(err))
  })
}

// 要删除文件的目录
const directoryPath = path.join(__dirname, './temp/')

// 定期每一天删除文件的函数
function deleteFiles () {
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
          console.log('File deleted successfully:', file)
        }
      })
    })
  })
}
setInterval(deleteFiles, 86400000)

module.exports =
  localFileHandler
