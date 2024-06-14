const S3Plugin = require('webpack-s3-plugin');

const Region = 'ap-southeast-1';
const Bucket = 'visenze-static';
const StagingBucket = 'visenze-static-staging';
const FolderPath = 'widgets/dist/js/productsearch';

module.exports = (buildEnv) => {
  return new S3Plugin({
    include: /.*\.(js)/,
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: Region,
    },
    s3UploadOptions: {
      Bucket: buildEnv === 'production' ? Bucket : StagingBucket,
    },
    basePathTransform: function () {
      return new Promise(function (resolve) {
        resolve(`${FolderPath}${buildEnv === 'staging' ? '/staging' : ''}`);
      });
    },
  });
};
