import fastify from "fastify";
import 'dotenv/config';
import { prisma } from './db/prisma';
import { UserData } from './types/userData';


const app = fastify();

app.get('/user', async () => {
  const users = await prisma.user.findMany();

  return users.filter(user => !user.deleted_at);
});

app.post('/user', async (req: any, res: any) => {
  const dataUser = req.body as UserData;

  try {
    const user = await prisma.user.create({
      data: dataUser
    });

    return user;

  } catch (error) {
    res.status(500).send("Erro ao criar usuário");
  }
});

app.put('/user/:id', async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    const dataUser = req.body as UserData;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataUser
    });

    return updatedUser;

  } catch (error) {
    res.status(500).send("Erro ao atualizar usuário");
  }
});

app.delete('/user/:id', async (req: any, res: any) => {
  const userId = req.params.id;

  try {
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date() }
    });

    return deletedUser;

  } catch (error) {
    res.status(500).send("Erro ao deletar usuário");
  }

});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen({
  host: HOST,
  port: Number(PORT)
}).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
