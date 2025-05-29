import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema({
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        }
        ,
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        aiVoice: {
            type: String,
            required: true,
        },
        aiPodcastPrompt: {
            type: String,
            required: true,
        },
        aiThumbnailPrompt: {
            type: String,
            required: true,
        },
        audioUrl: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
        },
        
    },
    { timestamps: true}
);

export const Podcast = mongoose.model('Podcast', podcastSchema);