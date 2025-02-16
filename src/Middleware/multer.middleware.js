
import multer from "multer"
import fs from 'fs'

export const Multer =  (allowedExtensions = [] , folderPath ='general') =>{
  // const destinationFolder = `Assets/${folderPath}`
  // if(! fs.existsSync(destinationFolder)){
  //     fs.mkdirSync(destinationFolder ,{recursive:true})
  // }

  const diskStorage = multer.diskStorage({});


  const fileFilter = (req, file, cb) => {
      if(allowedExtensions.includes(file.mimetype)){
          cb(null, true)
      }else{
        cb( new Error('Invalid file type') , false)
      }
  }

  const upload = multer({fileFilter , storage:diskStorage})
  return upload
}



export const MulterHost =  (allowedExtensions = []) =>{
 
  const diskStorage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
      if(allowedExtensions.includes(file.mimetype)){
        cb(null, true)
      }else{
        cb( new Error('Invalid file type') , false)
      }
  }

  const upload = multer({fileFilter , storage:diskStorage})
  return upload
}

