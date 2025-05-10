const breed = require("../model/breed");
const breedModel = require("../model/breed");
const axios = require("axios");
class BreedController {

    async getApiBreeds() {
        try {
            const response = await axios.get("https://api.thecatapi.com/v1/breeds");
            const breedsData = response.data;
    
            for (let breed of breedsData) {
                // Busca uma imagem para a raça usando o breed_id
                const imageResponse = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}&limit=1`, {
                    headers: {
                        'x-api-key': 'live_VjHmZzGkhlngtKfw0wW7FlAjrHWNtwQIo1LYie3su2otT1tLJPYF6nVOEmlj2dt7'
                    }
                });
    
                // Define a URL da imagem, se existir
                const imageUrl = imageResponse.data.length > 0 ? imageResponse.data[0].url : "No image";
    
                const newBreed = {
                    breedId: breed.id,
                    name: breed.name,
                    weight: breed.weight.metric,
                    life_span: breed.life_span,
                    origin: breed.origin || "Unknown",
                    temperament: breed.temperament ? breed.temperament.split(",")[0] : "Unknown",
                    image: imageUrl
                };
    
                const existingBreed = await breedModel.findOne({ where: { name: newBreed.name } });
    
                if (!existingBreed) {
                    await breedModel.create(newBreed);
                    console.log(`Raça ${newBreed.name} salva com sucesso!`);
                } else {
                    console.log(`Raça ${newBreed.name} já existe no banco de dados.`);
                }
            }
    
            return { message: "Dados da The Cat API foram processados e salvos no banco de dados." };
        } catch (error) {
            console.error("Erro ao buscar ou salvar raças:", error);
            throw error;
        }
    }
    

    async createBreed(breedId, name, weight, life_span, origin, [...temperament], [...image]) {

        const newBreed = {
            breedId,
            name,
            weight: weight.metric,
            life_span,
            origin,
            temperament: temperament[0],
            image: image[0]
        }
        const responseBreed = await breedModel.create(newBreed);

        return responseBreed;
    }

    async update(breedId, name, weight, life_span, origin, [...temperament], [...image]) {
        const response = await breedModel.findOne({ where: { breedId } });
        if (!response) {
            return undefined;
        }

        const newBreed = {
            name,
            weight: weight.metric,
            life_span,
            origin,
            temperament: temperament[0],
            image: image[0]
        }

        const responseBreed = await breedModel.update(newBreed, { where: { breedId } });

        return responseBreed;
    }

    async delete(breedId) {
        const response = await breedModel.findOne({ where: { breedId } });
        if (!response) {
            return undefined;
        }

        const responseBreed = await breedModel.destroy({ where: { breedId } });
        return responseBreed;
    }

    async list() {
        return breed.findAll()
    }
}

module.exports = new BreedController();