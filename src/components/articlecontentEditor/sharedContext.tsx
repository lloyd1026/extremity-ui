import React, { createContext, useContext, useState } from 'react';

// 创建 Context
const SharedStateContext = createContext<boolean>(false);
const SharedStateUpdateContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => {});
// 自定义 Hook，方便使用 Context
export function useSharedState() {
  return useContext(SharedStateContext);
}

export function useUpdateSharedState() {
  return useContext(SharedStateUpdateContext);
}

// 提供 Context 的 Provider 组件
export function SharedStateProvider({ children }) {
  const [sharedState, setSharedState] = useState(false);

  return (
    <SharedStateContext.Provider value={sharedState}>
      <SharedStateUpdateContext.Provider value={setSharedState}>
        {children}
      </SharedStateUpdateContext.Provider>
    </SharedStateContext.Provider>
  );
}