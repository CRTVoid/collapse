document.addEventListener("DOMContentLoaded", function () {
  // Темная тема переключатель
  const toggle = document.getElementById("toggleSwitch");
  if (toggle) {
    toggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      document.documentElement.classList.toggle("dark-mode");
    });
  }
  // 👇 Добавляем инициализацию SDK
//  initYandexSDK();
});

document.addEventListener("DOMContentLoaded", function () {
  const newGameButton = document.getElementById("newGame");

  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      showAdThenStartGame();
    });
  }
});


 ///Завершение игры — отображение результата
function showGameOver(score) {
  document.getElementById("final-score").textContent = score;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("gameover-popup").style.display = "flex";

  updateVkShareLink(score);
  updateWaShareLink(score);
}

// Перезапуск игры (без рекламы)
function restartGame() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("gameover-popup").style.display = "none";
  init(); // старт новой игры
}

// Тестовая кнопка завершения игры
document.getElementById("force-end").addEventListener("click", () => {
  showGameOver(score);
});

window.addEventListener("resize", resizeBoard);
document.addEventListener("DOMContentLoaded", () => {
  resizeBoard();
});

function resizeBoard() {
  const board = document.querySelector(".board");
  const screenWidth = window.innerWidth;

  // Максимальная ширина board — 320px
  const boardWidth = Math.min(screenWidth * 0.9, 320);
  const cellSize = boardWidth / 10; // 10 столбцов

  board.style.width = boardWidth + "px";
  board.style.height = cellSize * 13 + "px"; // 13 строк

  // Обновляем размер шариков (если они есть)
  const cells = board.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
  });

  // Обновим также размер шкалы очков, если нужно
  const scoreWrapper = document.querySelector(".score-wrapper");
  if (scoreWrapper) {
    scoreWrapper.style.width = boardWidth + "px";
  }
}

// leaderboard.js

class Leaderboard {
    constructor() {
        this.maxEntries = 10;
        this.playerName = this.getPlayerName();
    }

    // Получаем имя игрока (можно сделать input в попапе)
    getPlayerName() {
        let name = localStorage.getItem('collapsePlayerName');
        if (!name) {
            // Генерируем случайное имя если нет сохраненного
            name = `Игрок_${Math.floor(Math.random() * 10000)}`;
            localStorage.setItem('collapsePlayerName', name);
        }
        return name;
    }

    // Сохраняем имя игрока
    setPlayerName(name) {
        this.playerName = name;
        localStorage.setItem('collapsePlayerName', name);
    }

    // Проверяем, попадает ли счет в таблицу лидеров
    async checkAndSubmitScore(score) {
        try {
            const leaderboardRef = database.ref('leaderboard');
            const snapshot = await leaderboardRef.once('value');
            const data = snapshot.val();
            
            if (!data) {
                // Если таблица пустая, сохраняем сразу
                await this.saveScore(score);
                return true;
            }
            
            const scores = Object.values(data);
            scores.sort((a, b) => b.score - a.score);
            
            // Проверяем, входит ли счет в топ-10
            if (scores.length < this.maxEntries || score > scores[scores.length - 1].score) {
                await this.saveScore(score);
                
                // Удаляем лишние записи если больше 10
                if (scores.length >= this.maxEntries) {
                    await this.trimLeaderboard();
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Ошибка при сохранении счета:', error);
            return false;
        }
    }

    // Сохраняем счет в Firebase
    async saveScore(score) {
        const entry = {
            name: this.playerName,
            score: score,
            date: firebase.database.ServerValue.TIMESTAMP,
            deviceId: this.getDeviceId()
        };
        
        await database.ref('leaderboard').push(entry);
    }

    // Удаляем лишние записи (оставляем только топ-10)
    async trimLeaderboard() {
        try {
            const leaderboardRef = database.ref('leaderboard');
            const snapshot = await leaderboardRef.once('value');
            const data = snapshot.val();
            
            if (!data) return;
            
            const entries = Object.entries(data);
            entries.sort((a, b) => b[1].score - a[1].score);
            
            // Оставляем только первые maxEntries записей
            const topEntries = entries.slice(0, this.maxEntries);
            
            // Очищаем и сохраняем заново
            await leaderboardRef.set({});
            
            for (const [key, value] of topEntries) {
                await database.ref(`leaderboard/${key}`).set(value);
            }
        } catch (error) {
            console.error('Ошибка при очистке таблицы лидеров:', error);
        }
    }

    // Получаем таблицу лидеров
    async getLeaderboard() {
        try {
            const leaderboardRef = database.ref('leaderboard');
            const snapshot = await leaderboardRef.once('value');
            const data = snapshot.val();
            
            if (!data) return [];
            
            const entries = Object.values(data);
            entries.sort((a, b) => b.score - a.score);
            
            return entries.slice(0, this.maxEntries);
        } catch (error) {
            console.error('Ошибка при получении таблицы лидеров:', error);
            return [];
        }
    }

    // Генерируем ID устройства для предотвращения спама
    getDeviceId() {
        let deviceId = localStorage.getItem('collapseDeviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('collapseDeviceId', deviceId);
        }
        return deviceId;
    }

    // Отображаем таблицу лидеров
    async displayLeaderboard() {
        const entries = await this.getLeaderboard();
        const listElement = document.getElementById('leaderboard-list');
        
        if (!listElement) return;
        
        if (entries.length === 0) {
            listElement.innerHTML = '<p style="text-align: center;">Таблица лидеров пуста</p>';
            return;
        }
        
        let html = '<ol class="leaderboard-list">';
        
        entries.forEach((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString('ru-RU');
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            html += `
                <li class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
                    <span class="leaderboard-rank">${medal}</span>
                    <span class="leaderboard-name">${this.escapeHtml(entry.name)}</span>
                    <span class="leaderboard-score">${entry.score}</span>
                    <span class="leaderboard-date">${date}</span>
                </li>
            `;
        });
        
        html += '</ol>';
        listElement.innerHTML = html;
    }

    // Экранирование HTML для безопасности
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация таблицы лидеров
window.leaderboard = new Leaderboard();

// Функции для показа/скрытия таблицы лидеров
function showLeaderboard() {
    document.getElementById('leaderboard-popup').style.display = 'block';
    leaderboard.displayLeaderboard();
}

function hideLeaderboard() {
    document.getElementById('leaderboard-popup').style.display = 'none';
}

// Модифицируем функцию showGameOver для проверки счета
async function showGameOver(score) {
    // Показываем окошко с результатом
    document.getElementById('gameover-popup').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    
    // Проверяем и сохраняем счет в таблице лидеров
    const isHighScore = await leaderboard.checkAndSubmitScore(score);
    
    if (isHighScore) {
        // Показываем сообщение о новом рекорде
        setTimeout(() => {
            alert('🎉 Новый рекорд! Вы попали в таблицу лидеров!');
        }, 500);
    }
}

// Обработчик для кнопки таблицы лидеров
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardBtn = document.getElementById('leaderboard-button');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', showLeaderboard);
    }
});

// Функция для поделиться результатом
function shareScore() {
    const score = document.getElementById('score').textContent;
    const shareText = `Я набрал ${score} очков в игре Коллапс! Сможешь побить мой рекорд?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Коллапс - мой рекорд',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Копируем в буфер обмена
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Текст скопирован в буфер обмена!');
        });
    }
}

//const soundPool = Array.from({ length: 4 }, () => {
//  const audio = new Audio("sounds/click1.wav");
//  audio.preload = "auto";
//  return audio;
//});
//
//function playBreakSound() {
//  const sound = document.getElementById('break-sound');
//  if (sound) {
//    sound.currentTime = 0;
//    sound.play().catch(() => {}); // игнор ошибок
//  }
//}
//
//function vibrate() {
//  if (navigator.vibrate) {
//    navigator.vibrate(80);
//  }
//}

// Сброс затемнения кнопок и pointer-events

