// TaskStatisticCard.js: 任务统计卡片，展示任务总数，正在进行中的任务数，已完成的任务数。
import { StatisticCard } from '@ant-design/pro-components';
import taskStore from "../../store/TaskStore";
import {observer} from "mobx-react-lite";
import RcResizeObserver from "rc-resize-observer";
import {useState} from "react";
import { ReactComponent as ProgressingIcon } from '../../assets/icons/progressing.svg';
import { ReactComponent as AllTasksIcon } from '../../assets/icons/allTasks.svg';
import { ReactComponent as FinishedIcon } from '../../assets/icons/finished.svg';
const { Divider } = StatisticCard;
const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
};

const TaskStatisticCard = observer(() => {
    const tasks = taskStore.tasks;
    const [responsive, setResponsive] = useState(false);

    return (
        // <StatisticCard.Group>
        //     <StatisticCard
        //         statistic={{
        //             title: '全部',
        //             tip: '已创建的维修任务',
        //             value: tasks.length,
        //         }}
        //     />
        //     <Divider />
        //     <StatisticCard
        //         statistic={{
        //             title: '正在进行中',
        //             value: tasks.filter((task) => task.status === 'processing').length,
        //             status: 'processing',
        //         }}
        //     />
        //     <StatisticCard
        //         statistic={{
        //             title: '已完成',
        //             value: tasks.filter((task) => task.status === 'closed').length,
        //             status: 'success',
        //         }}
        //     />
        // </StatisticCard.Group>
            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 596);
                }}
            >
                <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
                    <StatisticCard
                        statistic={{
                            title: '全部',
                            tip: '已创建的维修任务',
                            value: tasks.length,
                            icon: <AllTasksIcon />,
                        }}
                    />
                    <Divider />
                    <StatisticCard
                        statistic={{
                            title: '正在进行中',
                            value: tasks.filter((task) => task.status === 'processing').length,
                            // status: 'processing',
                            icon: <ProgressingIcon />,
                        }}
                    />
                    <StatisticCard
                        statistic={{
                            title: '已完成',
                            value: tasks.filter((task) => task.status === 'closed').length,
                            // status: 'success',
                            icon: <FinishedIcon />,
                        }}
                    />
                </StatisticCard.Group>
            </RcResizeObserver>
    );

});

export default TaskStatisticCard;