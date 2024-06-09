import {Expose} from "class-transformer";

export class MessageResponseDto {
    @Expose()
    message: string;
}
