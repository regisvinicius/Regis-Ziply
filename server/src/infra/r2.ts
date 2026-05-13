import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { env } from '../env.js';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
  // LocalStack needs path-style; real R2 also supports it.
  forcePathStyle: Boolean(env.CLOUDFLARE_ENDPOINT),
});

export type R2PutOptions = {
  key: string;
  body: Uint8Array | string;
  contentType: string;
};

export async function putObject(opts: R2PutOptions): Promise<void> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
    }),
  );
}

export async function ensureBucket(): Promise<void> {
  try {
    await r2Client.send(new CreateBucketCommand({ Bucket: env.CLOUDFLARE_BUCKET }));
  } catch (err) {
    if (err instanceof S3ServiceException) {
      const code = err.name;
      if (code === 'BucketAlreadyOwnedByYou' || code === 'BucketAlreadyExists') return;
    }
    throw err;
  }
}
