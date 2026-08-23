import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

export interface UploadedAsset {
  key: string
  url: string
}

export interface StoredFile {
  body: Buffer
  contentType: string
}

export interface UploadInput {
  filename: string
  contentType?: string
  body: Buffer
  visibility?: 'public' | 'private'
}

export interface StorageProvider {
  upload(input: UploadInput): Promise<UploadedAsset>
  read(key: string, visibility?: 'public' | 'private'): Promise<StoredFile>
  remove(key: string): Promise<void>
}

function normalizePathPrefix(value: string) {
  return value.replace(/\/+$/g, '')
}

function extensionFromFilename(filename: string) {
  const extension = path.extname(filename).trim()
  return extension ? extension.toLowerCase() : ''
}

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
}

function contentTypeFromExtension(filename: string) {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'
}

class LocalStorageProvider implements StorageProvider {
  constructor(
    private readonly rootDir = process.env.STORAGE_LOCAL_DIR ?? 'public/uploads',
    private readonly publicBase = process.env.STORAGE_PUBLIC_BASE_URL ?? '/uploads',
  ) {}

  async upload(input: UploadInput): Promise<UploadedAsset> {
    const key = `${crypto.randomUUID()}${extensionFromFilename(input.filename)}`
    const absoluteRoot = path.join(process.cwd(), input.visibility === 'private' ? (process.env.STORAGE_PRIVATE_DIR ?? '.storage/private') : this.rootDir)
    const absolutePath = path.join(absoluteRoot, key)

    await mkdir(absoluteRoot, { recursive: true })
    await writeFile(absolutePath, input.body)

    return {
      key,
      url: input.visibility === 'private' ? `/api/admin/documents/${key}` : `${normalizePathPrefix(this.publicBase)}/${key}`,
    }
  }

  async read(key: string, visibility: 'public' | 'private' = 'public'): Promise<StoredFile> {
    const rootDir = visibility === 'private' ? (process.env.STORAGE_PRIVATE_DIR ?? '.storage/private') : this.rootDir
    const absolutePath = path.join(process.cwd(), rootDir, key)
    return {
      body: await readFile(absolutePath),
      contentType: contentTypeFromExtension(key),
    }
  }

  async remove(key: string) {
    const absolutePath = path.join(process.cwd(), this.rootDir, key)
    await rm(absolutePath, { force: true })
  }
}

class S3CompatibleStorageProvider implements StorageProvider {
  private readonly client: S3Client

  constructor(
    private readonly bucket = process.env.S3_BUCKET ?? '',
    private readonly publicUrl = process.env.S3_PUBLIC_URL ?? '',
  ) {
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'us-east-1',
      endpoint: process.env.S3_ENDPOINT,
      credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      } : undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    })
  }

  private buildUrl(key: string) {
    if (this.publicUrl) {
      return `${normalizePathPrefix(this.publicUrl)}/${key}`
    }

    const endpoint = process.env.S3_ENDPOINT
    if (!endpoint) {
      return `https://${this.bucket}.s3.${process.env.S3_REGION ?? 'us-east-1'}.amazonaws.com/${key}`
    }

    return `${normalizePathPrefix(endpoint)}/${this.bucket}/${key}`
  }

  async upload(input: UploadInput): Promise<UploadedAsset> {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is required when STORAGE_DRIVER=s3')
    }

    const key = `${crypto.randomUUID()}${extensionFromFilename(input.filename)}`
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: input.body,
      ContentType: input.contentType,
    }))

    return {
      key,
      url: input.visibility === 'private' ? `/api/admin/documents/${key}` : this.buildUrl(key),
    }
  }

  async read(key: string, visibility: 'public' | 'private' = 'public'): Promise<StoredFile> {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is required when STORAGE_DRIVER=s3')
    }

    const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))
    const stream = result.Body as AsyncIterable<Uint8Array>
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)

    return {
      body,
      contentType: result.ContentType ?? contentTypeFromExtension(key),
    }
  }

  async remove(key: string) {
    if (!this.bucket) return
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }
}

let storageProvider: StorageProvider | null = null

export function getStorageProvider() {
  if (storageProvider) return storageProvider

  storageProvider = process.env.STORAGE_DRIVER === 's3'
    ? new S3CompatibleStorageProvider()
    : new LocalStorageProvider()

  return storageProvider
}
