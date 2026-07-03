from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")

def analyze_frame(frame):
    results = model(frame)

    people = 0

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls == 0:  # persona
                people += 1

    return people
