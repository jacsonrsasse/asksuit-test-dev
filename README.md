# Test Dev Asksuite

Projeto de criação de uma API que será requisitada em uma busca pela cotação dos preços de quartos de um determinado hotel, conforme período de estadia definido pelo viajante.

#### Clone do projeto

> git clone git@github.com:jacsonrsasse/asksuit-test-dev.git

Lembrar de renomear o arquivo de exemplo das variáveis de ambiente.

> npm install
> npm run dev

##### Requisição

-   Deve ser feita no endpoint `/search`

<pre>
  {
      "checkin": "YYYY-MM-DD", // Check-in date
      "checkout": "YYYY-MM-DD" // Check-out date
  }
</pre>

Exemplo

<pre>
  {
      "checkin": "2023-04-03",
      "checkout": "2023-04-08"
  }
</pre>
