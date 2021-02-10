import AWS from 'aws-sdk';


AWS.config.update({region: 'us-west-1'});

export const s3 = new AWS.S3({ 
  apiVersion: '2006-03-01',
});