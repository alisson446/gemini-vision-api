import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IPacote, IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"
import crypto from 'crypto'

class PacoteRepository implements IPacote {

  private prisma = prismaManager.getPrisma()

  // create = async ({
  //   nome,
  //   descricao,
  //   origem,
  //   tipoTransporte,
  //   urlImagem,
  //   urlImgEsgotado,
  //   categoria,
  //   usuarioCadastro,
  //   opcionais }: IPacoteDTO): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

  //   try {

  //     const id = crypto.randomUUID()

  //     const opcional = {}

  //     if (opcionais) {
  //       Object.assign(opcional,
  //         {
  //           Produto: {
  //             connect: opcionais.map((opt) => { return { id: opt } })
  //           }
  //         }
  //       )
  //     }

  //     const pacote = await this.prisma.pacotes.create({
  //       data: {
  //         id,
  //         nome,
  //         descricao,
  //         urlImagem,
  //         urlImgEsgotado,
  //         origem,
  //         tipoTransporte,
  //         categoria,
  //         usuarioCadastro,
  //         ...opcional
  //       }
  //     })

  //     return { 'pacote': pacote, 'success': true }

  //   } catch (error) {
  //     throw new Warning('Não foi possivel inserir o pacote', 400)
  //   }
  // }

  // find = async (id: string): Promise<IPacoteResponse> => {

  //   const pacote = await this.prisma.pacotes.findFirst({
  //     where: {
  //       id
  //     },
  //     include: {
  //       Produto: true
  //     }
  //   })

  //   if (!pacote) {
  //     throw new Warning("Pacote não encontrado", 400)
  //   }

  //   return pacote
  // }

  // findAll = async (): Promise<IPacoteResponse[]> => {

  //   const pacotes = await this.prisma.pacotes.findMany({
  //     include: {
  //       Produto: true
  //     }
  //   })

  //   if (!pacotes) {
  //     throw new Warning("Sem pacotes encontrados na base", 400)
  //   }

  //   return pacotes
  // }

  // update = async ({
  //   nome,
  //   descricao,
  //   ativo,
  //   urlImagem,
  //   urlImgEsgotado,
  //   idWP,
  //   categoria,
  //   origem,
  //   tipoTransporte,
  //   usuarioCadastro,
  //   opcionais }: IPacoteDTO, id: string): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

  //   try {

  //     const opcional = {}

  //     await this.prisma.pacotes.update({
  //       where: {
  //         id
  //       },
  //       data: {
  //         Produto: {
  //           set: []
  //         }
  //       }
  //     })

  //     if (opcionais) {
  //       Object.assign(opcional,
  //         {
  //           Produto: {
  //             connect: opcionais.map((opt) => { return { id: opt } })
  //           }
  //         }
  //       )
  //     }

  //     const pacote = await this.prisma.pacotes.update({
  //       data: {
  //         nome,
  //         descricao,
  //         ativo,
  //         urlImagem,
  //         urlImgEsgotado,
  //         idWP,
  //         categoria,
  //         origem,
  //         tipoTransporte,
  //         usuarioCadastro,
  //         ...opcional
  //       },
  //       where: {
  //         id
  //       }
  //     })

  //     return { 'pacote': pacote, 'success': true }

  //   } catch (error) {
  //     throw new Warning('Erro ao atualizar pacote', 400)
  //   }
  // }

  // delete = async (id: string): Promise<IPacoteResponse> => {

  //   try {

  //     const pacote = await this.prisma.pacotes.update({
  //       data: {
  //         ativo: false
  //       },
  //       where: {
  //         id
  //       }
  //     })

  //     return pacote
  //   } catch (error) {
  //     throw new Warning('Ocorreu um erro ao excluir pacote', 400)
  //   }
  // }

  // setIdWP = async (id: string, idWP: number): Promise<string[]> => {

  //   try {

  //     const pacote = await this.prisma.pacotes.update({
  //       data: {
  //         idWP: idWP
  //       },
  //       where: {
  //         id
  //       }
  //     })

  //     return ['Pacote atualizado com sucesso']
  //   } catch (error) {
  //     throw new Warning('Ocorreu um erro ao atualizar pacote', 400)
  //   }
  // }

  // getAllByIds = async (ids: Array<number>): Promise<IPacoteResponse[]> => {

  //   const pacotes = await this.prisma.pacotes.findMany({
  //     where: {
  //       idWP: {
  //         in: ids
  //       }
  //     }
  //   })

  //   if (!pacotes) {
  //     throw new Warning("Nenhum Pacote Encontrado", 400)
  //   }

  //   return pacotes
  // }

}

export { PacoteRepository }
