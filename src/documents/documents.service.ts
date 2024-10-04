import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { readFile } from 'fs/promises';
import { PrismaService } from 'src/prisma/prisma.service';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Note } from './types/note.type';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class DocumentsService {
  constructor(private prismaService: PrismaService) {}

  async createNote(dto: CreateNoteDto) {
    const createdNote = await this.prismaService.serviceNote.create({
      data: dto,
    });

    return this.generateNoteDocument(createdNote);
  }

  async findNote(id: number) {
    const note = await this.prismaService.serviceNote.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} does not exist`);
    }

    return this.generateNoteDocument(note);
  }

  async findAllNotes() {
    const notes = await this.prismaService.serviceNote.findMany();
    return notes.map((note) => ({
      id: note.id,
      name: this.formatName(note),
    }));
  }

  async updateNote(dto: UpdateNoteDto) {
    const { id, ...data } = dto;
    try {
      const updatedNote = await this.prismaService.serviceNote.update({
        where: { id },
        data,
      });

      return this.generateNoteDocument(updatedNote);
    } catch {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }

  async deleteNote(id: number) {
    try {
      await this.prismaService.serviceNote.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }

  private async generateNoteDocument(note: Note) {
    const docxBuffer = await readFile(
      `${__dirname}/templates/service-note.docx`,
    );
    const zip = new PizZip(docxBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      type: note.type,
      receiver: note.receiver,
      title: note.title,
      content: note.content,
    });

    const content = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const name = this.formatName(note);

    return { name, content };
  }

  private formatName(note: Note) {
    // name: Notetype_№number_year_Text_from_title_five_words.docx
    const year = note.createdAt.getFullYear();
    const shortTitle = note.title.split(/\s+/).slice(0, 5).join('_');
    const type = this.capitalize(note.type).split(/\s+/)[0];
    return `${type}_№${note.id}_${year}_${shortTitle}.docx`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
