import {useLocation} from 'react-router-dom';

const breadcrumbNameMap = {
    '/more/FAQ': '常见问题解答',
    '/more/release-notes': '版本更新记录',
    // ... 其他路径映射
};

const useBreadcrumbItems = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    // 从第二个路径段开始生成面包屑项
     // 过滤掉 null 值
    return pathSnippets.map((_, index) => {
        if (index === 0) return null; // 跳过 '/more'

        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const title = breadcrumbNameMap[url] || url;

        return {
            title: title,
            // href: url,
        };
    }).filter(item => item !== null);
};


export default useBreadcrumbItems;
