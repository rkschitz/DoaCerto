const userBreedModel = require('../model/userBreed');
const Breed = require('../model/breed');
const User = require('../model/user');

class UserBreedController {
    async createUserBreed(userId, breedId, isCreated) {
        if (!userId || !breedId || isCreated === undefined) {
            throw new Error("userId, breedId e isCreated são obrigatórios.");
        }

        const responseExistUserBreed = await userBreedModel.findAll({where:{
            userId,
            breedId
        }})

        if(responseExistUserBreed.length > 0){
            throw new Error("Raça ja favoritada")
        }

        const newUserBreed = {
            userId,
            breedId,
            isCreated
        };
        const responseUserBreed = await userBreedModel.create(newUserBreed);
        return responseUserBreed;
    }

    async findUserBreed(id) {
        if (id === undefined) {
            throw new Error("Id é obrigatório.");
        }
        const userBreed = await userBreedModel.findByPk(id);
        if (!userBreed) {
            throw new Error("Relação não encontrada.");
        }
        return userBreed;
    }

    async updateUserBreed(id, userId, breedId) {
        const oldUserBreed = await this.findUserBreed(id);
        oldUserBreed.userId = userId || oldUserBreed.userId;
        oldUserBreed.breedId = breedId || oldUserBreed.breedId;
        await oldUserBreed.save();
        return oldUserBreed;
    }

    async deleteUserBreed(id) {
        if (id === undefined) {
            throw new Error("Id é obrigatório.");
        }
        const userBreed = await this.findUserBreed(id);
        await userBreed.destroy();
    }

    async listUserBreeds() {
        const userBreeds = await userBreedModel.findAll();
        return userBreeds;
    }

    async listUserBreedsByUser(id) {
        const userBreeds = await userBreedModel.findAll({
            where: { userId: id },
            include: [{
                model: Breed,
                as: 'breed',
                attributes: ['breedId', 'name', 'image']
            }]
        });

        const formattedBreeds = userBreeds.map(userBreed => ({
            id: userBreed.id,
            breedId: userBreed.breed.breedId, // Correção no acesso ao atributo
            name: userBreed.breed.name,
            image: userBreed.breed.image
        }));

        return formattedBreeds;
    }

    async listUserBreedsByBreed(breedId) {
        if (breedId === undefined) {
            throw new Error("Id é obrigatório.");
        }
        const userBreeds = await userBreedModel.findAll({ where: { breedId } });
        return userBreeds;
    }

    async findAll() {
        return await userBreedModel.findAll({
            include: [{
                model: Breed,
                as: 'breed',
                attributes: ['breedId', 'name', 'image']
            }, {
                model: User,
                as: 'user',
                attributes: ['id', 'nome', 'email']
            }]
        });
    }
}

module.exports = new UserBreedController();
