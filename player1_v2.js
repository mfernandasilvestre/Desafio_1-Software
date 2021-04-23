const DIRECTIONS = ['north', 'east', 'south', 'west'];
const MOVES = ['shoot', 'move'];

const randomMove = () => {
  return Math.random() > 0.33 ? 'move' : DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
};

const changeDirection = () =>{
  return DIRECTIONS[Math.floor(Math.random()*DIRECTIONS.length)];
};

const isVisible = (originalPosition = [], finalPosition = [], direction = []) => {
  switch (direction) {
    case DIRECTIONS[0]:
      return originalPosition[1] === finalPosition[1] && originalPosition[0] > finalPosition[0];
    case DIRECTIONS[1]:
      return originalPosition[0] === finalPosition[0] && originalPosition[1] < finalPosition[1];
    case DIRECTIONS[2]:
      return originalPosition[1] === finalPosition[1] && originalPosition[0] < finalPosition[0];
    case DIRECTIONS[3]:
      return originalPosition[0] === finalPosition[0] && originalPosition[1] > finalPosition[1];
    default:
      break;
  }
};

const canKill = (currentPlayerState = {}, enemiesStates = []) => {
  return enemiesStates.some(enemyObject => {
    return enemyObject.isAlive &&
      isVisible(currentPlayerState.position, enemyObject.position, currentPlayerState.direction);
  });
};

// Possuo munição?
const haveAmmo = (currentPlayerState ={})=>{
  return currentPlayerState.ammo !== 0 ? true : false;
};

// Calcular distância para as munições
const ammoDist = (gameStates={}, currentPlayerState = {})=>{
  return gameStates.ammoPosition.map(ammoPos=>{
    return Math.abs(currentPlayerState.position[0]-ammoPos[0])+Math.abs(currentPlayerState.position[1]-ammoPos[1]);
  });
};

// Calcular distância para as naves inimigas
const enemyDist = (enemiesStates = [], currentPlayerState = {})=>{
  return enemiesStates.map(enemyObject =>{
    return Math.abs(currentPlayerState.position[0]-enemyObject.position[0])+Math.abs(currentPlayerState.position[1]-enemyObject.position[1]);
  });
};

let ammoIndex=0; // Index da munição mais próxima
let enemyIndex=0; // Index da nave inimiga mais próxima

// Munição mais próxima
function minorDistToAmmo(ammoDist){
  let minor = ammoDist[0];
  for(let i=0; i<ammoDist.length;i++){
    if(ammoDist[i]<minor){
      minor = ammoDist[i];
      ammoIndex = i;
    }
  }
  return minor;
}

//Nave inimiga mais proxima
function minorDistToEnemy(enemyDist){
  let minor = enemyDist[0];
  for(let i=0; i<enemyDist.length;i++){
    if(enemyDist[i]<minor){
      minor = enemyDist[i];
      enemyIndex = i;
    }
  }
  return minor;
}

const priority = (minorDistanceAmmo, minorDistanceEnemy, hasAmmo) => {
  if(minorDistanceAmmo < minorDistanceEnemy || hasAmmo === false){
    return 'ammo';
  }else{
    return 'enemy';
  }
};

const player = {
  info: {
    name: "TESTE_1",
    style: 1,
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    //Seu código aqui
    // Lembrando que a cada turno essa função vai ser executada
    // E ela tem que retornar um movimento
    // Seja atirar (shoot), mover(move), girar(south, west, east, north)

    // ****POSITION[1] = X, POSITION[0] = Y ****
    // ****Direções = [Norte, Sul, Leste, Oeste]****

    const myDirection = playerState.direction;
    let dirArray = [1,1,1,1]; // Norte, Sul, Leste, Oeste
    let posY = playerState.position[0];
    let posX = playerState.position[1];
    let positionParam;
    let coord;

    // Verifica se há naves perigosas nas linhas adjacentes
    const canDieMovingTop = enemiesState.some(enemyObject =>{
      return (enemyObject.position[0] === posY-1 && enemyObject.position[1] < posX && enemyObject.direction==="east" && enemyObject.ammo!==0) || (enemyObject.position[0] === posY-1 && enemyObject.position[1] > posX && enemyObject.direction==="west" && enemyObject.ammo!==0);
    });
    const canDieMovingBottom = enemiesState.some(enemyObject =>{
      return (enemyObject.position[0] === posY+1 && enemyObject.position[1] < posX && enemyObject.direction==="east" && enemyObject.ammo!==0) || (enemyObject.position[0] === posY+1 && enemyObject.position[1] > posX && enemyObject.direction==="west" && enemyObject.ammo!==0);
    });
    const canDieMovingRight = enemiesState.some(enemyObject =>{
      return (enemyObject.position[1] === posX+1 && enemyObject.position[0] < posY && enemyObject.direction==="south" && enemyObject.ammo!==0) || (enemyObject.position[1] === posX+1 && enemyObject.position[0] > posY && enemyObject.direction==="north" && enemyObject.ammo!==0);
    });
    const canDieMovingLeft = enemiesState.some(enemyObject =>{
      return (enemyObject.position[1] === posX-1 && enemyObject.position[0] < posY && enemyObject.direction==="south" && enemyObject.ammo!==0) || (enemyObject.position[1] === posX-1 && enemyObject.position[0] > posY && enemyObject.direction==="north" && enemyObject.ammo!==0);
    });

    // Verifica se há naves perigosas na mesma linha
    if(enemiesState.some(enemyObject => posY === enemyObject.position[0])){
      dirArray[2] = 0;
      dirArray[3] = 0;
    }

    // Verifica se há naves perigosas na mesma coluna
    if(enemiesState.some(enemyObject => posX === enemyObject.position[1])){
      dirArray[0] = 0;
      dirArray[1] = 0;
    }

    if(canDieMovingTop){dirArray[0]=0;}
    if(canDieMovingBottom){dirArray[1]=0;}
    if(canDieMovingRight){dirArray[2]=0;}
    if(canDieMovingLeft){dirArray[3]=0;}


    // Atirar
    if(canKill(playerState, enemiesState)===true && haveAmmo(playerState)){
      return 'shoot'
    }

    // Verificar se há naves inimigas indefesas no mesmo eixo
    const canKillShipNorth = enemiesState => {
      return enemiesState.some(enemyObject => {
        return posY>enemyObject.position[0] && posX===enemyObject.position[1] && enemyObject.ammo === 0;
      })
    };

    const canKillShipSouth = enemiesState =>{
      return enemiesState.some(enemyObject =>{
        return posY<enemyObject.position[0] && posX===enemyObject.position[1] && enemyObject.ammo===0;
      })
    };

    const canKillShipRight = enemiesState =>{
      return enemiesState.some(enemyObject =>{
        return posX<enemyObject.position[1] && posY===enemyObject.position[0] && enemyObject.ammo===0;
      })
    };

    const canKillShipLeft = enemiesState =>{
      return enemiesState.some(enemyObject =>{
        return posX>enemyObject.position[1] && posY===enemyObject.position[0] && enemyObject.ammo===0;
      })
    };

    if(canKillShipNorth(enemiesState)){
      return 'north';
    }else if(canKillShipSouth(enemiesState)){
      return 'south';
    }else if(canKillShipRight(enemiesState)){
      return 'east';
    }else if(canKillShipLeft(enemiesState)){
      return 'west'
    }

    // Array com posições das munições
    const ammoDistArray = ammoDist(gameEnvironment, playerState);

    // Array com posições das naves inimigas
    const enemyDistArray = enemyDist(enemiesState, playerState)

    // Menor distancia pra munição
    const minorAmmoDist = minorDistToAmmo(ammoDistArray);

    // Menor distancia para uma nave inimiga
    const minorEnemyDist = minorDistToEnemy(enemyDistArray);

    // Proxima prioridade
    const nextPriority = priority(minorAmmoDist, minorEnemyDist, haveAmmo(playerState));

    const getClosestAmmo = gameEnvironment.ammoPosition[ammoIndex];
    const getClosestEnemy = enemiesState[enemyIndex].position;

    // Define o parametro de acordo com a prioridade
    if(nextPriority==='ammo'){
      positionParam = getClosestAmmo;
    }else{
      positionParam = getClosestEnemy;
    }

    // Armazena a posição do parametro
    coord = [playerState.position[0]-positionParam[0], playerState.position[1]-positionParam[1]];

    // Movimentação, jogada
    if(coord[0]!==0){
        if(coord[0]<0){
          if(dirArray[1]!==0){
            if(myDirection!=='south'){
              return 'south';
            }else{
              return 'move';
            }
          }else{
            return 'north';
          }
        }else{
          if(dirArray[0]!==0){
            if(myDirection!=='north'){
              return 'north';
            }else{
              return 'move';
            }
          }else{
            return 'south';
          }
        }
      }else{
        if(coord[1]!==0){
          if(coord[1]>0){
            if(dirArray[3]!==0){
              if(myDirection!=='west'){
                return 'west';
              }else{
                return 'move';
              }
            }else{
              return 'east';
            }
          }else{
            if(dirArray[2]!==0){
              if(myDirection!=='east'){
                return 'east';
              }else{
                return 'move';
              }
            }else{
              return 'west';
            }
          }
        }
      }

  },
};

module.exports = player;
