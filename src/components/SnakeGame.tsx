import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    gameContainerRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && !isGameOver) {
      setIsPaused(p => !p);
      return;
    }

    if (isPaused || isGameOver) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isPaused, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPaused, isGameOver, food, generateFood, highScore]);

  return (
    <div 
      className="flex flex-col items-center bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl border border-gray-800 shadow-[0_0_40px_rgba(0,255,128,0.15)] outline-none"
      tabIndex={0}
      ref={gameContainerRef}
    >
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">Score</span>
          <span className="text-3xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] font-mono">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" /> High
          </span>
          <span className="text-xl font-bold text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-mono">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-gray-800 rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
        style={{
          width: '400px',
          height: '400px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(rgba(31, 41, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 41, 55, 0.3) 1px, transparent 1px)',
               backgroundSize: `${400/GRID_SIZE}px ${400/GRID_SIZE}px`
             }}
        />

        {/* Food */}
        <div
          className="bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '2px'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={cn(
                "z-20 rounded-sm transition-all duration-75",
                isHead 
                  ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] z-30" 
                  : "bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              )}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: isHead ? '0px' : '1px',
                transform: isHead ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {isHead && (
                <div className="w-full h-full relative">
                  <div className={cn(
                    "absolute w-1.5 h-1.5 bg-black rounded-full",
                    direction.x === 1 ? "right-1 top-1" :
                    direction.x === -1 ? "left-1 top-1" :
                    direction.y === 1 ? "bottom-1 right-1" : "top-1 right-1"
                  )} />
                  <div className={cn(
                    "absolute w-1.5 h-1.5 bg-black rounded-full",
                    direction.x === 1 ? "right-1 bottom-1" :
                    direction.x === -1 ? "left-1 bottom-1" :
                    direction.y === 1 ? "bottom-1 left-1" : "top-1 left-1"
                  )} />
                </div>
              )}
            </div>
          );
        })}

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center">
            {isGameOver ? (
              <>
                <h3 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest">
                  GAME OVER
                </h3>
                <p className="text-gray-300 mb-6 font-mono">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] font-bold tracking-wide"
                >
                  <RotateCcw className="w-5 h-5" />
                  PLAY AGAIN
                </button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-black text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] tracking-widest">
                  READY?
                </h3>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full hover:bg-green-500 hover:text-black transition-all shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_25px_rgba(74,222,128,0.6)] font-bold tracking-wide text-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                  START
                </button>
                <p className="text-gray-500 mt-6 font-mono text-sm">Use Arrow Keys or WASD to move</p>
                <p className="text-gray-500 font-mono text-sm">Space to pause</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
