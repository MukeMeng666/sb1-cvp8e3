import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// 定义方向类型
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// 定义坐标类型
type Coordinate = {
  x: number;
  y: number;
};

const GRID_SIZE = 20;
const CELL_SIZE = 20;

function App() {
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coordinate>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 生成新的食物位置
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        generateFood();
        setScore((prevScore) => prevScore + 1);
      } else {
        newSnake.pop();
      }

      // 检查游戏是否结束
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);
      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  // 处理键盘事件
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
      }
    },
    []
  );

  // 设置游戏循环和键盘事件监听
  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 100);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [moveSnake, handleKeyPress]);

  // 重新开始游戏
  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">贪吃蛇游戏</h1>
      <div className="mb-4">得分: {score}</div>
      <div
        className="border-2 border-gray-300 relative"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="bg-green-500 absolute"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
        <div
          className="bg-red-500 absolute"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold mb-2">游戏结束!</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={restartGame}
          >
            重新开始
          </button>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button className="p-2 bg-gray-200 rounded" onClick={() => setDirection('UP')}>
          <ChevronUp />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => setDirection('DOWN')}>
          <ChevronDown />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => setDirection('LEFT')}>
          <ChevronLeft />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => setDirection('RIGHT')}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default App;