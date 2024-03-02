
import {action, makeAutoObservable, observable, runInAction} from 'mobx';

class TaskStore {
     tasks = [
        {
            taskId: 1,
            taskName: "路面检测任务",
            uploadId: "UPL123456",
            creatorId: "CRE123456",
            creatorName: "张三",
            responsibleId: "RES123456",
            responsibleName: ["李四", "王五", '赵六', "王小二"],
            roadId: "RD123456",
            roadName: "大学城东路",
            analysisReport: "报告链接",
            progress: 75,
            status: "processing",
            createdAt: "2024-02-10",
            estimatedEndDate: "2024-03-10",
            remarks: "这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务",
        },
         {
             taskId: 2,
             taskName: "路面检测任务",
             uploadId: "UPL123456",
             creatorId: "CRE123456",
             creatorName: "王小二",
             responsibleId: "RES123456",
             responsibleName: ["王小二"],
             roadId: "RD123456",
             roadName: "大学城南路",
             analysisReport: "报告链接",
             progress: 100,
             status: "closed",
             createdAt: "2024-02-10",
             estimatedEndDate: "2024-03-10",
             remarks: "这是一个关于路面检测的任务",
         },
    ];

    constructor() {
        makeAutoObservable(this, {
            tasks: observable,
            setTasks: action,
            updateTask: action,
            updateTaskProgress: action,
        });
    }

    setTasks(newTasks) {
        this.tasks = newTasks;
    }

    updateTask(taskId, newTask) {
        const index = this.tasks.findIndex((task) => task.taskId === taskId);
        this.tasks[index] = newTask;
    }

    updateTaskProgress(taskId, updatedProgress) {
        const index = this.tasks.findIndex((task) => task.taskId === taskId);
        if (index !== -1) {
            // 使用runInAction来确保操作是作为一个事务执行的
            runInAction(() => {
                // 为了确保响应性，可以使用splice代替直接赋值
                const updatedTask = {
                    ...this.tasks[index],
                    progress: updatedProgress,
                };
                this.tasks.splice(index, 1, updatedTask);
            });
        }
    }
}

const taskStore = new TaskStore();
export default taskStore;