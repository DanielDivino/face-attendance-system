export interface CreateBiometricDTO {
  alunoId: string;
  descriptor: number[]; // jsonb (flexível)
  modeloVersao: string;
}
