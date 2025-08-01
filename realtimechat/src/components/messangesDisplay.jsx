export const MessangesDisplay = ({ chatMembers, messange }) => {
  const getObjectOfUser = (id, array) => {
    return array.find(user => user.user_id === id);
  };
  const username = getObjectOfUser(messange.user_id,chatMembers)
  return (
    <div className="p-2 bg-gray-100 rounded shadow-sm">
      <div className="text-sm text-gray-600">{username ? username.username:''}</div>
      <div className="text-base">{messange.content}</div>
    </div>
  );
};