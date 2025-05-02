FROM node:lts-buster

# Install required packages
RUN apt-get update && \
    apt-get install -y ffmpeg webp git && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Clone as root and then fix permissions
RUN git clone https://github.com/pagal78/SHABAN-AI.git /home/node/SHABAN-AI && \
    chown -R node:node /home/node/SHABAN-AI

# Switch to node user
USER node
WORKDIR /home/node/SHABAN-AI

# Install dependencies
RUN yarn install --network-concurrency 1

# Expose port and set environment
EXPOSE 7860
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]