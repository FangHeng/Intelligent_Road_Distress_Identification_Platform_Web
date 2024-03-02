// TaskStatisticCard.js: 任务统计卡片，展示任务总数，正在进行中的任务数，已完成的任务数。
import { StatisticCard } from '@ant-design/pro-components';
import taskStore from "../../store/TaskStore";
import {observer} from "mobx-react-lite";
const { Divider } = StatisticCard;

const TaskStatisticCard = observer(() => {
    const tasks = taskStore.tasks;
    return (
        <StatisticCard.Group>
            <StatisticCard
                statistic={{
                    title: '全部',
                    tip: '已创建的维修任务',
                    value: tasks.length,
                }}
            />
            <Divider />
            <StatisticCard
                statistic={{
                    title: '正在进行中',
                    value: tasks.filter((task) => task.status === 'processing').length,
                    status: 'processing',
                }}
            />
            <StatisticCard
                statistic={{
                    title: '已完成',
                    value: tasks.filter((task) => task.status === 'closed').length,
                    status: 'success',
                }}
            />
        </StatisticCard.Group>
    );
});

export default TaskStatisticCard;