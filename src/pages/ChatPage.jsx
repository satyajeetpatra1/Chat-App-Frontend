import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { logout } = useAuthStore();

  return (
    <div className="relative">
      ChatPage
      <br />
      <button onClick={logout} className="cursor-pointer z-50">Logout</button>
    </div>
  );
}

export default ChatPage;
