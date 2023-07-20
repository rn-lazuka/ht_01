import mongoose from 'mongoose';
import {BlogDBType} from '../types';

export const blogSchema = new mongoose.Schema<BlogDBType>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
});

blogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

blogSchema.set('toJSON', {virtuals: true});

export const Blog = mongoose.model('blog', blogSchema);
