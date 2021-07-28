import AWS from 'aws-sdk';
import uniqid from 'uniqid';
import mime from 'mime';

const instanceParams = { signatureVersion: 'v4' };

// if (process.env.AWS_S3_ENDPOINT) {
//   instanceParams.endpoint = process.env.AWS_S3_ENDPOINT;
//   instanceParams.s3ForcePathStyle = true;
// }

export const instance = new AWS.S3(instanceParams);

export const createPresignedPostData = (fileName, bucketName, key) => {
  const contentType = mime.getType(fileName);

  const params = {
    Bucket: bucketName,
    Expires: 900,
    Fields: {
      'Content-Type': contentType,
      key: key || `${uniqid()}_${fileName}`,
      acl: 'public-read'
    }
  };

  return new Promise((resolve, reject) => {
    instance.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
