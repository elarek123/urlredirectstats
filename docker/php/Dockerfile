FROM node:latest AS node-binaries
FROM php:8.3-fpm
COPY --from=node-binaries /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node-binaries /usr/local/bin/node /usr/local/bin/node
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm
RUN mkdir -p /tmp
RUN cd /tmp \
    && curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

RUN apt-get update && apt-get install -y aspell aspell-en  \
    && docker-php-ext-install pdo_mysql mysqli

RUN pecl install -o -f redis && rm -rf /tmp/pear && docker-php-ext-enable redis

RUN apt-get install -y libpng-dev zlib1g-dev libwebp-dev libjpeg-dev libfreetype6-dev libicu-dev

RUN docker-php-ext-configure gd --with-jpeg --with-freetype --with-webp && docker-php-ext-install gd
RUN docker-php-ext-configure intl && docker-php-ext-install intl
RUN docker-php-ext-install exif

RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql
RUN apt-get -y install --fix-missing \
    apt-utils \
    build-essential \
    git \
    curl \
    libcurl4 \
    libcurl4-openssl-dev \
    zlib1g-dev \
    libzip-dev \
    zip \
    libbz2-dev \
    locales \
    libmcrypt-dev \
    libicu-dev \
    libonig-dev \
    libsodium-dev

RUN docker-php-ext-install sodium zip sockets
RUN docker-php-ext-configure pcntl --enable-pcntl &&docker-php-ext-install pcntl

# RUN docker-php-ext-install \
#     exif \
#     pcntl \
#     bcmath \
#     ctype \
#     curl \
#     iconv \
#     xml \
#     soap \
#     pcntl \
#     mbstring \
#     tokenizer \
#     bz2 \
#     zip \
#     intl
CMD ["php-fpm"]
