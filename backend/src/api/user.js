const UserController = require('../controller/user');

class UserApi {
    async createUser(req, res) {
        const { nome, email, senha, role } = req.body

        var userAdmin;

        if (req?.session) {
           userAdmin = (await UserController.findUser(req.session.id)).dataValues.role;
        }

        try {
            const user = await UserController.createUser(nome, email, senha, userAdmin ? role : 'viewer')
            return res.status(201).send(user)
        } catch (e) {
            return res.status(400).send({ error: `Erro ao criar usuário ${e.message}`})
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { nome, email, senha, userRole } = req.body;
        let userAdmin = false;
    
        try {
            const currentUser = await UserController.findUser(req.session.id);
            if (currentUser) {
                userAdmin = currentUser.dataValues.role === "admin";
            }
    
            const userToUpdate = await UserController.findUser(id);
            if (!userToUpdate) {
                return res.status(404).send({ error: "Usuário não encontrado" });
            }
    
            if (!userAdmin && currentUser.dataValues.id === Number(id) && role === "admin") {
                return res.status(403).send({ error: "Permissão negada para alterar o papel para admin" });
            }
    
            const newRole = userAdmin ? userRole : userToUpdate.dataValues.userRole;
    
            const updatedUser = await UserController.update(Number(id), nome, email, senha, newRole);
            return res.status(200).send(updatedUser);
        } catch (e) {
            return res.status(400).send({ error: `Erro ao alterar usuário: ${e.message}` });
        }
    }
    

    async deleteUser(req, res) {
        const { id } = req.params;
        let userAdmin = false;
    
        try {
            const currentUser = await UserController.findUser(req.session.id);
            if (currentUser) {
                userAdmin = currentUser.dataValues.role === "admin";
            }
    
            const userToDelete = await UserController.findUser(id);
            if (!userToDelete) {
                return res.status(404).send({ error: "Usuário não encontrado" });
            }
    
            // Se o usuário não for admin, só pode deletar a si mesmo
            if (!userAdmin && currentUser.dataValues.id !== Number(id)) {
                return res.status(403).send({ error: "Permissão negada" });
            }
    
            await UserController.delete(Number(id));
            return res.status(200).send({ message: "Usuário deletado com sucesso" });
    
        } catch (e) {
            return res.status(400).send({ error: `Erro ao deletar usuário: ${e.message}` });
        }
    }
    

    async findUsers(req, res) {
        try {
            const users = await UserController.find()
            return res.status(200).send(users)
        } catch (e) {
            return res.status(400).send({ error: `Erro ao listar usuário ${e.message}`})
        }
    }

    async findContext(req, res) {
        try {
            const user = await UserController.findUser(req?.session?.id || 0)
            return res.status(200).send(user)
        } catch (e) {
            return res.status(400).send({ error: `Erro ao listar usuário ${e.message}`})
        }
    }

    async login(req, res) {
        const { email, senha } = req.body
        
        try {
            const token = await UserController.login(email, senha)
           return res.status(200).send({ token })
        } catch (e) {
           return res.status(400).send({ error: e.message })
        }
    }
}

module.exports = new UserApi()