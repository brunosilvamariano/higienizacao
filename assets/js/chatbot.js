/* ===================================
   LÓGICA DO CHATBOT WHATSAPP
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('whatsapp-fixed-button');
    const chatContainer = document.getElementById('chatbot-container');
    const closeButton = document.getElementById('chatbot-close-btn');
    const chatBody = document.getElementById('chatbot-body');
    const chatInput = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send-btn');
    const phoneNumber = '5547991597258'; // Número de WhatsApp da página

    // --- Conteúdo e Lógica do Chatbot ---
    const CHAT_CONTENT = {
        GREETING: {
            text: "Olá! Eu sou o assistente virtual da Higienização e Impermeabilização. Como posso te ajudar hoje?",
            options: [
                { text: "Quero saber sobre os Serviços", value: "SERVICOS" },
                { text: "Como funciona o processo?", value: "PROCESSO" },
                { text: "Quero um Orçamento / Falar com Atendente", value: "ORCAMENTO" },
                { text: "Dúvidas Frequentes (FAQ)", value: "FAQ" }
            ]
        },
        SERVICOS: {
            text: "Temos 3 serviços principais. Qual deles te interessa?",
            options: [
                { text: "Limpeza de Colchão", value: "COLCHAO" },
                { text: "Impermeabilização de Estofados", value: "IMPERMEABILIZACAO" },
                { text: "Limpeza de Tapetes e Carpetes", value: "TAPETES" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        PROCESSO: {
            text: "Nosso processo é dividido em 4 etapas: Avaliação, Higienização Profunda, Impermeabilização e Finalização/Garantia. Quer saber mais detalhes de alguma etapa?",
            options: [
                { text: "Avaliação do Estofado", value: "AVALIACAO_DETALHE" },
                { text: "Higienização Profunda", value: "HIGIENIZACAO_DETALHE" },
                { text: "Impermeabilização", value: "IMPERMEABILIZACAO_DETALHE" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        ORCAMENTO: {
            text: "Para um orçamento gratuito e personalizado, clique no botão abaixo. Você será redirecionado para o WhatsApp e um de nossos especialistas irá te atender.",
            options: [
                { text: "Falar com Especialista Agora", value: "WHATSAPP_LINK" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        FAQ: {
            text: "Para as Dúvidas Frequentes, sugiro que você visite nossa seção de FAQ na página. Lá você encontrará respostas para as perguntas mais comuns. Posso te ajudar com outra coisa?",
            options: [
                { text: "Quero um Orçamento", value: "ORCAMENTO" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        COLCHAO: {
            text: "A Limpeza de Colchão remove ácaros, fungos e odores com produtos hipoalergênicos, garantindo um sono mais saudável. Quer agendar ou voltar ao menu?",
            options: [
                { text: "Agendar Limpeza de Colchão", value: "WHATSAPP_LINK_COLCHAO" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        IMPERMEABILIZACAO: {
            text: "A Impermeabilização protege sofás, poltronas e cadeiras contra líquidos e manchas, mantendo o tecido limpo e novo por mais tempo. Quer agendar ou voltar ao menu?",
            options: [
                { text: "Agendar Impermeabilização", value: "WHATSAPP_LINK_IMPERMEABILIZACAO" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        TAPETES: {
            text: "A Limpeza de Tapetes e Carpetes restaura a beleza e remove sujeiras, ácaros e manchas profundas de forma segura e eficiente. Quer agendar ou voltar ao menu?",
            options: [
                { text: "Agendar Limpeza de Tapetes", value: "WHATSAPP_LINK_TAPETES" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        AVALIACAO_DETALHE: {
            text: "Etapa 1: Avaliação do Estofado. Analisamos o tipo de tecido, nível de sujeira e manchas para definir o melhor método. Inclui diagnóstico e escolha do produto ideal.",
            options: [
                { text: "Próxima etapa: Higienização Profunda", value: "HIGIENIZACAO_DETALHE" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        HIGIENIZACAO_DETALHE: {
            text: "Etapa 2: Higienização Profunda. Usamos equipamentos profissionais para remover ácaros, fungos e sujeiras, com lavagem por extratora e neutralização de odores.",
            options: [
                { text: "Próxima etapa: Impermeabilização", value: "IMPERMEABILIZACAO_DETALHE" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        IMPERMEABILIZACAO_DETALHE: {
            text: "Etapa 3: Impermeabilização Profissional. Aplicamos um protetor que repele líquidos e evita manchas, sem alterar o toque ou a cor do tecido. Proteção duradoura.",
            options: [
                { text: "Próxima etapa: Finalização e Garantia", value: "FINALIZACAO_DETALHE" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        FINALIZACAO_DETALHE: {
            text: "Etapa 4: Finalização e Garantia. Inspeção final para garantir sua satisfação. Seu estofado fica limpo, protegido e renovado.",
            options: [
                { text: "Quero um Orçamento", value: "ORCAMENTO" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        },
        UNHANDLED: {
            text: "Desculpe, não entendi sua pergunta. Posso te ajudar com uma das opções abaixo?",
            options: [
                { text: "Serviços", value: "SERVICOS" },
                { text: "Processo", value: "PROCESSO" },
                { text: "Orçamento / Atendente", value: "ORCAMENTO" },
                { text: "Voltar ao menu principal", value: "GREETING" }
            ]
        }
    };

    // --- Funções de Manipulação do DOM e Chat ---

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.innerHTML = text; // Usar innerHTML para suportar quebras de linha e negrito

        messageDiv.appendChild(bubble);
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll para a última mensagem
    }

    function renderOptions(options) {
        // Remove opções anteriores
        const oldOptions = chatBody.querySelectorAll('.options-container');
        oldOptions.forEach(opt => opt.remove());

        if (options && options.length > 0) {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options-container');
            
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.dataset.value = option.value;
                button.addEventListener('click', handleOptionClick);
                optionsContainer.appendChild(button);
            });

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'bot');
            messageDiv.appendChild(optionsContainer);
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    function handleBotResponse(key) {
        const response = CHAT_CONTENT[key] || CHAT_CONTENT.UNHANDLED;
        
        // Se for um link de WhatsApp, abre o link e não envia mensagem no chat
        if (key.startsWith("WHATSAPP_LINK")) {
            let message = "Olá! Gostaria de um orçamento para higienização e impermeabilização.";
            if (key === "WHATSAPP_LINK_COLCHAO") {
                message = "Olá! Gostaria de agendar a Limpeza e Higienização de Colchão.";
            } else if (key === "WHATSAPP_LINK_IMPERMEABILIZACAO") {
                message = "Olá! Gostaria de agendar a Impermeabilização de Estofados.";
            } else if (key === "WHATSAPP_LINK_TAPETES") {
                message = "Olá! Gostaria de agendar a Limpeza e Higienização de Tapetes e Carpetes.";
            }

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Envia uma mensagem de confirmação no chat e volta ao menu
            appendMessage("Você será redirecionado para o WhatsApp com a mensagem pré-preenchida.", 'bot');
            setTimeout(() => {
                handleBotResponse('GREETING');
            }, 1000);
            return;
        }

        // Resposta normal do bot
        appendMessage(response.text, 'bot');
        renderOptions(response.options);
    }

    function handleOptionClick(event) {
        const value = event.target.dataset.value;
        const text = event.target.textContent;

        // Simula o envio da mensagem do usuário
        appendMessage(text, 'user');

        // Remove as opções para evitar cliques duplicados
        const oldOptions = chatBody.querySelectorAll('.options-container');
        oldOptions.forEach(opt => opt.remove());

        // Obtém a resposta do bot
        setTimeout(() => {
            handleBotResponse(value);
        }, 500);
    }

    function handleUserInput() {
        const text = chatInput.value.trim();
        if (text === "") return;

        appendMessage(text, 'user');
        chatInput.value = '';

        // Lógica de processamento de texto (simples, focada em palavras-chave)
        const lowerText = text.toLowerCase();
        let nextKey = 'UNHANDLED';

        if (lowerText.includes('serviço') || lowerText.includes('o que vocês fazem')) {
            nextKey = 'SERVICOS';
        } else if (lowerText.includes('processo') || lowerText.includes('como funciona') || lowerText.includes('etapas')) {
            nextKey = 'PROCESSO';
        } else if (lowerText.includes('orçamento') || lowerText.includes('falar') || lowerText.includes('atendente') || lowerText.includes('whatsapp')) {
            nextKey = 'ORCAMENTO';
        } else if (lowerText.includes('dúvidas') || lowerText.includes('faq')) {
            nextKey = 'FAQ';
        } else if (lowerText.includes('colchão') || lowerText.includes('colchao')) {
            nextKey = 'COLCHAO';
        } else if (lowerText.includes('impermeabilização') || lowerText.includes('impermeabilizacao')) {
            nextKey = 'IMPERMEABILIZACAO';
        } else if (lowerText.includes('tapete') || lowerText.includes('carpete')) {
            nextKey = 'TAPETES';
        } else if (lowerText.includes('olá') || lowerText.includes('oi') || lowerText.includes('menu')) {
            nextKey = 'GREETING';
        }

        setTimeout(() => {
            handleBotResponse(nextKey);
        }, 500);
    }

    // --- Event Listeners ---

    chatButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        if (chatContainer.classList.contains('open')) {
            // Inicia a conversa com a saudação
            if (chatBody.children.length === 0) {
                handleBotResponse('GREETING');
            }
        }
    });

    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('open');
    });

    sendButton.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Adiciona o link do Bootstrap Icons para garantir que os ícones funcionem no chatbot
    const linkIcon = document.createElement('link');
    linkIcon.rel = 'stylesheet';
    linkIcon.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
    document.head.appendChild(linkIcon);
});
