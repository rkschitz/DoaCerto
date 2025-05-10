const pessoaModel = require("../model/pessoa");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "doacerto";
const SALT_VALUE = 10;

class PersonController {
    async createPerson(CPF, name, email, password, number, birthdate, role) {
        const senhaCriptografada = await bcrypt.hash(String(password), SALT_VALUE);

        try {
            const personValue = await personModel.create({
                CPF,
                name,
                email,
                password: senhaCriptografada,
                number,
                birthdate,
                role
            });
            return personValue;
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async updatePerson(idPerson, CPF, name, email, password, number, birthdate, role, ieSituation) {
        const oldPerson = await personModel.findOne({
            where: { idPerson }
        });

        if(email){
            const sameEmail = await personModel.findOne({ where: { email } });
            if (sameEmail && sameEmail.idPerson !== idPerson) {
                throw new Error("Email já cadastrado.");
            }
        }

        oldPerson.CPF = CPF || oldPerson.CPF;
        oldPerson.name = name || oldPerson.name;
        oldPerson.email = email || oldPerson.email;
        oldPerson.role = role || oldPerson.role;
        oldPerson.password = password
            ? await bcrypt.hash(String(password), SALT_VALUE)
            : oldPerson.password;
        oldPerson.number = number || oldPerson.number;
        oldPerson.birthdate = birthdate || oldPerson.birthdate;
        oldPerson.ieSituation = ieSituation || oldPerson.ieSituation;
        oldPerson.save();
    }

    async searchPersons() {
        const personValue = await personModel.findAll();
        return personValue;
    }

    async buscarPessoa(idPerson) {
        const personValue = await personModel.findOne({
            where: { idPerson }
        });
        return personValue;
    }

    async findPersonById(idPerson) {
        const personValue = await personModel.findOne({
            where: { idPerson }
        });
        return personValue
    }

    async deletePerson(idPerson) {
        if(!idPerson){
            throw new Error("Id é obrigatório.");
        }

        const personValue = await personModel.findOne({where: { idPerson }});

        await personValue.destroy();
    }

    async login(email, password) {
        if (!email || !password) {
            return { mensagem: "Email e senha são obrigatórios" };
        }

        const personValue = await personModel.findOne({
            where: { email }
        });


        if (!personValue) {
            return { mensagem: "Usuário não encontrado" };
        }

        if (personValue.ieSituacao === "I") {
            return { mensagem: "Usuário inativo" };
        }

        const senhaCorreta = await bcrypt.compare(password, personValue.password);

        if (!senhaCorreta) {
            return { mensagem: "Senha incorreta" };
        }

        const token = jwt.sign({ idPerson: personValue.idPerson, role: personValue.role }, SECRET_KEY, { expiresIn: "1h" });
        // const permissoes = await rolePessoaController.buscarPermissoes(personValue.idPerson);

        return { token };

    }
}

module.exports = new PersonController()