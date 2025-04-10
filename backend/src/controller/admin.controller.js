import {Song }from '../models/song.model.js';
import {Album} from '../models/album.model.js'
import cloudinary from '../lib/cloudinary.js'
// helper function to upload files to cloudinary 
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type:"auto"
        })
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploading to cloudinary",error);
        throw new Error("Error in uploading to cloudinary");
    }
}
export const createSong = async(req, res,next)=>{
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({
               message:"Please upload all the files"
            })
      }

       const {title, artist, albumId, duration } = req.body;
       const audioFile  = req.files.audioFile;
       const imageFile = req.files.imageFile;

       const audioUrl = await uploadToCloudinary(audioFile);
       const imageUrl = await uploadToCloudinary(imageFile);

       const song = new Song({
        title,
        artist,
        audioUrl,
        imageUrl,
        duration,
        albumId: albumId || null,
       })

       await song.save();

       //if song belongs to an album, update the album's songs array
       if(albumId){
        await Album.findByIdAndUpdate (albumId, {
            $push: { songs: song._id}
        })
       }
       res.status(201).json(song); 
    } catch (error) {
        console.log("Error is creating song",error);
        res.status(500).json({
            message:"Internal server error",error
        })
        next(error);
    }

}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the song by ID
        const song = await Song.findById(id);

        // If the song belongs to an album, remove it from the album's songs array
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }
        // Remove the song from the database
         await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("Error in deleting song", error);
        next(error);
    }
};

export const createAlbum = async (req, res, next) => {
    try {

        const { title, artist, releaseYear } = req.body;
        const {imageFile} = req.files;


        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl,
        });

        await album.save();

        res.status(201).json(album);
    } catch (error) {
        console.log("Error in creating album", error);
        // res.status(500).json({
        //     message: "Internal server error",
        //     error
        // });
        next(error);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Remove all songs associated with the album
        await Song.deleteMany({ albumId: id });

        // Remove the album from the database
        await Album.findByIdAndDelete(id);

        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleting album", error);
        next(error);
    }
};

export const checkAdmin = async (req, res,next) => {
     res.status(200).json({admin:true})
}