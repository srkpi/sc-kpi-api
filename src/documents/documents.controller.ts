import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Public } from 'src/auth/decorators';
import { DocumentsService } from './documents.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteIdDto } from './dto/note-id.dto';
import { ReadNoteDto } from './dto/read-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Public()
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('note')
  @ApiResponse({
    status: 200,
    description: 'The DOCX file has been successfully generated.',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateNoteDto, @Res() res: Response) {
    const result = await this.documentsService.createNote(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX MIME type
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`,
    });
    res.send(result.content);
  }

  @Get('notes')
  @ApiResponse({ status: 200, type: [ReadNoteDto] })
  async findAll() {
    const notes = await this.documentsService.findAllNotes();
    return plainToInstance(ReadNoteDto, notes);
  }

  @Get('note/:noteId')
  @ApiResponse({
    status: 200,
    description: 'The DOCX file has been successfully generated.',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        { schema: { type: 'string', format: 'binary' } },
    },
  })
  async findOne(@Param() dto: NoteIdDto, @Res() res: Response) {
    const result = await this.documentsService.findNote(dto.noteId);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX MIME type
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`,
    });
    res.send(result.content);
  }

  @Patch('note')
  @ApiResponse({
    status: 200,
    description: 'The DOCX file has been successfully generated.',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Note with this ID does not exist',
  })
  async update(@Body() dto: UpdateNoteDto, @Res() res: Response) {
    const result = await this.documentsService.updateNote(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX MIME type
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`,
    });
    res.send(result.content);
  }

  @Delete('note/:noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Note has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Note with this ID does not exist',
  })
  async remove(@Param() dto: NoteIdDto) {
    await this.documentsService.deleteNote(dto.noteId);
  }
}
