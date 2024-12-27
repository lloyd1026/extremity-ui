'use client'; // 确保这是一个 Client Component

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <main>{children}</main>
    </div>
  );
};

export default ChatLayout;
