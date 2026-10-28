# Text Toolkit

**Автор:** Соболева Василиса Сергеевна, группа М3114  
**Лабораторная работа №3. Создание плагина**

## Описание

**Text Toolkit** — расширение для Visual Studio Code с небольшим набором инструментов для работы с текстом: подсчёт статистики документа, счётчик слов в строке состояния, преобразование регистра идентификаторов и вставка текущей даты.

Расширение написано на TypeScript с использованием VS Code Extension API и собирается с помощью esbuild.

## Возможности

| Команда (Ctrl+Shift+P) | Что делает |
|---|---|
| `Text Toolkit: Show Statistics` | Показывает уведомление с числом строк, слов и символов в активном файле |
| `Text Toolkit: To snake_case` | Преобразует выделенный текст в `snake_case` (`HelloWorldText` → `hello_world_text`) |
| `Text Toolkit: To camelCase` | Преобразует выделенный текст в `camelCase` (`hello_world_text` → `helloWorldText`) |
| `Text Toolkit: Insert Current Date` | Вставляет текущую дату в позицию курсора (формат `дд.мм.гггг`) |

Дополнительно: в правой части строки состояния отображается счётчик слов («Слов: N») для активного файла. Он обновляется при каждом изменении текста и при переключении между файлами.

Команды преобразования работают с несколькими выделениями одновременно.

## Установка и запуск (режим разработки)

Требуется Node.js 18.19 или новее и VS Code.

```bash
git clone https://github.com/hwonisv/text-toolkit.git
cd text-toolkit
npm install
npm run compile
code --extensionDevelopmentPath="$PWD"
```

В открывшемся окне `[Extension Development Host]` создайте файл (Ctrl+N), введите текст — в строке состояния появится счётчик слов. Команды вызываются через палитру команд (Ctrl+Shift+P) по префиксу `Text Toolkit`.

Также проект можно открыть в VS Code и запустить отладку через пункт `Run Extension` (F5).

## Упаковка в .vsix

```bash
npm install -g @vscode/vsce
vsce package
```

Полученный файл `.vsix` устанавливается через панель Extensions → «…» → Install from VSIX.

## Структура проекта

- `package.json` — манифест расширения (команды, событие активации, точка входа);
- `src/extension.ts` — исходный код: функции `activate()` и `deactivate()`, обработчики команд;
- `esbuild.js` — сценарий сборки в `dist/extension.js`.