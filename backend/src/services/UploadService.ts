import fs from 'fs';
import path from 'path';

class UploadService {
  constructor(private uploadDir: string = 'uploads') {
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    if (!fs.existsSync('uploads/songs')) {
      fs.mkdirSync('uploads/songs', { recursive: true });
    }
    if (!fs.existsSync('uploads/banners')) {
      fs.mkdirSync('uploads/banners', { recursive: true });
    }
    if (!fs.existsSync('uploads/shared')) {
      fs.mkdirSync('uploads/shared', { recursive: true });
    }
  }

  public uploadMultiple(files: Express.Multer.File[]): string[] {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('Không có file để upload');
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname) || '';
      const newFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(this.uploadDir, newFileName);

      fs.writeFileSync(filePath, file.buffer); // Lưu file vào ổ đĩa
      savedPaths.push(filePath);

      console.log(`Đã lưu file: ${filePath} (${file.buffer.length} bytes)`);
    }

    return savedPaths;
  }

  public uploadSingle(file: Express.Multer.File, name: string = '', user_slug: string = ''): string {
    if (!file) {
      throw new Error('Không có file để upload');
    }

    if (user_slug) {
      if (!fs.existsSync(`uploads/songs/${user_slug}`)) {
        fs.mkdirSync(`uploads/songs/${user_slug}`, { recursive: true });
      }
      if (!fs.existsSync(`uploads/banners/${user_slug}`)) {
        fs.mkdirSync(`uploads/banners/${user_slug}`, { recursive: true });
      }
      user_slug = `${user_slug}/`;
    }

    if (file.fieldname === 'banner_url' || file.fieldname === 'cover_url') {
      name = `banners/${user_slug}${name}`;
    } else if (file.fieldname === 'audio_url') {
      name = `songs/${user_slug}${name}`;
    }  else {
      name = `shared/${name}`;
    }

    // Chấp nhận file mp3 và image
    console.log(`Uploading file: ${file.originalname} to ${this.uploadDir}/${name}`);
    const fileExt = path.extname(file.originalname || '').toLowerCase();
    const isAudio = file.mimetype === 'audio/mpeg' || fileExt === '.mp3';
    const isImage = file.mimetype.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt);

    if (!isAudio && !isImage) {
      throw new Error('Chỉ cho phép upload file MP3 và hình ảnh (JPG, JPEG, PNG, GIF, WEBP)');
    }

    const ext = path.extname(file.originalname) || (isAudio ? '.mp3' : '.jpg');
    const newFileName = name
      ? `${name}${ext}`
      : `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const filePath = path.join(this.uploadDir, newFileName);

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
  }

  public removeFile(file_path: string) {
    if (!file_path) {
      console.error('Không có file để xóa');
      return;
    }

    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
      console.log(`Đã xóa file: ${file_path}`);
    } else {
      console.warn(`File không tồn tại: ${file_path}`);
    }
  }
}

const uploadService = new UploadService();

export { uploadService, UploadService };
