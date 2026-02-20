export interface UpdateAttendanceDTO {
  status?: "presente" | "falta" | "atraso" | "justificado";
  origem?: "manual" | "facial";
  confianca?: number | null;
}
