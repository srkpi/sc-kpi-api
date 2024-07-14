import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('EMAIL_USERNAME'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordRecoveryEmail(email: string, token: string) {
    const client = this.config.get<string>('CLIENT_URL');
    const htmlContent = this.readHtmlFile('reset-password.html').replace(
      '{{resetLink}}',
      `${client}/reset-password/${token}`,
    );

    await this.transporter.sendMail({
      from: '"SC KPI administration" <srkpinotification@gmail.com>',
      to: email,
      subject: 'Password reset request',
      html: htmlContent,
    });
  }

  private readHtmlFile(filename: string) {
    const path = `${__dirname}/templates/${filename}`;
    return fs.readFileSync(path, 'utf-8');
  }
}
