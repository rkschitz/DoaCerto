const UserBreedController = require("../controller/userBreed");
const UserController = require("./user");

class UserBreedApi{
    async createUserBreed(req, res){
        const { userId, breedId, isCreated } = req.body;

        try {
            const responseUserBreed = await UserBreedController.createUserBreed(userId, breedId, isCreated);
            res.status(201).json(responseUserBreed);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    

    async findAll(req, res){
        try {
            const userBreeds = await UserBreedController.findAll();
            res.status(200).json(userBreeds);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async findUserBreed(req, res){
        const { id } = req.params;
        try {
            const userBreed = await UserBreedController.findUserBreed(id);
            res.status(200).json(userBreed);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUserBreed(req, res){
        const { id } = req.params;
        const { userId, breedId } = req.body;
        try {
            const userBreed = await UserBreedController.updateUserBreed(id, userId, breedId);
            res.status(200).json(userBreed);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteUserBreed(req, res){
        const { id } = req.params;
        
        try {
            await UserBreedController.deleteUserBreed(id);
            res.status(204).end();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async listUserBreeds(req, res){
        try {
            const userBreeds = await UserBreedController.listUserBreeds();
            res.status(200).json(userBreeds);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async listUserBreedsByUser(req, res){
        const { id } = req.params;
        try {
            const userBreeds = await UserBreedController.listUserBreedsByUser(id);
            res.status(200).json(userBreeds);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async listUserBreedsByBreed(req, res){
        const { breedId } = req.params;
        try {
            const userBreeds = await UserBreedController.listUserBreedsByBreed(breedId);
            res.status(200).json(userBreeds);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new UserBreedApi()