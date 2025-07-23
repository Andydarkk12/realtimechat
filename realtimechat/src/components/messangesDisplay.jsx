export const MessangesDisplay = ({ messange }) => {
  return (
    <div className="p-2 bg-gray-100 rounded shadow-sm">
      <div className="text-sm text-gray-600">{messange.user_id}</div>
      <div className="text-base">{messange.content}</div>
    </div>
  );
};