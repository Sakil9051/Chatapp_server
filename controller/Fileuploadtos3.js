const dotenv = require('dotenv');
const aws = require('aws-sdk');
const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

dotenv.config();

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});

async function generateUploadURL(request,response) {

  try{
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');
  
    const params = ({
      Bucket: bucketName,
      Key: imageName,
      Expires: 60
    });
    
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    return response.status(200).json({"url":uploadURL});

  }catch(e){
    console.log(e);
    return response.status(500).json({
      success: false,
      message: "Error in generating upload URL"
    });
  }
}

module.exports = { generateUploadURL };  // Export the function for use in other files
