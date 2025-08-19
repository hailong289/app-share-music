import { User } from '../../models';
import logger from '../../utils/logger';
import { IUser } from '../../types/user.type';

const sampleUsers = [
  {
    name: 'Quản Trị Viên',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Quản trị viên hệ thống',
    image_url: 'https://icotar.com/initials/A.png',
    isActive: true
  },
  {
    name: 'Võ Văn Nam',
    email: 'namvanvo@example.com',
    password: '123456',
    role: 'user',
    bio: 'Người đam mê âm nhạc và nhà phê bình',
    image_url: 'https://icotar.com/initials/N.png',
    isActive: true
  },
  {
    name: "Đinh Hải Long",
    email: "dinhhailong@example.com",
    password: "123456",
    role: "user",
    bio: "Người yêu thích âm nhạc và công nghệ",
    image_url: "https://icotar.com/initials/D.png",
    isActive: true
  },
  // Thêm nghệ sĩ
  {
    "name": "Sơn Tùng M-TP",
    "email": "sontungmtp@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nghệ sĩ nổi tiếng với nhiều bản hit",
    "image_url": "https://icotar.com/initials/ST.png",
    "isActive": true
  },
  {
    "name": "SOOBIN",
    "email": "soobin@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ đa tài trong dòng nhạc Pop và R&B",
    "image_url": "https://icotar.com/initials/S.png",
    "isActive": true
  },
  {
    "name": "HIEUTHUHAI",
    "email": "hieuthuhai@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Rapper trẻ nổi bật với phong cách riêng",
    "image_url": "https://icotar.com/initials/H.png",
    "isActive": true
  },
  {
    "name": "Da LAB",
    "email": "dalab@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nhóm nhạc Hip-Hop/Pop đình đám tại Việt Nam",
    "image_url": "https://icotar.com/initials/DL.png",
    "isActive": true
  },
  {
    "name": "Bùi Trường Linh",
    "email": "buitruonglinh@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ với phong cách trữ tình, sâu lắng",
    "image_url": "https://icotar.com/initials/BL.png",
    "isActive": true
  },
  {
    "name": "Vũ.",
    "email": "vu@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ indie với những bản nhạc đầy cảm xúc",
    "image_url": "https://icotar.com/initials/V.png",
    "isActive": true
  },
  {
    "name": "Tlinh",
    "email": "tlinh@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nữ rapper đầy cá tính và phong cách độc đáo",
    "image_url": "https://icotar.com/initials/T.png",
    "isActive": true
  },
  {
    "name": "Vũ Cát Tường",
    "email": "vucattuong@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ, nhạc sĩ với nhiều bản hit được yêu thích",
    "image_url": "https://icotar.com/initials/VCT.png",
    "isActive": true
  },
  {
    "name": "ANH TRAI 'SAY HI'",
    "email": "anhtraisayhi@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nghệ sĩ trẻ với phong cách âm nhạc mới lạ",
    "image_url": "https://icotar.com/initials/AT.png",
    "isActive": true
  },
  {
    "name": "Kai Đinh",
    "email": "kaidinh@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nhạc sĩ, ca sĩ tài năng với nhiều ca khúc ballad",
    "image_url": "https://icotar.com/initials/KD.png",
    "isActive": true
  },
  {
    "name": "Emcee L (Da LAB)",
    "email": "emceel@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Rapper và thành viên nhóm Da LAB",
    "image_url": "https://icotar.com/initials/EL.png",
    "isActive": true
  },
  {
    "name": "MAYDAYs",
    "email": "maydays@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ban nhạc với phong cách pop trẻ trung",
    "image_url": "https://icotar.com/initials/MD.png",
    "isActive": true
  },
  {
    "name": "Dương Domic",
    "email": "duongdomic@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nghệ sĩ trẻ đang được khán giả chú ý",
    "image_url": "https://icotar.com/initials/DD.png",
    "isActive": true
  },
  {
    "name": "Ronboogz",
    "email": "ronboogz@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Rapper cá tính với flow độc đáo",
    "image_url": "https://icotar.com/initials/R.png",
    "isActive": true
  },
  {
    "name": "T.R.I",
    "email": "tri@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ trẻ với phong cách pop ballad",
    "image_url": "https://icotar.com/initials/TRI.png",
    "isActive": true
  },
  {
    "name": "Obito",
    "email": "obito@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Rapper trẻ với nhiều ca khúc hit",
    "image_url": "https://icotar.com/initials/O.png",
    "isActive": true
  },
  {
    "name": "Puppy",
    "email": "puppy@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ mới nổi với giọng hát trẻ trung",
    "image_url": "https://icotar.com/initials/P.png",
    "isActive": true
  },
  {
    "name": "W/N",
    "email": "wn@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Nghệ sĩ indie/rap với màu sắc riêng biệt",
    "image_url": "https://icotar.com/initials/WN.png",
    "isActive": true
  },
  {
    "name": "Dangrangto",
    "email": "dangrangto@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Rapper với cá tính âm nhạc mạnh mẽ",
    "image_url": "https://icotar.com/initials/D.png",
    "isActive": true
  },
  {
    "name": "AMEE",
    "email": "amee@example.com",
    "password": "123456",
    "role": "artist",
    "bio": "Ca sĩ trẻ nổi bật với nhiều ca khúc pop dễ thương",
    "image_url": "https://icotar.com/initials/A.png",
    "isActive": true
  }
];

export async function seedUsers(): Promise<any[]> {
  try {
    logger.info('Seeding users...');

    // Clear existing users
    await User.deleteMany({});

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);

    logger.info(`Successfully created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
}
