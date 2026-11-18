# Novembro Azul · Cuidar também é força

Experiência educativa responsiva para projeto de extensão de Enfermagem. Conteúdo baseado no banner Novembro Azul: câncer de próstata e saúde integral do homem.

## Executar

Requer Node.js 20.19+ ou 22.12+.

```sh
npm ci
npm run dev
```

## Publicar no Netlify

Conecte o repositório, use `npm run build` como comando de build e `dist` como diretório de publicação. A configuração está em `netlify.toml`. Também é possível enviar a pasta `dist` pelo Netlify Drop após executar `npm run build`.

## Experiência de rolagem

Laço com paralaxe, cena fixa com três capítulos (corpo, mente e atitude), anéis em perspectiva, texto iluminado conforme a rolagem e cartões com movimento de profundidade. O scroll é nativo, inclusive no celular, sem travar a navegação. A preferência por movimento reduzido exibe todos os capítulos em sequência, sem animações.

Os QR Codes serão entregues separadamente; não há seção nem gerador de códigos no site. Os links diretos `#conteudo`, `#quiz` e `#referencias` continuam disponíveis.

## Conteúdo e acessibilidade

O quiz tem 8 questões, feedback, pontuação, revisão e reinício. Perguntas e fontes ficam em `src/content.js`. Não coleta dados nem usa cadastro. Animações respeitam a preferência por movimento reduzido. Navegação por teclado, contraste, layout responsivo estão incluídos. O laço é um SVG e o esquema da próstata é simplificado e educativo.

Os exames são apresentados como decisão informada, conforme INCA e Ministério da Saúde, evitando recomendar rastreamento populacional de rotina. A equipe docente deve revisar o conteúdo antes da apresentação. Não foram inventadas referências bibliográficas ou artigos.

Identificação transcrita do banner: turma ENF251N01-ZSU; docente Cleomirtes da Silva Sales. Nomes das integrantes, período e título formal podem ser adicionados quando fornecidos.
