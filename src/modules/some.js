import { uploadBytes, getDownloadURL, getStorage, listAll, ref as storageRef, deleteObject } from 'firebase/storage';

const SoMePost = () => {

    // Function to upload images to Firebase Storage
    const handleImageUpload = async (event) => {
        const storage = getStorage();
        const files = event.target.files;
        if (!files.length) return;

        try {
            const imagePromises = Array.from(files).map(async (file) => {
                const imageRef = storageRef(storage, `some/img/${file.name}`);
                await uploadBytes(imageRef, file);
                return getDownloadURL(imageRef);
            });
            const imageUrls = await Promise.all(imagePromises);
            console.log('Images uploaded to storage:', imageUrls);
        } catch (error) {
            console.error('Error uploading the images:', error);
        }
    };

    // Function to upload videos to Firebase Storage
    const handleVideoUpload = async (event) => {
        const storage = getStorage();
        const files = event.target.files;
        if (!files.length) return;

        try {
            const videoPromises = Array.from(files).map(async (file) => {
                const videoRef = storageRef(storage, `some/video/${file.name}`);
                await uploadBytes(videoRef, file);
                return getDownloadURL(videoRef);
            });
            const videoUrls = await Promise.all(videoPromises);
            console.log('Videos uploaded to storage:', videoUrls);
        } catch (error) {
            console.error('Error uploading the videos:', error);
        }
    };

    // Function to delete media (image or video) from Firebase Storage
    const deleteMedia = async (mediaUrl, callback) => {
        try {
            const storage = getStorage();
            const mediaRef = storageRef(storage, mediaUrl);
            await deleteObject(mediaRef);
            console.log('Media deleted from storage!');
            callback(mediaUrl);
        } catch (error) {
            console.error('Error deleting the media:', error);
        }
    };

    // Function to get all media from Firebase Storage
    const getMediaFromStorage = async () => {
        const storage = getStorage();
        const imagesRef = storageRef(storage, 'some/img/');
        const videosRef = storageRef(storage, 'some/video/');
        try {
            const [imageResult, videoResult] = await Promise.all([listAll(imagesRef), listAll(videosRef)]);
            const imageUrls = await Promise.all(imageResult.items.map((item) => getDownloadURL(item)));
            const videoUrls = await Promise.all(videoResult.items.map((item) => getDownloadURL(item)));
            return [
                ...imageUrls.map(url => ({ url, type: 'image' })),
                ...videoUrls.map(url => ({ url, type: 'video' }))
            ];
        } catch (error) {
            console.error('Error getting media from storage:', error);
            return [];
        }
    };

    return {
        handleImageUpload,
        handleVideoUpload,
        deleteMedia,
        getMediaFromStorage,
    };
};

export default SoMePost;
