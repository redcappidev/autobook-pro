import uniqid from 'uniqid';
import config from '@server/config';
import { AWS } from '@server/third-party';
import { Quote, Carrier } from '@server/models';

export default {
  Mutation: {
    createUploadForm: (_, { fileName }) => {
      // https://stackoverflow.com/questions/29615828/using-s3-presigned-url-for-upload-a-file-that-will-then-have-public-read-access
      // https://blog.webiny.com/upload-files-to-aws-s3-using-pre-signed-post-data-and-a-lambda-function-7a9fb06d56c1
      const s3Key = `assets/${uniqid()}_${fileName}`;

      return AWS.s3.createPresignedPostData(
        fileName,
        config.aws.s3BucketName,
        s3Key
      );
    },
    attachFileToQuote: async (_, { id, asset }) => {
      const attachment = await Quote.relatedQuery('attachments')
        .for(id)
        .insert(asset)
        .returning('*');
      return attachment;
    },
    attachFileToCarrier: async (_, { id, category, asset }) => {
      const attachment = await Carrier.relatedQuery('attachments')
        .for(id)
        .insert({
          ...asset,
          metaData: {
            category
          }
        })
        .returning('*');
      return attachment;
    }
  }
};
