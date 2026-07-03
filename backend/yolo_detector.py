from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")

def detect_people(image_path: str):
    results = model(image_path)

    people = 0

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls == 0:
                people += 1

    return people
