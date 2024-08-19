import { Injectable } from '@nestjs/common';
import { ServiceNoteDto } from './dto/service-note.dto';
import JSZip from 'jszip';
import { readFileSync } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prismaService: PrismaService) {}

  async generateServiceNote(dto: ServiceNoteDto) {
    const docxBuffer = readFileSync(`${__dirname}/templates/service-note.docx`);
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(docxBuffer);
    let documentXml = await zipContent.file('word/document.xml').async('text');

    const result = await this.prismaService.serviceNote.create({ data: dto });

    const replacements = {
      number: result.id.toString(),
      receiver: dto.receiver,
      day: result.createdAt.getDate().toString(),
      month: this.uaMonth(result.createdAt.getMonth()),
      year: result.createdAt.getFullYear().toString(),
      title: dto.title,
      content: dto.content,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      const placeholderRegex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
      documentXml = documentXml.replace(placeholderRegex, value);
    }

    zipContent.file('word/document.xml', documentXml);

    return await zipContent.generateAsync({ type: 'nodebuffer' });
  }

  private uaMonth(month: number) {
    const months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня',
    ];
    return months[month];
  }
}
