import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/decorators';
import { DocumentsService } from './documents.service';
import { ServiceNoteDto } from './dto/service-note.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Public()
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('service-note')
  @ApiResponse({
    status: 200,
    description: 'The DOCX file has been successfully generated.',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async generateServiceNote(@Body() dto: ServiceNoteDto, @Res() res: Response) {
    const result = await this.documentsService.generateServiceNote(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX MIME type
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`,
    });
    res.send(result.content);
  }
}
