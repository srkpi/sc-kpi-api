import {IsInt} from "class-validator";
import {Type} from "class-transformer";

export class GreetingIdDto {
    @Type(() => Number)
    @IsInt()
    id: number;
}