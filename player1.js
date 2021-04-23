const DIRECTIONS = ['north', 'east', 'south', 'west'];
const MOVES = ['shoot', 'move'];

const randomMove = () => {
  return Math.random() > 0.33 ? 'move' : DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
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

const player = {
  info: {
    name: "NOME_DO_SEU_ROBO",
    style: 1,
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    //Seu código aqui
    // Lembrando que a cada turno essa função vai ser executada
    // E ela tem que retornar um movimento
    // Seja atirar (shoot), mover(move), girar(south, west, east, north)
  },
};

module.exports = player;
