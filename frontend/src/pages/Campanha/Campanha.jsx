import { useState } from "react"

export default function Campanha() {
    
    const [campanhas, setCampanha] = useState([]);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);

    

    return (
        <div>
            <h1>Campanha</h1>
            <p>Essa é a página de campanha.</p>
        </div>
    )
}