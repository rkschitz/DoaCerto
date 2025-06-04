const jwt = require("jsonwebtoken");
const organizacao = require('../controller/organizacao')

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(400).json({ error: "Token não fornecido" });
    }

    jwt.verify(token, "doacerto", async (err, decoded) => {
      try {
        if (err) {
          return res.status(401).json({ error: "Token inválido" });
        }

        const organizaoLogada = await organizacao.buscarPorId(decoded.idOrganizacao)

        if (!organizaoLogada) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if (roles.length && !roles.includes(organizaoLogada.dataValues.role)) {
          return res.status(403).json({ error: "Sem permissão" });
        }

        req.session = decoded;

        next();
      } catch (e) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
    });
  }
}

module.exports = authMiddleware;