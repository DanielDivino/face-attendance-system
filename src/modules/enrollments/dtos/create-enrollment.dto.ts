export interface CreateEnrollmentDTO {
      alunoId: string;
      turmaId: string;
      status?: "ativo" | "inativo";
}