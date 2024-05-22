
import {action, computed, makeAutoObservable, observable, runInAction} from 'mobx';

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
            progress: 100,
            status: "processing",
            createdAt: "2024-02-10",
            estimatedEndDate: "2024-03-10",
            remarks: "这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务这是一个关于路面检测的任务",
        },
         {
             taskId: 2,
             taskName: "111",
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
     // filteredTasks = [];
     currentTask = null;
     taskData = {};   // 单个任务的数据


    constructor() {
        makeAutoObservable(this, {
            tasks: observable,
            currentTask: observable,
            taskData: observable,
            setTasks: action,
            updateTask: action,
            updateTaskProgress: action,
        });
    }

    setTasks(newTasks) {
        this.tasks = newTasks;
    }

    setCurrentTask(taskId) {
        this.currentTask = this.getTaskById(taskId);
    }

    setTaskData(taskId) {
        this.taskData = this.getTaskById(taskId);
    }


    getTaskById(taskId) {
        return this.tasks.find((task) => task.taskId === taskId);
    }

    // update taskData
    updateTask(taskId, newInfo) {
        console.log(newInfo)
        const taskIndex = this.tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex !== -1) {
            // 更新tasks中对应的任务
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...newInfo };
            console.log(JSON.parse(JSON.stringify(this.tasks)))
            this.setTaskData(taskId);
        } else {
            console.error("Task not found:", taskId);
        }
    }

    resetTask() {
        this.taskData = {};
        this.currentTask = null;
    }

    addTask(newTask) {
        this.tasks.push(newTask);
    }

}

const taskStore = new TaskStore();
export default taskStore;