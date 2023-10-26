# Use a Node 17 base image
FROM node:17-alpine as builder
# Copy webapp files
COPY /webapp /webapp
# Set the working directory to /app inside the container
WORKDIR /webapp
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
RUN npm run build

# start by pulling the python image
FROM python:latest
# copy the requirements file into the image
COPY requirements.txt .
# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt
# copy every content from the local file to the image
COPY . .
# copy build file from builder image to the current image
COPY --from=builder /webapp/build /webapp/build

EXPOSE 8080

# make sure all messages always reach console
ENV PYTHONUNBUFFERED=1

# run server
CMD ["gunicorn"  , "-b", "0.0.0.0:8080", "app:app"]
