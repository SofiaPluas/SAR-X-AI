
from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")

def analyze_frame(frame):
    results = model(frame)

    people = 0
    for r in results:
        for box in r.boxes:
            if int(box.cls[0]) == 0:
                people += 1

    return people
