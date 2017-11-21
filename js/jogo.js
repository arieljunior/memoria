var acertos = 0;
var carta1_selecionada = null;
var carta2_selecionada = null;
var vetor_para_verificar_ponto = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
var cartas = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var control_click_start_game = true;
var control_click_stop_game = false;
var isGameRestart = true;
var jogadores = JSON.parse(localStorage.getItem('jogadores'));
var jogador = localStorage.getItem('player');

function montarTabelaRank(){

 function porCentesimo(tempo1, tempo2) {
   return tempo1.tempo > tempo2.tempo;
 }

  jogadores.sort(porCentesimo);

  var cssLinha = 'odd';
  var posicao = 1;
  for (var i = 0; i < jogadores.length; i++) {
    $('#dados-tabela').append('<tr class="'+cssLinha+'"> <td class="col-xs-1">'+posicao+'</td> <td class="col-xs-7">'+jogadores[i]['nome']+'</td> <td class="col-xs-1">'+jogadores[i]['tempo']+'</td></tr>');
    if (cssLinha == 'odd') {
      cssLinha = 'even';
    }
    posicao++;
  }
}

function montarTabuleiro()
{
    embaralhar(cartas);

    for (var i = 0; i < cartas.length; i++)
    {
      $('#tabuleiro').append('<div class="card" id="'+cartas[i]+'"><div class="front"><div class="carta-costas"></div></div><div class="back"><div id="carta'+cartas[i]+'" class="carta"></div></div></div>');
      $('#carta'+cartas[i]).css({'background-image': 'url("./img/'+cartas[i]+'.png")','transition': '1.5s'});
      if (i == 3 || i == 7 || i == 11 || i == 15)
      {
        $('#tabuleiro').append('<br class="linha">');
      }
    }

    $(".card").flip({
      axis: 'y',
      trigger: 'manual',
      reverse: true
    });

    // setTimeout(function()
    // {
    //   $(".carta").css({'background-image': 'url("./img/carta_costas.png")'});
    // },2000);
}

function embaralhar(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex)
   {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function virarCarta(carta_id)
{
  $("#"+carta_id).flip(true);
}

function esconderCarta(carta_id)
{
  $("#"+carta_id).flip(false);
}

function testarCarta(obj)
{
    //Checa a condição inicial da primeira carta se está vazia
    if (carta1_selecionada == null)
    {
      carta1_selecionada = obj.id;
      $('#'+carta1_selecionada).unbind('click'); //Desabilita o click
      virarCarta(carta1_selecionada);
    }
    else
    {
      //Código para exibir a segunda carta
      carta2_selecionada = obj.id;
      virarCarta(carta2_selecionada);

      $('.card').unbind('click'); //Desabilita o click de todas as cartas

      setTimeout(function(){ //função para o codigo abaixo ser executado depois de um tempo

        //Uso o id da carta como index do vetor (vetor_para_verificar_ponto) para identificar se os valores são iguais
        //OBS.: o vetor tem 16 posições e os valores se repetem a partir da 7 posição
        if (vetor_para_verificar_ponto[carta1_selecionada] === vetor_para_verificar_ponto[carta2_selecionada])
        {
          acertos += 1;
          $('#'+carta1_selecionada).addClass('pontuada');
          $('#'+carta2_selecionada).addClass('pontuada');

          carta1_selecionada = null;
          carta2_selecionada = null;
          $('.card').click(function(){ //Devolver o click das cartas
            testarCarta(this);
          });

        }
        else
        {
          esconderCarta(carta1_selecionada);
          esconderCarta(carta2_selecionada);
          carta1_selecionada = null;
          carta2_selecionada = null;
          $('.card').click(function(){
            testarCarta(this);
          });

        }

        //TESTAR SE O JOGO TERMINOU
        if (acertos == 8)
        {
          pararCronometro();
          $('#stop_game').addClass('disabled');

          $('.card').unbind('click');

          for (var i = 0; i < jogadores.length; i++)
          {
            if (jogadores[i]['nome'] == jogador)
            {
              jogadores[i]['tempo'] = centessimo_total;
              localStorage.setItem('jogadores', JSON.stringify(jogadores));
            }
          }

          if (centessimo_total < localStorage.getItem('centessimo') || localStorage.getItem('centessimo') == null)
          {
              alert('Novo record. Parabéns!!! Seu tempo foi'+'\nMinutos: '+minutos+'\nSegundos: '+segundos);
              localStorage.setItem('centessimo', centessimo_total);
              location.reload(true);
          }
          else
          {
              alert('Jogo terminado. Seu tempo foi'+'\nMinutos: '+minutos+'\nSegundos: '+segundos);
              location.reload(true);
          }



        }
      },1000);
    }
}

function reiniciarJogo()
{
  reiniciarCronometro();
  $('.linha').remove();
  $('.card').remove();
  $('.pontuada').remove();
  acertos = 0;
  carta1_selecionada = null;
  carta2_selecionada = null;
}

function comecarJogo()
{
    montarTabuleiro();

    setTimeout(function()
    {

      $('.card').click(function()
      {
        testarCarta(this);
      });

      ativarCronometro();
      control_click_stop_game = true;
      control_click_start_game = true;
      $('#stop_game').removeClass('disabled');
    },3000);
}

$(function()
{
  montarTabelaRank();


  $('#player').text(jogador);



  $('#start_game').click(function() {
    if (control_click_start_game)
    {
      control_click_start_game = false;

      if (isGameRestart)
      {
        isGameRestart = false;
        reiniciarJogo();
        comecarJogo();
        $('#icon-play').removeClass('glyphicon-play').addClass('glyphicon-repeat');
      }
      else
      {
        reiniciarJogo();
        comecarJogo();
      }
    }
  });
  $('#stop_game').click(function(){
    if (control_click_stop_game)
    {
      $('.card').unbind('click');
      $('#icon-play').removeClass('glyphicon-repeat').addClass('glyphicon-play');
      $('#stop_game').addClass('disabled');
      pararCronometro();
      isGameRestart = true;
    }
  });
});
