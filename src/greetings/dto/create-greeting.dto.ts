import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateGreetingDto {
    @IsString()
    @IsNotEmpty()
    greeting: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
