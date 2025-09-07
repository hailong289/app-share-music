import { Album, Genre, SessionItems, Sessions, User } from '../../models';
import logger from '../../utils/logger';


export async function seedSessionsItems(): Promise<any[]> {
    try {
        logger.info('Seeding session items...');
        // Clear existing session items
        await SessionItems.deleteMany({});
        const findSessionAlbum = await Sessions.findOne({
          context_type: "home",
          name: "Album và đĩa đơn nổi tiếng"
        });
        const findSessionArtist = await Sessions.findOne({
          context_type: "home",
          name: "Nghệ sĩ phổ biến"
        });
        if (!findSessionAlbum || !findSessionArtist) {
          logger.warn('No session found for seeding session items');
          return [];
        }
        const AlbumData = await Album.find();
        const sampleSessionItems = AlbumData.map((album) => ({
            session_id: findSessionAlbum._id,
            item_id: album._id,
            item_type: 'album',
        }));

        const ArtistData = await User.find({ role: 'artist' });
        const sampleSessionItemsArtist = ArtistData.map((artist) => ({
            session_id: findSessionArtist._id,
            item_id: artist._id,
            item_type: 'artist',
        }));
        // Create session items
        const createdSessionItems = await SessionItems.insertMany([...sampleSessionItems, ...sampleSessionItemsArtist]);
        logger.info(`Successfully created ${createdSessionItems.length} session items`);
        return createdSessionItems;
    } catch (error) {
        logger.error('Error seeding session items:', error);
        throw error;
    }
}
