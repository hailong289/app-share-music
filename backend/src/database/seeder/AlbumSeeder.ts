import { Album } from '../../models';
import logger from '../../utils/logger';

const sampleAlbums = [
  {
    "title": "m-tp M-TP",
    "artist_id": "Sơn Tùng M-TP",
    "release_date": "2017-04-01",
    "cover_url": "https://icotar.com/initials/ST.png"
  },
  {
    "title": "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    "artist_id": "HIEUTHUHAI",
    "release_date": "2023-10-16",
    "cover_url": "https://icotar.com/initials/H.png"
  },
  {
    "title": "GOLDEN",
    "artist_id": "Jung Kook",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/JK.png"
  },
  {
    "title": "THE WXRDIES",
    "artist_id": "Wxrdie",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/W.png"
  },
  {
    "title": "Đánh Đổi",
    "artist_id": "Obito, Shiki",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/OS.png"
  },
  {
    "title": "BẬT NÓ LÊN",
    "artist_id": "SOOBIN",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/S.png"
  },
  {
    "title": "Từng Ngày Như Mãi Mãi",
    "artist_id": "Bùi Trường Linh",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/BT.png"
  },
  {
    "title": "Lặng",
    "artist_id": "Shiki",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/SK.png"
  },
  {
    "title": "rosie",
    "artist_id": "ROSÉ",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/R.png"
  },
  {
    "title": "Dữ Liệu Quý",
    "artist_id": "Dương Domic",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/DD.png"
  },
  {
    "title": "Bảo Tàng Của Nuối Tiếc",
    "artist_id": "Vũ.",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/V.png"
  },
  {
    "title": "99%",
    "artist_id": "RPT MCK",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/MCK.png"
  },
  {
    "title": "Ruby",
    "artist_id": "JENNIE",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/J.png"
  },
  {
    "title": "Phép Màu (Đàn Cá Gỗ Original Soundtrack)",
    "artist_id": "MAYDAYs, Minh Tốc & Lam",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/MD.png"
  },
  {
    "title": "ái",
    "artist_id": "tlinh",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/T.png"
  },
  {
    "title": "ANH TRAI \"SAY HI\" (Live Stage 4)",
    "artist_id": "ANH TRAI \"SAY HI\"",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/AT.png"
  },
  {
    "title": "Wrong Times",
    "artist_id": "Puppy, Dangrangto",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/W.png"
  },
  {
    "title": "Seven (feat. Latto)",
    "artist_id": "Jung Kook, Latto",
    "release_date": "2025-08-19",
    "cover_url": "https://icotar.com/initials/JK.png"
  }
];

export async function seedAlbums(users: any[]): Promise<any[]> {
  try {
    logger.info('Seeding albums...');

    // Clear existing albums
    await Album.deleteMany({});

    // Get only artist users
    const artists = users.filter(user => user.role === 'artist');

    // Assign albums to artists
    const albumsWithArtists = sampleAlbums.map((album, index) => ({
      ...album,
      artist_id: artists[index % artists.length]._id
    }));

    // Create albums
    const createdAlbums = await Album.insertMany(albumsWithArtists);

    logger.info(`Successfully created ${createdAlbums.length} albums`);
    return createdAlbums;
  } catch (error) {
    logger.error('Error seeding albums:', error);
    throw error;
  }
}
