import {IsNotEmpty, IsString} from "class-validator";

export class CreateGreetingDto {
    @IsString()
    @IsNotEmpty()
    greeting: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
