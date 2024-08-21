import { Injectable } from '@nestjs/common';
import { ServiceNoteDto } from './dto/service-note.dto';
import { readFile } from 'fs/promises';
import { PrismaService } from 'src/prisma/prisma.service';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

@Injectable()
export class DocumentsService {
  constructor(private prismaService: PrismaService) {}

  async generateServiceNote(dto: ServiceNoteDto) {
    const docxBuffer = await readFile(
      `${__dirname}/templates/service-note.docx`,
    );
    const zip = new PizZip(docxBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const result = await this.prismaService.serviceNote.create({ data: dto });

    doc.render({
      number: result.id,
      day: result.createdAt.getDate(),
      month: this.uaMonth(result.createdAt.getMonth()),
      year: result.createdAt.getFullYear(),
      receiver: dto.receiver,
      title: dto.title,
      content: dto.content,
    });

    const content = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const year = result.createdAt.getFullYear();
    const shortTitle = dto.title.split(/\s+/).slice(0, 5).join('_');

    const name = `Службова_№${result.id}_${year}_${shortTitle}.docx`;

    return { name, content };
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
