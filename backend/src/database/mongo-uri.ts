import { ConfigService } from '@nestjs/config';

let memoryUri: string | null = null;

export async function createMongoUri(config: ConfigService): Promise<string> {
  const useMemory =
    config.get<string>('USE_MEMORY_DB') === 'true' ||
    config.get<string>('USE_MEMORY_DB') === '1';

  if (!useMemory) {
    return config.get<string>('MONGODB_URI') ?? 'mongodb://127.0.0.1:27017/taha-traders';
  }

  if (memoryUri) return memoryUri;

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  memoryUri = mongod.getUri('taha-traders');
  console.log('Using in-memory MongoDB for local development');
  return memoryUri;
}
