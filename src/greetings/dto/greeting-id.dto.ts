import {IsInt} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class GreetingIdDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    id: number;
}