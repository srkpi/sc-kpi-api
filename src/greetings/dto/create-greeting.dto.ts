import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateGreetingDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    greeting: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
