interface AuthViewProps {
  showSignup: boolean;
  setShowSignup: (val: boolean) => void;
  setIsLoggedIn: (val: boolean) => void;
}

interface KanbanBoardProps {
  setIsLoggedIn: (val: boolean) => void;
}

interface MessageProp {
  message?: string;
}
