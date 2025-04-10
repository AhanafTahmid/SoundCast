import {Song} from '../models/song.model.js'; // Adjust the path to your Song model

export const getAllSongs = async (req, res,next) => {
    try {
        // -1 means descending order, 1 means ascending order
        const songs = await Song.find().sort({createAt:-1}); // Fetch all songs from the database
        res.json(songs); // Send the songs as a JSON response
    } catch (error) {
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {

        const songs = await Song.aggregate([
            { $sample: { size: 6 } },
            {
            $project: {
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl:1,
                audioUrl:1,
            }
            }
        ]);
       
        res.json(songs); // Send the featured songs as a JSON response
    } catch (error) {
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => {
    try { // Assuming user preferences are available in the request object
        const songs = await Song.aggregate([
            { $sample: { size: 4 } }, // Randomly select 10 songs
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);

        res.json(songs); // Send the personalized songs as a JSON response
    } catch (error) {
        next(error);
    }
};
export const getTradingSongs = async (req, res, next) => {
    try { // Assuming user preferences are available in the request object
        const songs = await Song.aggregate([
            { $sample: { size: 4 } }, // Randomly select 10 songs
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);

        res.json(songs); // Send the personalized songs as a JSON response
    } catch (error) {
        next(error);
    }
};