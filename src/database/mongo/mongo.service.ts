import { Injectable, Inject } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService {
  private db: Db | null = null;

  constructor(
    @Inject('MONGO_CLIENT') private readonly mongoClient: MongoClient | null,
  ) {
    if (this.mongoClient) {
      this.db = this.mongoClient.db('mindful-zen-prod');
      console.log('MongoService: Connected to MongoDB');
    } else {
      console.warn(
        'MongoService: MongoDB client is not available in this environment',
      );
    }
  }

  getCollection<T>(collectionName: string) {
    if (!this.db) {
      throw new Error('MongoDB is not connected in the current environment.');
    }
    return this.db.collection<T>(collectionName);
  }
}
