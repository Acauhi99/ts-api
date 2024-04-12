import fastify from "fastify";
import 'dotenv/config';
import { prisma } from './db/prisma';
import { UserData } from './types/userData';


const app = fastify();

app.get('/user', async () => {
  const users = await prisma.user.findMany();
  return users;
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

    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete('/user/:id', async (req: any) => {
  const userId = parseInt(req.params.id); 

  const deletedUser = await prisma.user.delete({
    where: { id: userId.toString() }, 
  });

  return deletedUser; 
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen({
  host: HOST,
  port: Number(PORT)
}).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
