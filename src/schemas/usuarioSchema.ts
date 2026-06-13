import { z } from 'zod';
import { UsuarioPerfil } from '../entities/Usuario';

export const createUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  login: z.string().min(3, 'Login deve ter pelo menos 3 caracteres').max(50),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.nativeEnum(UsuarioPerfil, {
    errorMap: () => ({ message: 'Perfil inválido' }),
  }).default(UsuarioPerfil.OPERADOR),
  ativo: z.boolean().optional(),
});

export const updateUsuarioSchema = z.object({
  nome: z.string().min(3).optional(),
  login: z.string().min(3).max(50).optional(),
  senha: z.string().min(6).optional(),
  perfil: z.nativeEnum(UsuarioPerfil).optional(),
  ativo: z.boolean().optional(),
});

export const loginSchema = z.object({
  login: z.string().min(1, 'Login obrigatório'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
