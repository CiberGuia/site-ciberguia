const $buttonStartQuest = document.querySelector(".start-quiz") // pegando elemento já existente no html -- Variavel para identificar essse elemento.
const $containerPerguntas = document.querySelector(".container-perguntas")
const $respostasContainer = document.querySelector(".respostas-container")
const $perguntaDescricao = document.querySelector(".perguntas")
const $btProxPergunta = document.querySelector(".prox-pergunta")



$buttonStartQuest.addEventListener("click", startQuest) // aciona o evento de comerçar o quiz
$btProxPergunta.addEventListener("click", $mostrarProxPergunta) // aciona envento de próxima pergunta



let perguntaAtual = 0 // Variável auxilar para marcar a pergunta atual
let totalCorrect = 0 // variável para contablizar as respostas corretas
let acertosPorCategoria = {} // Variável para adicionar o controle de acertos por categoria -- NOVO
let perguntasEmbaralhadas = [] // Variável para lidar com as perguntas embaralhadas 



function embaralharArray(array) {
  const copia = [...array]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}



function startQuest() {
  $buttonStartQuest.classList.add("esconde-elemento") // adicionando a classe esconde elemento no botão começar quiz para esconde-lo 
  $containerPerguntas.classList.remove("esconde-elemento") // removendo a classe esconde-elemento para que classe container (div) perguntas volte aparecer (está escondida por padrão)
  document.body.classList.add("quiz-iniciado")

  // Embaralhar perguntas antes de começar
  const NUMERO_DE_PERGUNTAS = 12
  perguntasEmbaralhadas = embaralharArray(perguntas).slice(0, NUMERO_DE_PERGUNTAS)

  $mostrarProxPergunta()

}

function $mostrarProxPergunta() {
  resetaQuiz()

  if (perguntasEmbaralhadas.length == perguntaAtual) {

    return terminaQuiz()

  } // se o tamanho das perguntas tiver o mesmo tamanho da variavel perguntaAtual significa que o quiz chegou ao fim 


  $perguntaDescricao.textContent = perguntasEmbaralhadas[perguntaAtual].pergunta // Definindo conteudo que o elemento terá + acessando a variavel que guarda as perguntas
  perguntasEmbaralhadas[perguntaAtual].respostas.forEach(respostas => {
    const novaResposta = document.createElement("button")
    novaResposta.classList.add("button-quiz", "resposta")
    novaResposta.textContent = respostas.text
    if (respostas.correct) {
      novaResposta.dataset.correct = respostas.correct
    }


    $respostasContainer.appendChild(novaResposta)
    novaResposta.addEventListener("click", respSelecionada)
  })


  document.querySelector(".contador-pergunta").textContent =
    `Pergunta ${perguntaAtual + 1} de ${perguntasEmbaralhadas.length}`

  const progressoAtual = Math.floor((perguntaAtual / perguntasEmbaralhadas.length) * 100)
  document.querySelector(".progresso-barra").style.width = `${progressoAtual}%`

}   // Descrição do bloco de código:
// Acessando cada uma das respostas pelo for each. 
// Criando um elemento button para cada resposta
// classes button-quiz" e "resposta adicionadas elemento button criado
// acessando o texto do novo botão pelo text
// usando o if para validar a resposta
// criando uma variável com valor (data attribute) no elemento html para acessar posteriormente no js
// obtendo a resposta com o contéudo
// adicionando o envento para saber se clicou na resposta certa ou não


function resetaQuiz() {
  // Limpa respostas antigas
  while ($respostasContainer.firstChild) {
    $respostasContainer.removeChild($respostasContainer.firstChild)
  }

  // Remove estilos visuais anteriores
  const quizContainer = document.querySelector(".container-quiz")
  quizContainer.classList.remove("correct", "incorrect")

  // Esconde botão de próxima pergunta
  $btProxPergunta.classList.add("esconde-elemento")
}



// NOVA FUNÇÃO COM CATEGORIA DE PERGUNTAS INSERIDA. 
function respSelecionada(event) {
  const respEscolhida = event.target
  const categoriaAtual = perguntasEmbaralhadas[perguntaAtual].categoria

  const correta = respEscolhida.dataset.correct

  if (correta) {
    totalCorrect++

    if (!acertosPorCategoria[categoriaAtual]) {
      acertosPorCategoria[categoriaAtual] = 1
    } else {
      acertosPorCategoria[categoriaAtual]++
    }
  }

  document.querySelectorAll(".resposta").forEach(button => {
    const isCorrect = button.dataset.correct

    if (button === respEscolhida && !isCorrect) {
      button.classList.add("incorrect") // Resposta errada clicada
    }

    if (isCorrect) {
      button.classList.add("correct") // Resposta certa
    }

    button.disabled = true
  })

  $btProxPergunta.classList.remove("esconde-elemento")
  perguntaAtual++
}



// verificar se o usuario escolheu ou não a resposta correta (Saber em qual botão foi clicado)
// event.target = elemento que o usuario clicou 
// armazenando o elemento clicado na const respostaEscolhida
// validar se o botão foi clicado foi a resposta correta ou não, pelo dataset 
// selecionando todos os elementos que tenham a classe "resposta"
// será analisado um botão de cada vez pelo for each 
// removendo a classe "esconde-elemento" para o botão de próxima pergunta ficar visivel
// realizando incremento na variável perguntaAtual


// NOVA FUNÇÃO TERMINA QUIZ COM AVALIAÇÃO DE DESEMPENHO ATUALIZADA
function terminaQuiz() {
  const totalPerguntas = perguntasEmbaralhadas.length
  const desempenho = Math.floor((totalCorrect / totalPerguntas) * 100)

  let mensagem = ""

  switch (true) {
    case desempenho >= 90:
      mensagem = "Você foi excelente, parabéns!"
      break
    case desempenho >= 70:
      mensagem = "Muito bom!"
      break
    case desempenho >= 50:
      mensagem = "Bom!"
      break
    default:
      mensagem = "Você pode melhorar..."
  }

  // Cria relatório por categoria
  let relatorioTemas = "<ul>"
  const categorias = [...new Set(perguntasEmbaralhadas.map(p => p.categoria))]

  categorias.forEach(categoria => {
    const totalNaCategoria = perguntasEmbaralhadas.filter(p => p.categoria === categoria).length
    const acertos = acertosPorCategoria[categoria] || 0
    const percentual = Math.floor((acertos / totalNaCategoria) * 100)

    let dica = ""
    if (percentual === 100) {
      dica = "🏆 Excelente!"
    } else if (percentual >= 60) {
      dica = "✅ Bom desempenho!"
    } else {
      dica = "⚠️ Recomendamos revisar esse tema."
    }

    // Torna o nome da categoria mais legível
    const nomeFormatado = categoria.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())

    relatorioTemas += `<li><strong>${nomeFormatado}</strong>: ${acertos}/${totalNaCategoria} acertos (${percentual}%) – ${dica}</li>`
  })

  relatorioTemas += "</ul>"

  $containerPerguntas.innerHTML = `
    <p class="mensagem-final">
      Você acertou ${totalCorrect} de ${totalPerguntas} perguntas!
      <br><span><strong>Resultado geral:</strong> ${mensagem}</span>
      <br><br>
      <strong>Desempenho por tema:</strong>
      ${relatorioTemas}
    </p>

    <button onclick="window.location.reload()" class="button-quiz">Refazer Quiz</button>
  `
}
// Realizando a validação do quiz + recarregando a página para o usuario tentar novamente 



// Perguntas e respostas: -- NOVO

const perguntas = [

  //  Ameaças Digitais

  {
    categoria: "ameacas_digitais",
    pergunta: "Qual a melhor maneira de se proteger contra malware?",
    respostas: [
      { text: "Instalar um software antivírus e antispyware confiável.", correct: false },
      { text: "Evitar baixar arquivos de sites desconhecidos.", correct: false },
      { text: "Manter o sistema operacional e os softwares atualizados.", correct: false },
      { text: "Todas as alternativas acima.", correct: true }
    ]
  },
  {
    categoria: "ameacas_digitais",
    pergunta: "O que é phishing?",
    respostas: [
      { text: "Um tipo de malware que criptografa seus arquivos e exige um resgate.", correct: false },
      { text: "Uma técnica que tenta induzir você a fornecer informações confidenciais para golpistas.", correct: true },
      { text: "Um vírus que se replica e infecta outros arquivos automaticamente.", correct: false },
      { text: "Uma rede de computadores controlados remotamente por hackers.", correct: false }
    ]
  },
  {
    categoria: "ameacas_digitais",
    pergunta: "Você recebe um e-mail informando que sua conta será bloqueada em 24h, com um link para atualizar seus dados. O que deve fazer?",
    respostas: [
      { text: "Clicar no link rapidamente e informar os dados para evitar o bloqueio.", correct: false },
      { text: "Responder o e-mail para confirmar a urgência do pedido.", correct: false },
      { text: "Ignorar o e-mail e ligar diretamente para o canal oficial da empresa.", correct: true },
      { text: "Encaminhar para amigos para que eles também fiquem alertas.", correct: false }
    ]
  },
  {
    categoria: "ameacas_digitais",
    pergunta: "O que caracteriza um ransomware?",
    respostas: [
      { text: "Programa que coleta dados de navegação para mostrar anúncios.", correct: false },
      { text: "Software que registra as teclas digitadas pelo usuário.", correct: false },
      { text: "Código malicioso que se disfarça como aplicativo legítimo.", correct: false },
      { text: "Malware que bloqueia o acesso aos dados e exige resgate.", correct: true }
    ]
  },


  //  Privacidade & Conectividade

  {
    categoria: "privacidade_conectividade",
    pergunta: "Quais são os principais riscos de usar redes Wi-Fi públicas não protegidas?",
    respostas: [
      { text: "Seus dados podem ser interceptados por cibercriminosos.", correct: true },
      { text: "Risco de navegar de forma anônima pela internet.", correct: false },
      { text: "Risco nenhum, redes públicas são seguras.", correct: false },
      { text: "Todas as alternativas acima.", correct: false }
    ]
  },
  {
    categoria: "privacidade_conectividade",
    pergunta: "O que fazer se você receber um e-mail suspeito?",
    respostas: [
      { text: "Abrir o email e clicar em todos os links.", correct: false },
      { text: "Responder ao email com suas informações confidenciais.", correct: false },
      { text: "Excluir o email imediatamente sem abri-lo.", correct: true },
      { text: "Encaminhar o email para um amigo para que ele possa clicar nos links.", correct: false }
    ]
  },


  {
    categoria: "privacidade_conectividade",
    pergunta: "Qual das práticas abaixo é mais segura ao utilizar uma rede Wi-Fi pública?",
    respostas: [
      { text: "Acessar a conta do banco rapidamente antes de sair do local.", correct: false },
      { text: "Utilizar uma VPN ao se conectar e evitar sites com dados sensíveis.", correct: true },
      { text: "Desativar o antivírus para acelerar a conexão.", correct: false },
      { text: "Fazer login em sites de compras sem se preocupar.", correct: false }
    ]
  },

  {
    categoria: "privacidade_conectividade",
    pergunta: "O que você deve fazer ao descobrir que sua senha foi vazada em um vazamento de dados?",
    respostas: [
      { text: "Ignorar, já que provavelmente ninguém vai usá-la.", correct: false },
      { text: "Trocar a senha apenas se notar algo estranho na conta.", correct: false },
      { text: "Alterar a senha imediatamente e ativar autenticação em duas etapas.", correct: true },
      { text: "Desinstalar o aplicativo onde a senha foi usada.", correct: false }
    ]
  },


  // Dispositivos Móveis

  {
    categoria: "dispositivos_moveis",
    pergunta: "Quais os principais riscos de ter o celular roubado?",
    respostas: [
      { text: "Perda de dados pessoais como fotos e mensagens.", correct: false },
      { text: "Realização de compras online em seu nome.", correct: false },
      { text: "Acesso a contas bancárias e envio de mensagens fraudulentas.", correct: false },
      { text: "Todas as alternativas acima.", correct: true }
    ]
  },
  {
    categoria: "dispositivos_moveis",
    pergunta: "Qual a importância de manter o software do seu dispositivo atualizado?",
    respostas: [
      { text: "Para corrigir falhas de segurança e proteger contra vulnerabilidades.", correct: true },
      { text: "Para liberar espaço na memória do dispositivo.", correct: false },
      { text: "Para ter acesso a novos emojis e apps.", correct: false },
      { text: "Para evitar atualizações automáticas do sistema.", correct: false }
    ]
  },


  {
    categoria: "dispositivos_moveis",
    pergunta: "Qual medida ajuda a evitar a instalação de aplicativos maliciosos em seu celular?",
    respostas: [
      { text: "Instalar apenas apps de sites que oferecem links promocionais.", correct: false },
      { text: "Permitir qualquer app desconhecido se for gratuito.", correct: false },
      { text: "Instalar somente pela loja oficial (Play Store, App Store) e verificar permissões do app.", correct: true },
      { text: "Ignorar permissões solicitadas ao instalar um app.", correct: false }
    ]
  },

  {
    categoria: "dispositivos_moveis",
    pergunta: "Se seu celular for perdido ou roubado, o que você deve fazer imediatamente?",
    respostas: [
      { text: "Esperar alguém ligar para devolvê-lo.", correct: false },
      { text: "Postar nas redes sociais pedindo ajuda.", correct: false },
      { text: "Bloquear remotamente e mudar senhas de contas acessadas pelo aparelho.", correct: true },
      { text: "Comprar outro celular e esquecer o problema.", correct: false }
    ]
  },



  //  Segurança Financeira

  {
    categoria: "seguranca_financeira",
    pergunta: "Qual a melhor forma de proteger seus dados de cartão de crédito ao fazer compras online?",
    respostas: [
      { text: "Deixar os dados salvos apenas em sites que confia.", correct: false },
      { text: "Utilizar cartões de crédito virtuais ou serviços de pagamento seguros.", correct: true },
      { text: "Compartilhar os dados com pessoas próximas.", correct: false },
      { text: "Todas as alternativas acima.", correct: false }
    ]
  },
  {
    categoria: "seguranca_financeira",
    pergunta: "O que você deve fazer se notar uma transação suspeita em sua conta bancária?",
    respostas: [
      { text: "Aguardar o banco estornar automaticamente.", correct: false },
      { text: "Atualizar o aplicativo bancário.", correct: false },
      { text: "Entrar em contato com o banco e trocar a senha bancária.", correct: true },
      { text: "Desinstalar o aplicativo e reinstalar novamente.", correct: false }
    ]
  },

  {
    categoria: "seguranca_financeira",
    pergunta: "Como se proteger de boletos falsos ao fazer pagamentos online?",
    respostas: [
      { text: "Conferindo o valor, vencimento e pagando dentro do prazo para evitar multas.", correct: false },
      { text: "Baixando o boleto diretamente do link recebido no e-mail da empresa.", correct: false },
      { text: "Confirmando se os dados do beneficiário e banco estão corretos antes do pagamento.", correct: true },
      { text: "Conferindo se o número do código de barras começa com o mesmo dígito dos boletos anteriores.", correct: false }
    ]
  },

  {
    categoria: "seguranca_financeira",
    pergunta: "Qual prática ajuda a proteger seus dados ao fazer compras online?",
    respostas: [
      { text: "Digitar os dados do cartão em qualquer site com boa aparência.", correct: false },
      { text: "Preferir pagamentos por boleto para evitar fraudes.", correct: false },
      { text: "Verificar se o site possui conexão segura (https) e utilizar cartões virtuais.", correct: true },
      { text: "Evitar compras à noite ou em fins de semana.", correct: false }
    ]
  },



  //  Plataformas Sociais

  {
    categoria: "plataformas_sociais",
    pergunta: "O que fazer se você receber uma mensagem suspeita pedindo suas informações confidenciais?",
    respostas: [
      { text: "Responder com suas informações confidenciais.", correct: false },
      { text: "Ligar para a empresa para confirmar a solicitação.", correct: false },
      { text: "Ignorar a mensagem e excluí-la imediatamente.", correct: true },
      { text: "Encaminhar a mensagem para um amigo para ver o que ele acha.", correct: false }
    ]
  },

  {
    categoria: "plataformas_sociais",
    pergunta: "Qual das ações abaixo representa um risco ao usar redes sociais?",
    respostas: [
      { text: "Aceitar solicitações de amizade de perfis desconhecidos", correct: true },
      { text: "Utilizar autenticação de dois fatores (2FA)", correct: false },
      { text: "Ajustar as configurações de privacidade da conta", correct: false },
      { text: "Compartilhar apenas conteúdos inofensivos e públicos", correct: false }
    ]
  },


  {
    categoria: "plataformas_sociais",
    pergunta: "Qual atitude ajuda a evitar golpes em redes sociais?",
    respostas: [
      { text: "Responder rapidamente mensagens de conhecidos pedindo ajuda financeira.", correct: false },
      { text: "Verificar a identidade da pessoa em outro canal antes de tomar qualquer ação.", correct: true },
      { text: "Acreditar na mensagem se vier com nome e foto conhecidos.", correct: false },
      { text: "Compartilhar o pedido com outros amigos para ajudar mais rápido.", correct: false }
    ]
  },


  {
    categoria: "plataformas_sociais",
    pergunta: "Carla postou uma foto do crachá com nome, empresa e cargo. Qual o maior risco disso nas redes sociais?",
    respostas: [
      { text: "Atrair contatos profissionais interessados no seu trabalho.", correct: false },
      { text: "Receber mais curtidas e engajamento por ser transparente.", correct: false },
      { text: "Ser alvo de golpes que usam seus dados para se passar por ela ou sua empresa.", correct: true },
      { text: "Perder o crachá ou ser demitida por usar redes sociais no trabalho.", correct: false }
    ]
  }


]

