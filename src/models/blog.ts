import mongoose from 'mongoose';
import {BlobDBType} from '../types';

export const blogSchema = new mongoose.Schema<BlobDBType>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
});

blogSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

blogSchema.set('toJSON', { virtuals: true })

export const Blog = mongoose.model('blog', blogSchema)
