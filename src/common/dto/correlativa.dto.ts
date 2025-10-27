import { IsUUID, IsNotEmpty } from "class-validator";

export class CorrelativaCreateDTO {
  @IsUUID()
  @IsNotEmpty()
  uuid_materia_correlativa!: string;
}
