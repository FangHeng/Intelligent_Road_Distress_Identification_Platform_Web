import os
import json

import torch
from PIL import Image
from torchvision import transforms
import matplotlib.pyplot as plt

from .swin import swin_large_patch4_window7_224_in22k as create_model


def predict_swin(folder_path=None ,json_path='class_indices.json',model_weight_path='E:\code\weights\PDC\PDC_swinL_224_in22k_86.3.pth'):
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

    img_size = 224
    data_transform = transforms.Compose(
        [transforms.Resize(int(img_size * 1.14)),
         transforms.CenterCrop(img_size),
         transforms.ToTensor(),
         transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])


    # read class_indict
    json_path = json_path
    assert os.path.exists(json_path), "file: '{}' dose not exist.".format(json_path)

    with open(json_path, "r") as f:
        class_indict = json.load(f)

    # create model
    model = create_model(num_classes=8).to(device)
    # load model weights
    model_weight_path = model_weight_path
    model.load_state_dict(torch.load(model_weight_path, map_location=device))
    model.eval()


    # predict class
    results = {}
    for img_name in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_name)
        if not img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        img = Image.open(img_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        img = data_transform(img)
        img = torch.unsqueeze(img, dim=0)

        with torch.no_grad():
            output = torch.squeeze(model(img.to(device))).cpu()
            predict = torch.softmax(output, dim=0)
            predict_cla = torch.argmax(predict).numpy()

        results[img_name] = {
            'class': class_indict[str(predict_cla)],
            'probability': predict[predict_cla].item()
        }

    return results

if __name__ == '__main__':
    result = predict_swin(folder_path='F:\\data\\CQU-BPDD\\val\\transverse_crack')
    print(result)