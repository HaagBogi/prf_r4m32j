FROM mongo

EXPOSE 27017

# BUILD: sudo docker build -t r4m32j_mongo_image .
# RUN: sudo docker run -p 5000:27017 -it --name r4m32j_mongo_container -d r4m32j_mongo_image