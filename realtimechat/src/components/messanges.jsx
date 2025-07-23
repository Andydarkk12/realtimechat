import { messagnesData } from "./messangesData";
import { MessangesDisplay } from "./messangesDisplay"; // Импорт компонента

export const Messanges = ({ choosedChat, messanges }) => {
  if (!choosedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Выберите чат, чтобы начать общение
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Шапка */}
      <header className="flex items-center gap-4 p-4 border-b border-gray-200 shadow-sm">
        <img
          src={choosedChat.img}
          alt={choosedChat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h1 className="text-xl font-semibold">{choosedChat.name}</h1>
      </header>

      {/* Блок сообщений */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messanges.map((msg) => (
          <MessangesDisplay key={msg.id} messange={msg} />
        ))}
      </div>

      {/* Блок отправки сообщения */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Введите сообщение..." />
        <button className="bg-fuchsia-500 text-white px-4 py-2 rounded">Отправить</button>
      </div>
    </div>
  );
};