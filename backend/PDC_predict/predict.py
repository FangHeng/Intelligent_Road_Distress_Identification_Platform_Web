"""
整合各个模块实现的预测函数
指定对应模型进行预测
"""

import os
from swin.swin_predict import predict_swin
from pprint import pprint


def predict(user=None, time=None, model=None, model_weight_path=None, json_path='class_indices.json'):
    """选择需要使用的模型进行预测
    :param user: 用户名
    :param time: 时间戳
    :param model: 需要使用的模型
    :param model_weight_path:预训练权重路径
    :param json_path:分类标签
    
    在后端存储地址中user+time为文件夹名，文件夹中存放着需要预测的图片
    """
    folder_path = os.path.join(user, time)
    if model == 'swin':
        if model_weight_path is None:
            model_weight_path = 'E:\code\weights\PDC\PDC_swinL_224_in22k_86.3.pth'
        result = predict_swin(folder_path=folder_path,json_path=json_path,model_weight_path=model_weight_path)
        return result
    else:
        print("unsupported model")



if __name__ == '__main__':

    result = predict(user='F:\\data\\CQU-BPDD\\val', time='normal', model='swin')
    pprint(result)