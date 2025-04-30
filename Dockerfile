# Gunakan Node.js versi 22.12 sebagai base image
FROM node:22.12

# Set working directory di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi (port 3089)
EXPOSE 3090

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]