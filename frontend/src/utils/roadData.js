const rawData = require('../assets/json/county.json');

// 创建一个映射来存储转换后的数据
const dataMap = {};

// 遍历原始数据
rawData.forEach(item => {
    // 检查省份是否已经在映射中
    if (!dataMap[item.province]) {
        dataMap[item.province] = { value: item.province_adcode, label: item.province, children: {} };
    }

    // 检查城市是否已经在省份的映射中
    if (!dataMap[item.province].children[item.city]) {
        dataMap[item.province].children[item.city] = { value: item.city_adcode, label: item.city, children: [] };
    }

    // 添加区信息到城市的映射中
    dataMap[item.province].children[item.city].children.push({ value: item.county_adcode, label: item.county });
});

// 将映射转换为数组格式
const provinceOptions = Object.values(dataMap).map(province => ({
    ...province,
    children: Object.values(province.children)
}));

export default provinceOptions;