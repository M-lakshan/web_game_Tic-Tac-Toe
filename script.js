const Popup_Panel = document.getElementById('popup_panel');
const Control_Panel = document.getElementById('control_panel');
const Moves_Panel = document.getElementById('contr_moves');
const Content_Panel = document.getElementById('content_panel');
const Score_Panel = document.getElementById('score_panel');

const contr_mode = document.getElementById('mode');
const mode_lable = document.getElementById('mode_lable');
const contr_symbol_n_strike = document.getElementById('contr_symbol_n_strike');

let game_counts = document.querySelectorAll('.game_count');
let colors = document.querySelectorAll('.colors');
let symbols = document.querySelectorAll('.symbol');
let strikes = document.querySelectorAll('.strike');

const result_player_i = document.querySelector('#player_i');
const result_player_ii = document.querySelector('#player_ii');
const player_i = document.querySelector('.player_i');
const player_ii = document.querySelector('.player_ii');

let players = document.querySelectorAll('.players');
let tiles = document.querySelectorAll('.tiles');

const btn_close_popup = document.getElementById('close_popup');
const tag_how_to_play = document.getElementById('how_to_play');
const round_result_i = document.getElementById('round_result_i');
const round_result_ii = document.getElementById('round_result_ii');

let result_title = document.getElementById('result');
let result_title_i = result_title.children[0];
let result_title_ii = result_title.children[1];

let init_count = 1;
let empty_tiles_count;
let empty_tiles_length = [0,0,0,0,0,0,0,0,0];
let ai_tiles = [];
let ai_tile_index = -1;
let ai_tile;
let ai_selected_tile;
let first_time_func_play_continue;
let second_time_func_play_continue;
let next_time_func_play_continue;
let ai_first_func_play_continue;

window.onload = function() {
  Popup_Panel.classList.remove('closed');
  game_counts[0].checked = true;

  if(localStorage.getItem('game_TIX-TAC-TOE_local_storage_set')=='values_set') {
    // continuing rounds
    // after that local storage will reset in 15mins
    (localStorage.getItem('game_TIX-TAC-TOE_local_ply_i_score')!=null) ? result_player_i.children[1].innerHTML = localStorage.getItem('game_TIX-TAC-TOE_local_ply_i_score') : result_player_i.children[1].innerHTML = 0;
    (localStorage.getItem('game_TIX-TAC-TOE_local_ply_ii_score')!=null) ? result_player_ii.children[1].innerHTML = localStorage.getItem('game_TIX-TAC-TOE_local_ply_ii_score') : result_player_ii.children[1].innerHTML = 0;

    setTimeout(() => {
      window.alert('Session Time-Out');  
      localStorage.clear();
      window.location.reload();
    }, 900000);
  } else {
    tiles.forEach(tile => tile.classList.add('ai_tile'));
    localStorage.setItem('game_TIX-TAC-TOE_game_mode', 'AvP');
    localStorage.setItem('game_TIX-TAC-TOE_prv_AI_tile','tile_0');
    localStorage.setItem('game_TIX-TAC-TOE_round_count', 1);
  }
}

game_counts.forEach(game_count => { game_count.nextElementSibling.addEventListener('click', () => localStorage.setItem('game_TIX-TAC-TOE_round_count', game_count.value)) });

mode_lable.addEventListener('click', function() {

  if(contr_mode.checked) {
    player_i.innerHTML = "A.I.";
    result_player_i.children[0].innerText = "AI";
    player_i.classList.add('ai_activated');
    player_ii.innerHTML = "You";
    result_player_ii.children[0].innerText = "You";
    localStorage.setItem('game_TIX-TAC-TOE_game_mode', 'AvP');
    localStorage.setItem('game_TIX-TAC-TOE_prv_AI_tile','tile_0');
    tiles.forEach(tile => { if(!tile.classList.contains('ai_tile')) tile.classList.add('ai_tile'); });
  } else {
    player_i.innerHTML = "You";
    result_player_i.children[0].innerText = "You";
    player_i.classList.remove('ai_activated');
    player_ii.innerHTML = "Challenger";
    result_player_ii.children[0].innerText = "Challenger";
    localStorage.setItem('game_TIX-TAC-TOE_game_mode', 'PvP');
    localStorage.removeItem('game_TIX-TAC-TOE_prv_AI_tile');
    tiles.forEach(tile => tile.classList.remove('ai_tile'));
  }

  if(player_i.classList.contains('gone_gold') || player_ii.classList.contains('gone_gold')) {
    player_i.classList.toggle('gone_gold');
    player_i.classList.toggle('gone_purple');
    player_ii.classList.toggle('gone_gold');
    player_ii.classList.toggle('gone_purple');
  }

  localStorage.setItem('game_TIX-TAC-TOE_ai_tiles_sync',"unset");
});

symbols.forEach(symbol => { 
  symbol.addEventListener('click', function() {
    
    if(!symbol.classList.contains('disabled')) {
      symbol.classList.toggle('selected');
      symbol.classList.add('selected_symbol');
      localStorage.setItem('game_TIX-TAC-TOE_selected_symbol', symbol.innerHTML);
      
      if(symbol.innerHTML=="X") {
        symbol.nextElementSibling.classList.remove('selected');
        symbol.nextElementSibling.classList.remove('gone_purple');
        symbol.nextElementSibling.classList.remove('gone_gold');
        symbol.nextElementSibling.classList.remove('selected_symbol');
        localStorage.setItem('game_TIX-TAC-TOE_opponent_symbol', "O");
      } else {
        symbol.previousElementSibling.classList.remove('selected');
        symbol.previousElementSibling.classList.remove('gone_gold');
        symbol.previousElementSibling.classList.remove('gone_purple');
        symbol.previousElementSibling.classList.remove('selected_symbol');
        localStorage.setItem('game_TIX-TAC-TOE_opponent_symbol', "X");
      }
    }

    if(document.querySelectorAll('.selected_color').length == 1) {
        
      if((document.querySelectorAll('.selected_color')[0].classList)[0] == "gold") {
        symbol.classList.add('gone_gold');
        symbol.classList.remove('gone_purple');
      } else {
        symbol.classList.remove('gone_gold');
        symbol.classList.add('gone_purple');
      }
    }
  }); 
});

strikes.forEach(strike => { 
  strike.addEventListener('click', function() {
      
    if(!strike.classList.contains('disabled')) {
      strike.classList.toggle('selected');
      strike.classList.add('selected_strike');
      localStorage.setItem('game_TIX-TAC-TOE_selected_strike', strike.innerHTML);
      
      if(strike.innerHTML=="You") {
        strike.nextElementSibling.classList.remove('selected_strike');
        strikes[0].nextElementSibling.classList.remove('selected');
        localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"Human");
        
        if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_ii");
        }
        else {
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_i");
        }
      } else {
        strike.previousElementSibling.classList.remove('selected_strike');
        strikes[1].previousElementSibling.classList.remove('selected');
        
        if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") { 
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_i");
          localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"AI");
        } else { 
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_ii");
          localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"Human");
        }
      }
    }
  }); 
});

colors.forEach(color => { 
  color.addEventListener('click', function() {
    if(!color.classList.contains('disabled')) {
      color.classList.add('active');
      color.classList.add('selected_color');
      localStorage.setItem('game_TIX-TAC-TOE_charactor_color', color.classList[0]);
      
      if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") { 
        if(color.classList[0]=="gold") {
          colors[1].classList.remove('selected_color');
          colors[1].classList.remove('active');
          player_i.classList.remove('gone_gold');
          player_i.classList.add('gone_purple');
          player_ii.classList.remove('gone_purple');
          player_ii.classList.add('gone_gold');
          strikes[0].classList.add('gone_gold');
          strikes[0].classList.remove('gone_purple');
          strikes[1].classList.remove('gone_gold');
          strikes[1].classList.add('gone_purple');
          localStorage.setItem('game_TIX-TAC-TOE_opponent_color', "purple");
        } else {
          colors[0].classList.remove('active');
          colors[0].classList.remove('selected_color');
          player_i.classList.remove('gone_purple');
          player_i.classList.add('gone_gold');
          player_ii.classList.remove('gone_gold');
          player_ii.classList.add('gone_purple');
          strikes[0].classList.remove('gone_gold');
          strikes[0].classList.add('gone_purple');
          strikes[1].classList.add('gone_gold');
          strikes[1].classList.remove('gone_purple');
          localStorage.setItem('game_TIX-TAC-TOE_opponent_color', "gold");
        } 
      } else {
        if(color.classList[0]=="gold") {
          colors[1].classList.remove('selected_color');
          colors[1].classList.remove('active');
          player_i.classList.remove('gone_purple');
          player_i.classList.add('gone_gold');
          player_ii.classList.remove('gone_gold');
          player_ii.classList.add('gone_purple');
          strikes[0].classList.add('gone_gold');
          strikes[0].classList.remove('gone_purple');
          strikes[1].classList.remove('gone_gold');
          strikes[1].classList.add('gone_purple');
          localStorage.setItem('game_TIX-TAC-TOE_opponent_color', "purple");
        } else {
          colors[0].classList.remove('active');
          colors[0].classList.remove('selected_color');
          player_i.classList.remove('gone_gold');
          player_i.classList.add('gone_purple');
          player_ii.classList.remove('gone_purple');
          player_ii.classList.add('gone_gold');
          strikes[0].classList.remove('gone_gold');
          strikes[0].classList.add('gone_purple');
          strikes[1].classList.add('gone_gold');
          strikes[1].classList.remove('gone_purple');
          localStorage.setItem('game_TIX-TAC-TOE_opponent_color', "gold");
        } 
      }
    }
  }); 
});

btn_close_popup.addEventListener('click', function() {
  Popup_Panel.querySelector('.instructions').classList.remove('deactive');
  Popup_Panel.querySelector('.how_to_play').classList.add('deactive');
  Popup_Panel.classList.add('closed');  
});

tag_how_to_play.addEventListener('click', function() {
  Popup_Panel.querySelector('.how_to_play').classList.remove('deactive');
  Popup_Panel.querySelector('.instructions').classList.add('deactive');
});

function summery_preview(selected_symbol,game_mode,ply) {
  let symbole_X = document.querySelector('.player_titles').children[0];
  let symbole_O = document.querySelector('.player_titles').children[1];
  let symbole_X_result = document.querySelector('.player_scores').children[0];
  let symbole_O_result = document.querySelector('.player_scores').children[1];

  console.log(ply);
  switch(ply) {
    case "AI":
      {
        if(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol')=="X") {
          if(parseInt(result_player_i.children[1].innerText)==1) {
            symbole_X_result.innerText = result_player_i.children[1].innerText+" round";
          } else {
            symbole_X_result.innerText = result_player_i.children[1].innerText+" rounds";
          }
          if(parseInt(result_player_ii.children[1].innerText)==1) {
            symbole_O_result.innerText = result_player_ii.children[1].innerText+" round";
          } else {
            symbole_O_result.innerText = result_player_ii.children[1].innerText+" rounds";
          }
        } else {
          if(parseInt(result_player_i.children[1].innerText)==1) {
            symbole_O_result.innerText = result_player_i.children[1].innerText+" round";
          } else {
            symbole_O_result.innerText = result_player_i.children[1].innerText+" rounds";
          }
          if(parseInt(result_player_ii.children[1].innerText)==1) {
            symbole_X_result.innerText = result_player_ii.children[1].innerText+" round";
          } else {
            symbole_X_result.innerText = result_player_ii.children[1].innerText+" rounds";
          }
        }
      }
      document.querySelector('.end_result_winner').children[0].innerText = "A.I. is";
    break;
    case "You":
      {
        if(localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="X") {
          if(game_mode=="AvP") {
            if(parseInt(result_player_ii.children[1].innerText)==1) {
              symbole_X_result.innerText = result_player_ii.children[1].innerText+" round";
            } else {
              symbole_X_result.innerText = result_player_ii.children[1].innerText+" rounds";
            }
            if(parseInt(result_player_i.children[1].innerText)==1) {
              symbole_O_result.innerText = result_player_i.children[1].innerText+" round";
            } else {
              symbole_O_result.innerText = result_player_i.children[1].innerText+" rounds";
            }
          } else {
            if(parseInt(result_player_i.children[1].innerText)==1) {
              symbole_X_result.innerText = result_player_i.children[1].innerText+" round";
            } else {
              symbole_X_result.innerText = result_player_i.children[1].innerText+" rounds";
            }
            if(parseInt(result_player_ii.children[1].innerText)==1) {
              symbole_O_result.innerText = result_player_ii.children[1].innerText+" round";
            } else {
              symbole_O_result.innerText = result_player_ii.children[1].innerText+" rounds";
            }
          }
        } else {
          if(game_mode=="AvP") {
            if(parseInt(result_player_ii.children[1].innerText)==1) {
              symbole_O_result.innerText = result_player_ii.children[1].innerText+" round";
            } else {
              symbole_O_result.innerText = result_player_ii.children[1].innerText+" rounds";
            }
            if(parseInt(result_player_i.children[1].innerText)==1) {
              symbole_X_result.innerText = result_player_i.children[1].innerText+" round";
            } else {
              symbole_X_result.innerText = result_player_i.children[1].innerText+" rounds";
            }
          } else {
            if(parseInt(result_player_i.children[1].innerText)==1) {
              symbole_O_result.innerText = result_player_i.children[1].innerText+" round";
            } else {
              symbole_O_result.innerText = result_player_i.children[1].innerText+" rounds";
            }
            if(parseInt(result_player_ii.children[1].innerText)==1) {
              symbole_X_result.innerText = result_player_ii.children[1].innerText+" round";
            } else {
              symbole_X_result.innerText = result_player_ii.children[1].innerText+" rounds";
            }
          }
        }
      }
      document.querySelector('.end_result_winner').children[0].innerText = "You are";
    break;
    case "Challenger":
      {
        if(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol')=="X") {
          if(parseInt(result_player_ii.children[1].innerText)==1) {
            symbole_X_result.innerText = result_player_ii.children[1].innerText+" round";
          } else {
            symbole_X_result.innerText = result_player_ii.children[1].innerText+" rounds";
          }
          if(parseInt(result_player_i.children[1].innerText)==1) {
            symbole_O_result.innerText = result_player_i.children[1].innerText+" round";
          } else {
            symbole_O_result.innerText = result_player_i.children[1].innerText+" rounds";
          }
        } else {
          if(parseInt(result_player_ii.children[1].innerText)==1) {
            symbole_O_result.innerText = result_player_ii.children[1].innerText+" round";
          } else {
            symbole_O_result.innerText = result_player_ii.children[1].innerText+" rounds";
          }
          if(parseInt(result_player_i.children[1].innerText)==1) {
            symbole_X_result.innerText = result_player_i.children[1].innerText+" round";
          } else {
            symbole_X_result.innerText = result_player_i.children[1].innerText+" rounds";
          }
        }
      }
      document.querySelector('.end_result_winner').children[0].innerText = "Opponent is";
    break;
  }

  switch(ply) {
    case "AI":
      {
        if(selected_symbol=="X") {
          symbole_X.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_opponent_color')));
        } else {
          symbole_O.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_opponent_color')));
        }
      }
    break;
    case "You":
      {
        if(selected_symbol=="X") {
          symbole_X.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_charactor_color')));
        } else {
          symbole_O.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_charactor_color')));
        }
      }
    break;
    case "Challenger":
      {
        if(selected_symbol=="X") {
          symbole_X.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_opponent_color')));
        } else {
          symbole_O.classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_opponent_color')));
        }
      }
    break;
  }

  (symbole_X.classList.contains('gone_gold')) ? symbole_O.classList.add('gone_purple') : symbole_O.classList.add('gone_gold');
  (symbole_O.classList.contains('gone_gold')) ? symbole_X.classList.add('gone_purple') : symbole_X.classList.add('gone_gold');

  return 0;
}

function playground_reset(re_command) {
  if(re_command=="func_round_end_opening") {
    tiles.forEach(tile => { 
      tile.innerText=""; tile.classList.add('disabled');
      tile.classList.add('empty_tile'); tile.classList.add('ai_tile');
      tile.classList.remove('gone_gold'); tile.classList.remove('gone_purple');
      tile.classList.remove('won'); tile.classList.add('opc_drain');
      setTimeout(() => { result_title.classList.remove('opc_drain'); }, 2500);
    });
  } else {
    result_title.setAttribute("style","font-size: 14px;");
    result_title.classList.remove('win'); result_title.classList.add('draw');
    setTimeout(() => { result_title.classList.add('opc_drain'); }, 2800);
    setTimeout(() => {
      tiles.forEach(tile => { 
        tile.innerText=""; tile.classList.remove('disabled');
        tile.classList.add('empty_tile'); 
        tile.classList.remove('gone_gold'); tile.classList.remove('gone_purple');
        tile.classList.remove('won'); tile.classList.remove('opc_drain');
      });
  
      result_title_i.innerText = ""; result_title_ii.innerText = ""; result_title.classList.remove('opc_drain');
      result_title.classList.remove('draw'); result_title.classList.remove('win'); result_title.removeAttribute("style");
      
      document.querySelector('.next_play_toggle').classList.add('active');

      if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
        ai_tiles = [];
        one_time_ai_tile_select();
        ai_tiles = ai_tiles.reverse();
        if(document.querySelector('.next_play_toggle').classList.contains('player_i')) {
          first_time_AI_play();
        } else { 
          document.querySelector('.next_play_toggle').classList.remove('next_play_toggle');
        }
      } else {
        if(document.querySelector('.next_play_toggle').classList.contains('player_ii')) {
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_ii");
        } else {
          localStorage.setItem('game_TIX-TAC-TOE_player',"player_i");
        }
        document.querySelector('.next_play_toggle').classList.remove('next_play_toggle');
      }
    }, 4300);
  }

  return 0;
}

function round_end(round_sts) {
  let ls_p_i_score = localStorage.getItem('game_TIX-TAC-TOE_local_ply_i_score');
  let ls_p_ii_score = localStorage.getItem('game_TIX-TAC-TOE_local_ply_ii_score');
  let playground_reset_sts;

  setTimeout(() => { 
    result_title.classList.add('opc_drain');
    setTimeout(() => { result_title_i.innerText = ""; result_title_ii.innerText = ""; result_title.classList.remove('opc_drain'); }, 1790);
  }, 3500);
    
  switch(localStorage.getItem('game_TIX-TAC-TOE_round_count')) {
    case "1" : playground_reset_sts = "game-over"; localStorage.setItem('game_TIX-TAC-TOE_round_count', 0); break;
    case "2" : playground_reset_sts = "one-round-remaining"; localStorage.setItem('game_TIX-TAC-TOE_round_count', 1); break;
    case "3" : playground_reset_sts = "two-round-remaining"; localStorage.setItem('game_TIX-TAC-TOE_round_count', 2); break;
    case "4" : playground_reset_sts = "three-round-remaining"; localStorage.setItem('game_TIX-TAC-TOE_round_count', 3); break;
    case "5" : playground_reset_sts = "four-rounds-remaining"; localStorage.setItem('game_TIX-TAC-TOE_round_count', 4); break;
  }

  document.querySelector('.end_result_winner').classList.add(tile_config_color(localStorage.getItem('game_TIX-TAC-TOE_charactor_color')));

  switch(round_sts) {
    case "X-wins":
      {
        if(localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="X") {
          if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = parseInt(ls_p_ii_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',(parseInt(ls_p_ii_score)+1));
            } else {
              result_player_ii.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',1);
            }
            
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = ls_p_i_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',ls_p_i_score);
            } else {
              result_player_i.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',0);
            }
          } else {
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = parseInt(ls_p_i_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',(parseInt(ls_p_i_score)+1));
            } else {
              result_player_i.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',1);
            }
            
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = ls_p_ii_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',ls_p_ii_score);
            } else {
              result_player_ii.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',0);
            }
          }
        } else if(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol')=="X") {
          if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = parseInt(ls_p_i_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',(parseInt(ls_p_i_score)+1));
            } else {
              result_player_i.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',1);
            }
            
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = ls_p_ii_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',ls_p_ii_score);
            } else {
              result_player_ii.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',0);
            }
          } else {
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = parseInt(ls_p_ii_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',(parseInt(ls_p_ii_score)+1));
            } else {
              result_player_ii.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',1);
            }
            
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = ls_p_i_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',ls_p_i_score);
            } else {
              result_player_i.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',0);
            }
          }
        }
      }
    break;
    case "O-wins":
      {
        if(localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="O") {
          if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = parseInt(ls_p_ii_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',(parseInt(ls_p_ii_score)+1));
            } else {
              result_player_ii.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',1);
            }
            
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = ls_p_i_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',ls_p_i_score);
            } else {
              result_player_i.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',0);
            }
          } else {
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = parseInt(ls_p_i_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',(parseInt(ls_p_i_score)+1));
            } else {
              result_player_i.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',1);
            }
            
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = ls_p_ii_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',ls_p_ii_score);
            } else {
              result_player_ii.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',0);
            }
          }
        } else if(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol')=="O") {
          if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = parseInt(ls_p_i_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',(parseInt(ls_p_i_score)+1));
            } else {
              result_player_i.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',1);
            }
            
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = ls_p_ii_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',ls_p_ii_score);
            } else {
              result_player_ii.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',0);
            }
          } else {
            if(ls_p_ii_score!=null) {
              result_player_ii.children[1].innerText = parseInt(ls_p_ii_score)+1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',(parseInt(ls_p_ii_score)+1));
            } else {
              result_player_ii.children[1].innerText = 1;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',1);
            }
            
            if(ls_p_i_score!=null) {
              result_player_i.children[1].innerText = ls_p_i_score;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',ls_p_i_score);
            } else {
              result_player_i.children[1].innerText = 0;
              localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',0);
            }
          }
        }
      }
    break;
    case "draw-round":
      {
        (ls_p_i_score!=null) ? result_player_i.children[1].innerHTML = ls_p_i_score : result_player_i.children[1].innerHTML = 0;
        (ls_p_i_score!=null) ? localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',ls_p_i_score) : localStorage.setItem('game_TIX-TAC-TOE_local_ply_i_score',0);
        (ls_p_ii_score!=null) ? result_player_ii.children[1].innerHTML = ls_p_ii_score : result_player_ii.children[1].innerHTML = 0;
        (ls_p_ii_score!=null) ? localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',ls_p_ii_score) : localStorage.setItem('game_TIX-TAC-TOE_local_ply_ii_score',0);
      }
    break;
  }

  (player_i.classList.contains('active')) ? player_i.classList.add('next_play_toggle') : player_ii.classList.add('next_play_toggle');

  player_i.classList.remove('active');
  player_ii.classList.remove('active');

  setTimeout(() => {

    if(playground_reset_sts=="game-over") {
      let player_i_value = parseInt(localStorage.getItem('game_TIX-TAC-TOE_local_ply_i_score'));
      let player_ii_value = parseInt(localStorage.getItem('game_TIX-TAC-TOE_local_ply_ii_score'));
      let winner;

      tiles.forEach(tile => tile.style.display = "none");
      document.querySelectorAll('.end_results').forEach(end_result => end_result.classList.remove("game_over"));

      if(player_i_value<player_ii_value) {
        winner=result_player_ii.children[0].innerText;
        switch(winner) {
          case "You":
            summery_preview(localStorage.getItem('game_TIX-TAC-TOE_selected_symbol'),localStorage.getItem('game_TIX-TAC-TOE_game_mode'),winner);
          break;
          case "Challenger":
            summery_preview(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol'),localStorage.getItem('game_TIX-TAC-TOE_game_mode'),winner);
          break;
        }
      } else {
        winner=result_player_i.children[0].innerText;
        switch(winner) {
          case "AI":
            summery_preview(localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol'),localStorage.getItem('game_TIX-TAC-TOE_game_mode'),winner);
          break;
          case "You":
            summery_preview(localStorage.getItem('game_TIX-TAC-TOE_selected_symbol'),localStorage.getItem('game_TIX-TAC-TOE_game_mode'),winner);
          break;
        }
      }
    }

    playground_reset("func_round_end_opening");

    switch(localStorage.getItem('game_TIX-TAC-TOE_round_count')) {
      case "0" : 
        {
          setTimeout(() => {
            result_title_i.innerText = "Game"; result_title_ii.innerText = "Over !";
            setTimeout(() => { result_title.classList.add('opc_drain'); }, 3200);
            result_title.classList.remove('win');
            result_title.classList.add('draw');
            
            setTimeout(() => {
              let countdown = 5;

              setTimeout(() => {
                result_title.classList.remove('opc_drain');
                result_title.setAttribute("style","font-size: 14px;");
                result_title_i.innerText = "playground will reset in";
                result_title_ii.innerText = "5s";
                setTimeout(() => { 
                  document.querySelectorAll('.end_results').forEach(end_result => end_result.classList.add("deactive"));
                  result_title.classList.add('opc_drain');
                }, 3800);
  
                let countdown_alt = setInterval(() => { 
                  result_title_ii.innerText = (--countdown) + 's';
                  if(countdown <= 1) { clearInterval(countdown_alt); window.localStorage.clear(); window.location.reload(); }
                }, 1200);
              }, 2550);
            }, 2000);
          }, 2000);
        }
      break;
      case "1" : 
        {
          empty_tiles_length = [0,0,0,0,0,0,0,0,0];
          setTimeout(() => {
            result_title_i.innerText = "last"; result_title_ii.innerText = "round to play";
            playground_reset("func_round_end_switchings");
          }, 3000);
        }
      break;
      case "2" :
        {
          empty_tiles_length = [0,0,0,0,0,0,0,0,0];
          setTimeout(() => {
            result_title_i.innerText = "two"; result_title_ii.innerText = "rounds remaining";
            playground_reset("func_round_end_switchings");
          }, 3000);
        }
      break;
      case "3" :
        {
          empty_tiles_length = [0,0,0,0,0,0,0,0,0];
          setTimeout(() => {
            result_title_i.innerText = "three"; result_title_ii.innerText = "rounds remaining";
            playground_reset("func_round_end_switchings");
          }, 3000);
        }
      break;
      case "4" :
        {
          empty_tiles_length = [0,0,0,0,0,0,0,0,0];
          setTimeout(() => {
            result_title_i.innerText = "four"; result_title_ii.innerText = "rounds remaining";
            playground_reset("func_round_end_switchings");
          }, 3000);
        }
      break;
    }
  }, 4500);
}

function check_validity() {
  let ls_cha_symbol = localStorage.getItem('game_TIX-TAC-TOE_selected_symbol');
  let result;
  let selected_tile;

  if(((document.querySelector('.tile_i').innerText != '') && (document.querySelector('.tile_ii').innerText != '') && (document.querySelector('.tile_iii').innerText != '')) &&
  ((document.querySelector('.tile_i').innerText == document.querySelector('.tile_ii').innerText) && (document.querySelector('.tile_i').innerText == document.querySelector('.tile_iii').innerText))) {
    result = document.querySelector('.tile_i').innerText;
    selected_tile = ".tile_i";
    document.querySelector('.tile_i').classList.add('won');
    document.querySelector('.tile_ii').classList.add('won');
    document.querySelector('.tile_iii').classList.add('won');
  } else if(((document.querySelector('.tile_iv').innerText != '') && (document.querySelector('.tile_v').innerText != '') && (document.querySelector('.tile_vi').innerText != '')) &&
  ((document.querySelector('.tile_iv').innerText == document.querySelector('.tile_v').innerText) && (document.querySelector('.tile_iv').innerText == document.querySelector('.tile_vi').innerText))) {
    result = document.querySelector('.tile_iv').innerText;
    selected_tile = ".tile_iv";
    document.querySelector('.tile_iv').classList.add('won');
    document.querySelector('.tile_v').classList.add('won');
    document.querySelector('.tile_vi').classList.add('won');
  } else if(((document.querySelector('.tile_vii').innerText != '') && (document.querySelector('.tile_viii').innerText != '') && (document.querySelector('.tile_ix').innerText != '')) &&
  ((document.querySelector('.tile_vii').innerText == document.querySelector('.tile_viii').innerText) && (document.querySelector('.tile_vii').innerText == document.querySelector('.tile_ix').innerText))) {
    result = document.querySelector('.tile_vii').innerText;
    selected_tile = ".tile_vii";
    document.querySelector('.tile_vii').classList.add('won');
    document.querySelector('.tile_viii').classList.add('won');
    document.querySelector('.tile_ix').classList.add('won');
  } else if(((document.querySelector('.tile_i').innerText != '') && (document.querySelector('.tile_iv').innerText != '') && (document.querySelector('.tile_vii').innerText != '')) &&
  ((document.querySelector('.tile_i').innerText == document.querySelector('.tile_iv').innerText) && (document.querySelector('.tile_i').innerText == document.querySelector('.tile_vii').innerText))) {
    result = document.querySelector('.tile_i').innerText;
    selected_tile = ".tile_i";
    document.querySelector('.tile_i').classList.add('won');
    document.querySelector('.tile_iv').classList.add('won');
    document.querySelector('.tile_vii').classList.add('won');
  } else if(((document.querySelector('.tile_ii').innerText != '') && (document.querySelector('.tile_v').innerText != '') && (document.querySelector('.tile_viii').innerText != '')) &&
  ((document.querySelector('.tile_ii').innerText == document.querySelector('.tile_v').innerText) && (document.querySelector('.tile_ii').innerText == document.querySelector('.tile_viii').innerText))) {
    result = document.querySelector('.tile_ii').innerText;
    selected_tile = ".tile_ii";
    document.querySelector('.tile_ii').classList.add('won');
    document.querySelector('.tile_v').classList.add('won');
    document.querySelector('.tile_viii').classList.add('won');
  } else if(((document.querySelector('.tile_iii').innerText != '') && (document.querySelector('.tile_vi').innerText != '') && (document.querySelector('.tile_ix').innerText != '')) &&
  ((document.querySelector('.tile_iii').innerText == document.querySelector('.tile_vi').innerText) && (document.querySelector('.tile_iii').innerText == document.querySelector('.tile_ix').innerText))) {
    result = document.querySelector('.tile_iii').innerText;
    selected_tile = ".tile_iii";
    document.querySelector('.tile_iii').classList.add('won');
    document.querySelector('.tile_vi').classList.add('won');
    document.querySelector('.tile_ix').classList.add('won');
  } else if(((document.querySelector('.tile_i').innerText != '') && (document.querySelector('.tile_v').innerText != '') && (document.querySelector('.tile_ix').innerText != '')) &&
  ((document.querySelector('.tile_i').innerText == document.querySelector('.tile_v').innerText) && (document.querySelector('.tile_i').innerText == document.querySelector('.tile_ix').innerText))) {
    result = document.querySelector('.tile_i').innerText;
    selected_tile = ".tile_i";
    document.querySelector('.tile_i').classList.add('won');
    document.querySelector('.tile_v').classList.add('won');
    document.querySelector('.tile_ix').classList.add('won');
  } else if(((document.querySelector('.tile_iii').innerText != '') && (document.querySelector('.tile_v').innerText != '') && (document.querySelector('.tile_vii').innerText != '')) &&
  ((document.querySelector('.tile_iii').innerText == document.querySelector('.tile_v').innerText) && (document.querySelector('.tile_iii').innerText == document.querySelector('.tile_vii').innerText))) {
    result = document.querySelector('.tile_iii').innerText;
    selected_tile = ".tile_iii";
    document.querySelector('.tile_iii').classList.add('won');
    document.querySelector('.tile_v').classList.add('won');
    document.querySelector('.tile_vii').classList.add('won');
  } else {
    if(document.querySelectorAll('.empty_tile').length == 0 || document.querySelectorAll('.empty_tile')[0] == null || empty_tiles_length.length == 0) { result = "draw"; } 
  }

  switch (result) {
    case "X":
      {
        if(document.querySelector(selected_tile).innerText == ls_cha_symbol) { result_title_i.innerText = "You"; result_title_ii.innerText = "Win !"; }
        else { (localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") ? result_title_i.innerText = "A.I." : result_title_i.innerText = "Challenger";
        result_title_ii.innerText = "Wins !"; }
        result_title.classList.remove('draw'); result_title.classList.add('win');
        return "X-wins";
      }      
    case "O":
      {
        if(document.querySelector(selected_tile).innerText == ls_cha_symbol) { result_title_i.innerText = "You"; result_title_ii.innerText = "Win !"; }
        else { (localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") ? result_title_i.innerText = "A.I." : result_title_i.innerText = "Challenger"; 
        result_title_ii.innerText = "Wins !"; }
        result_title.classList.remove('draw'); result_title.classList.add('win');
        return "O-wins";
      }
    case "draw":
      {
        result_title_i.innerText = "It's a"; result_title_ii.innerText = "Draw !";
        result_title.classList.add('draw'); result_title.classList.remove('win');
        player_i.classList.toggle('active');
        player_ii.classList.toggle('active'); 
        tiles.forEach(tile => { if(tile.innerText=="") { tile.classList.add('disabled'); } });
        return "draw-round";
      }
    default:
      result_title_i.innerText = ""; result_title_ii.innerText = "";
      result_title.classList.remove('draw'); result_title.classList.remove('win');
    return "continue";
  }
}

function first_time_AI_play() {
  prv_AI_tile = random_AI_tile_fill();
  handling_ai_tile = '.'+prv_AI_tile;
  localStorage.setItem('game_TIX-TAC-TOE_func_RAITF',"valid_tile_unselected");
  localStorage.setItem('game_TIX-TAC-TOE_prv_AI_tile',prv_AI_tile);
  localStorage.setItem('game_TIX-TAC-TOE_ai_tiles_sync',"set");
  ls_cha_color = localStorage.getItem('game_TIX-TAC-TOE_charactor_color');
  ls_op_color = localStorage.getItem('game_TIX-TAC-TOE_opponent_color');
  ls_cha_symbol = localStorage.getItem('game_TIX-TAC-TOE_selected_symbol');
  ls_op_symbol = localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol');
  ls_strike = localStorage.getItem('game_TIX-TAC-TOE_selected_strike');

  if(document.querySelectorAll(handling_ai_tile).length<=0) { 
    localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"AI");
    continue_playing(localStorage.getItem('game_TIX-TAC-TOE_continue_playing'));
  } else {
    document.querySelector(handling_ai_tile).innerText = tile_config_symbol(ls_op_symbol);
    if(!(document.querySelector(handling_ai_tile).classList.contains('empty_tile'))) { empty_tiles_length.pop(); }

    setTimeout(() => { 
      document.querySelector('.'+localStorage.getItem('game_TIX-TAC-TOE_prv_AI_tile')).classList.add(tile_config_color(ls_op_color));
      player_i.classList.toggle('active');
      player_ii.classList.toggle('active');
    }, 1550);
    
    tile_config_strike(ls_strike);
    
    document.querySelector(handling_ai_tile).classList.add('ai_tile');
    document.querySelector(handling_ai_tile).classList.add('disabled');
    document.querySelector(handling_ai_tile).classList.add('empty_tile');
    localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"You");
    localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"Human");

    return 0;
  }
}

function one_time_ai_tile_select() {
  tiles.forEach(single_tile => { if(single_tile.innerText=="") {
    ai_tiles.push(single_tile.classList[1]);
    single_tile.classList.add('ai_tile');
  }});

  return 0;
}

function playing_AI(tile_class) {
  let bool_localStr_prv_AI_tile = (localStorage.getItem('game_TIX-TAC-TOE_prv_AI_tile')==ai_selected_tile);

  while(!(!(bool_localStr_prv_AI_tile) && (tile_class!=ai_selected_tile) && (ai_selected_tile!==undefined))) {
    if(ai_tiles.length<=6) {
      if(ai_tiles.length<=3) {
        if(ai_tiles.length==1) { prv_AI_tile = ai_tiles[0]; }
        else { ai_selected_tile = random_AI_tile_fill("upto_3_tiles"); }
      } else { ai_selected_tile = random_AI_tile_fill("upto_6_tiles"); }
    } else { ai_selected_tile = random_AI_tile_fill("upto_9_tiles"); }
    
    return ai_selected_tile; 
  }
}

function random_AI_tile_fill() {
  let iterate_count = 1;

  if(ai_tiles.length<=6) {
    if(ai_tiles.length<=3) {
      if(ai_tiles.length==1) { prv_AI_tile = ai_tiles[0]; }
      else { sts="upto_3_tiles"; }
    } else { sts="upto_6_tiles"; }
  } else { sts="upto_9_tiles"; }

  while(!(localStorage.getItem('game_TIX-TAC-TOE_func_RAITF')=="valid_tile_selected")) {

    if(ai_tiles.length<=10) {
      ai_tile_index = Math.floor(Math.random()*10)+1;
      if(ai_tile_index==10) { ai_tile_index -= 1; } 
    } else if(ai_tiles.length<=6) {
      ai_tile_index = Math.floor(Math.random()*5)+1;
      if(ai_tile_index==6) { ai_tile_index -= 1; } 
    } else if(ai_tiles.length<=3) {
      ai_tile_index = Math.floor(Math.random()*2)+1;
      if(ai_tile_index==3) { ai_tile_index -= 1; }
    }

    if(ai_tile_index==0) { ai_tile_index += 1; }
    else { ai_tile = ai_tile_index; }
  
    switch(ai_tile_index) {
      case 1: ai_tile = "tile_i"; break;
      case 2: ai_tile = "tile_ii"; break;
      case 3: ai_tile = "tile_iii"; break;
      case 4: ai_tile = "tile_iv"; break;
      case 5: ai_tile = "tile_v"; break;
      case 6: ai_tile = "tile_vi"; break;
      case 7: ai_tile = "tile_vii"; break;
      case 8: ai_tile = "tile_viii"; break;
      case 9: ai_tile = "tile_ix"; break;
    }

    iterate_count++;

    if(ai_tiles.indexOf(ai_tile)!=(-1)) { localStorage.setItem('game_TIX-TAC-TOE_func_RAITF',"valid_tile_selected"); break; }

    if(iterate_count>5000) { ai_tile = ai_tiles[0]; break; }
  }

  ai_tiles = ai_tiles.filter(tile => tile!=ai_tile);
  return ai_tile;
}

function tile_config_color(player_color) {
  if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
    if(player_color=="gold") { return "gone_gold"; }
    else { return "gone_purple"; }
  } else {
    if(localStorage.getItem('game_TIX-TAC-TOE_player')=="player_i") {
      if(player_color=="gold") { return "gone_purple"; } else { return "gone_gold"; }
    } else {
      if(player_color=="gold") { return "gone_gold"; } else { return "gone_purple"; }
    }
  }
}

function tile_config_strike(player_strike) {
  if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
    if(player_strike=="You") { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"Opponent"); return 0; }
    else { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"You"); return 0; }
  } else {
    if(localStorage.getItem('game_TIX-TAC-TOE_player')=="player_i") {
      if(player_strike=="You") { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"Opponent"); return 0; }
      else { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"You"); return 0; }
    } else {
      if(player_strike=="You") { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"You"); return 0; }
      else { localStorage.setItem('game_TIX-TAC-TOE_selected_strike',"Opponent"); return 0; }
    }
  }
}

function tile_config_symbol(player_symbol) {
  if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") {
    if(player_symbol=="X") { return "X"; } else { return "O"; }
  } else {
    if(localStorage.getItem('game_TIX-TAC-TOE_player')=="player_i") {
      if(player_symbol=="X") { return "O"; } else { return "X"; }
    } else {
      if(player_symbol=="X") { return "X"; } else { return "O"; }
    }
  }
}

function tile_config_player(player_tab) {
  if(player_tab=="player_i") { localStorage.setItem('game_TIX-TAC-TOE_player',"player_ii"); return 0;
  } else { localStorage.setItem('game_TIX-TAC-TOE_player',"player_i"); return 0; }
}

function continue_playing(player) {
  let ls_cha_symbol;
  let ls_op_symbol;
  let ls_cha_color;
  let ls_op_color;
  let ls_strike;
  let handling_ai_tile;

  if(localStorage.getItem('game_TIX-TAC-TOE_local_storage_set')=="values_set") {

    tiles.forEach(tile => { if(tile.innerText=="") { tile.classList.remove('disabled'); } });
    
    if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP") { if(ai_tiles.length==0) { one_time_ai_tile_select(); } }

    if(localStorage.getItem('game_TIX-TAC-TOE_ai_tiles_sync')!="set") { ai_tiles = ai_tiles.reverse(); }

    if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP" && player=="AI") {
      first_time_AI_play();
      continue_playing(localStorage.getItem('game_TIX-TAC-TOE_continue_playing'));
    } else {

      tiles.forEach(tile => { 
        if(tile.innerText=="") { tile.classList.add('empty_tile'); }
        
        tile.addEventListener('click', function() {
          ls_cha_color = localStorage.getItem('game_TIX-TAC-TOE_charactor_color');
          ls_op_color = localStorage.getItem('game_TIX-TAC-TOE_opponent_color');
          ls_cha_symbol = localStorage.getItem('game_TIX-TAC-TOE_selected_symbol');
          ls_op_symbol = localStorage.getItem('game_TIX-TAC-TOE_opponent_symbol');
          ls_strike = localStorage.getItem('game_TIX-TAC-TOE_selected_strike');
          let validity;

          if((tile.innerText=="") && !(tile.classList.contains('disabled'))) {
            let count = 1;
            tile.classList.remove('disabled');
            tile.classList.remove('ai_tile');
            tile.classList.remove('empty_tile');
            if(!(tile.classList.contains('empty_tile'))) { empty_tiles_length.pop(); }

            setTimeout(() => { tile.innerText = tile_config_symbol(ls_cha_symbol); validity = check_validity(); }, 900);
            setTimeout(() => { tile.classList.add(tile_config_color(ls_cha_color)); }, 1000);
            setTimeout(() => { tile_config_strike(ls_strike); }, 1010);
            tile_config_player(localStorage.getItem('game_TIX-TAC-TOE_player'));

            setTimeout(() => { if(validity=="continue") {
              setTimeout(() => {
                player_i.classList.toggle('active');
                player_ii.classList.toggle('active');
              }, 500);
                        
              if(!(ai_tiles.indexOf(tile.classList[1])==(-1))) { ai_tiles = ai_tiles.filter(each_tile => each_tile!=tile.classList[1]); }
  
              if(localStorage.getItem('game_TIX-TAC-TOE_game_mode')=="AvP" && ai_tiles.length!=0) {
                validity = undefined;
                tiles.forEach(tL => tL.addEventListener('click', () => { return false; }));

                setTimeout(() => {
                  if(count==1) {
                    prv_AI_tile = random_AI_tile_fill();
                    count++;
                  }
                  handling_ai_tile = '.'+prv_AI_tile;
                  localStorage.setItem('game_TIX-TAC-TOE_func_RAITF',"valid_tile_unselected");
                  localStorage.setItem('game_TIX-TAC-TOE_prv_AI_tile',prv_AI_tile);
  
                  if((document.querySelectorAll(handling_ai_tile).length<=0) || (document.querySelector(handling_ai_tile).innerText!="")){ 
                    localStorage.setItem('game_TIX-TAC-TOE_continue_playing',"AI");
                    continue_playing(localStorage.getItem('game_TIX-TAC-TOE_continue_playing'));
                  } else {
                    document.querySelector(handling_ai_tile).classList.add('ai_tile');
                    document.querySelector(handling_ai_tile).classList.add('disabled');
                    if(!(document.querySelector(handling_ai_tile).classList.contains('empty_tile'))) { empty_tiles_length.pop(); }
                    document.querySelector(handling_ai_tile).classList.remove('empty_tile');
                    
                    setTimeout(() => { document.querySelector(handling_ai_tile).innerText = tile_config_symbol(ls_op_symbol); }, 875);
                    setTimeout(() => { document.querySelector(handling_ai_tile).classList.add(tile_config_color(ls_op_color)); validity = check_validity(); }, 925);
                    
                    setTimeout(() => { if(validity=="continue") {
                      setTimeout(() => { 
                        tile_config_strike(ls_strike); }, 1025);
                        tile_config_player(localStorage.getItem('game_TIX-TAC-TOE_player'));
      
                      setTimeout(() => {
                        player_i.classList.toggle('active');
                        player_ii.classList.toggle('active');  
                      }, 950);
                    } else { round_end(validity); } }, 950);
                  }
                }, 500); 
              }
              
              // if(!(tile.classList.contains('empty_tile'))) { tile.classList.remove('empty_tile'); }
              if(tile.classList.contains('empty_tile')) { tile.classList.remove('empty_tile'); }
              if(!(tile.classList.contains('disabled'))) { tile.classList.add('disabled'); }
            } else { round_end(validity); } }, 950);
          }
        });
      });
    }
  }
}

function play_game() {
  setTimeout(() => {
    setTimeout(() => { Moves_Panel.classList.add('hidden'); }, 20);
    setTimeout(() => { Control_Panel.classList.add('hidden'); }, 30);

    round_result_i.children[0].children[0].className = "span_alt";
    round_result_ii.children[0].children[0].className = "span_alt";

    Moves_Panel.style.display = "none";
    result_title_i.innerText = ""; result_title_ii.innerText = "";
  }, 1490);

  setTimeout(() => { result_title.classList.add('opc_drain'); }, 750);

  setTimeout(() => {
    round_result_i.classList.remove('active');
    round_result_ii.classList.remove('active');
    Control_Panel.style.display = "none";
    Content_Panel.classList.add('top_elements_removed');
    result_title.classList.remove('opc_drain');
  }, 1500);

  continue_playing(localStorage.getItem('game_TIX-TAC-TOE_continue_playing'));
}

function sub_title_change(par) {
  let title_change_x_you = (localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="X" && localStorage.getItem('game_TIX-TAC-TOE_selected_strike')=="You");
  let title_change_x_opponent = (localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="X" && localStorage.getItem('game_TIX-TAC-TOE_selected_strike')=="Opponent");
  let title_change_o_you = (localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="O" && localStorage.getItem('game_TIX-TAC-TOE_selected_strike')=="You");
  let title_change_o_opponent = (localStorage.getItem('game_TIX-TAC-TOE_selected_symbol')=="O" && localStorage.getItem('game_TIX-TAC-TOE_selected_strike')=="Opponent");
  let title_target_i = round_result_i.children[0].children[0];
  let title_target_ii = round_result_ii.children[0].children[0];

  switch(par) {
    case "player_i":
        if(title_change_x_you || title_change_o_opponent) { 
          if(player_i.classList.contains('gone_gold')) {
            title_target_i.classList.add('gold_selected');
            title_target_i.classList.remove('purple_selected');
          } else {
            title_target_i.classList.add('purple_selected');
            title_target_i.classList.remove('gold_selected');
          }
          round_result_i.classList.add('active');
          round_result_ii.classList.remove('active');
        } else if(title_change_o_you || title_change_x_opponent) {
          if(player_i.classList.contains('gone_gold')) {
            title_target_ii.classList.add('gold_selected');
            title_target_ii.classList.remove('purple_selected');
          } else {
            title_target_ii.classList.add('purple_selected');
            title_target_ii.classList.remove('gold_selected');
          }
          round_result_i.classList.remove('active');
          round_result_ii.classList.add('active');
        }
      player_i.classList.add('active');
      player_ii.classList.remove('active');
    break;
    case "player_ii":
        if(title_change_x_you || title_change_o_opponent) { 
          if(player_ii.classList.contains('gone_gold')) {
            title_target_i.classList.add('gold_selected');
            title_target_i.classList.remove('purple_selected');
          } else {
            title_target_i.classList.add('purple_selected');
            title_target_i.classList.remove('gold_selected');
          }
          round_result_i.classList.add('active');
          round_result_ii.classList.remove('active');
        } else if(title_change_o_you || title_change_x_opponent) {
          if(player_ii.classList.contains('gone_gold')) {
            title_target_ii.classList.add('gold_selected');
            title_target_ii.classList.remove('purple_selected');
          } else {
            title_target_ii.classList.add('purple_selected');
            title_target_ii.classList.remove('gold_selected');
          }
          round_result_i.classList.remove('active');
          round_result_ii.classList.add('active');
        }
      player_i.classList.remove('active');
      player_ii.classList.add('active');
    break;
  }

  return 0;
}

function game_start_check() {
  if(document.querySelectorAll('.selected_color').length == 1) {
    if(document.querySelectorAll('.selected_symbol').length == 1) {
      if(document.querySelectorAll('.selected_strike').length == 1) {
        localStorage.setItem('game_TIX-TAC-TOE_local_storage_set', 'values_set');
        game_start();
      }
    }
  }
}

let gameStartCheck = setInterval(() => game_start_check(), 1500);

function game_start() {
  clearInterval(gameStartCheck);

  Moves_Panel.children[0].classList.add('deactive');
  contr_symbol_n_strike.classList.add('deactive');
  Moves_Panel.classList.add('msg');
  round_result_i.classList.remove('active');
  round_result_ii.classList.remove('active');
  result_title_i.classList.remove('win');
  result_title_ii.classList.remove('draw');

  sub_title_change(localStorage.getItem('game_TIX-TAC-TOE_player'));

  switch(localStorage.getItem('game_TIX-TAC-TOE_round_count')) {
    case "1" : result_title_i.innerText = "single"; result_title_ii.innerText = "round play"; break;
    case "3" : result_title_i.innerText = "three"; result_title_ii.innerText = "rounds to go"; break;
    case "5" : result_title_i.innerText = "five"; result_title_ii.innerText = "rounds to go"; break;
  }

  play_game();
}