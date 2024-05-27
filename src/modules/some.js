import { uploadBytes, getDownloadURL, getStorage, listAll, ref as storageRef, deleteObject } from 'firebase/storage';

const storage = getStorage();

const SoMePost = () => {

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

    const deleteMedia = async (mediaUrl, callback) => {
        try {
            const storage = getStorage();
            const mediaRef = storageRef(storage, mediaUrl);
            await deleteObject(mediaRef);
            // console.log('Media deleted from storage!');
            callback(mediaUrl);
        } catch (error) {
            console.error('Error deleting the media:', error);
        }
    };

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

    const downloadMedia = async (mediaUrl) => {
        try {
            const mediaRef = storageRef(storage, mediaUrl);
            const downloadUrl = await getDownloadURL(mediaRef);

            // Fetch the media data as a blob
            const response = await fetch(downloadUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch media (${response.status} ${response.statusText})`);
            }

            const blob = await response.blob();

            // Extract filename without query parameters and duplicate extensions
            const filenameParts = mediaUrl.split('/').pop().split('?')[0].split('%2F').slice(-1)[0].split('.');
            let filename = filenameParts.slice(0, -1).join('.');
            filename = filename.replace(/%20/g, '-'); // Replace %20 with -
            const extension = filenameParts.pop();
            const filenameWithExtension = `${filename}.${extension}`;

            // Create a blob URL for the media
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filenameWithExtension; // Set the filename correctly
            a.style.display = 'none'; // Hide the link
            document.body.appendChild(a);

            // Simulate a click event on the link
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading media:', error);
        }
    };
    return {
        handleImageUpload,
        handleVideoUpload,
        deleteMedia,
        getMediaFromStorage,
        downloadMedia
    };
};

export default SoMePost;
