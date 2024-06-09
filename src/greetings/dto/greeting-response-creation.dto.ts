import {Expose} from "class-transformer";

export class GreetingResponseCreationDto {
    @Expose()
    id: number;

    @Expose()
    greeting: string;

    @Expose()
    name: string;
}
