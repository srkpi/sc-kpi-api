import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ImgurService {
  private readonly IMGUR_CLIENT_ID: string;
  private readonly logger = new Logger(ImgurService.name);

  constructor(config: ConfigService) {
    this.IMGUR_CLIENT_ID = config.get<string>('IMGUR_CLIENT_ID');
  }

  async uploadImage(imageString: string, title: string, description: string) {
    try {
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        {
          image: imageString,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Client-ID ${this.IMGUR_CLIENT_ID}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const imageData = response.data;
      const { url, deleteHash } = imageData.data;
      return {
        url,
        deleteHash,
      };
    } catch (error) {
      this.logger.error('Error while uploading image to Imgur: ', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteImage(deleteHash: string) {
    if (!deleteHash) return;
    try {
      await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
        headers: {
          Authorization: `Client-ID ${this.IMGUR_CLIENT_ID}`,
        },
      });
    } catch (error) {
      this.logger.error('Error deleting image to Imgur: ', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
