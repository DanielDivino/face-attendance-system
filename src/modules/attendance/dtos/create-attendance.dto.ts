export interface CreateAttendanceDTO {
  aulaId: string;
  alunoId: string;
  status: "presente" | "falta" | "atraso" | "justificado";
  origem?: "manual" | "facial";
  confianca?: number | null;
}
