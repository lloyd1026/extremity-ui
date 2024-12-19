// tsx = TypeScript + JSX（JavaScript + HTML）
// export default标识一个模块的默认导入，其他文件可以使用import来引用
export default function HelloLayout({
    children,
}: {
    children:React.ReactNode; // TypeScript的类型注解
}) {
    return (
        // React的内联样式style实现的 外层{}是JSX语法(JSX中使用JavaScript表达式，要写在{}中) 内层{}是JavaScript对象
        <div style={{fontFamily: 'Arial, sans-serif', textAlign:'center' }}>
            <header style={{padding: '20px', backgroundColor: '#f4f4f4'}}>
                <h1>Welcome to Hello Page</h1>
            </header>

            <main style={{ minHeight: '300px', padding: '20px' }}>
                {children}  {/* 渲染页面内容 (HelloPage 组件) */}
            </main>

            <footer style={{ padding: '10px', backgroundColor: '#f4f4f4' }}>
                <p>&copy; 2024 My Website</p>
            </footer>
        </div>
    );
}