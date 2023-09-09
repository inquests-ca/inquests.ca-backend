FROM public.ecr.aws/lambda/nodejs:14

# Install dependencies.
# Note this step installs SQLite binaries and cannot be performed as part of a multi-stage build.
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Build from TypeScript source.
COPY src src
COPY tsconfig.json .
RUN npm run build

# Copy build artifacts to image.
COPY node_modules/ ${LAMBDA_TASK_ROOT}/node_modules
COPY dist/ ${LAMBDA_TASK_ROOT}/dist
COPY inquestsca.sqlite3 ${LAMBDA_TASK_ROOT}/inquestsca.sqlite3
COPY ormconfig.js ${LAMBDA_TASK_ROOT}/ormconfig.js

ENV DATABASE_FILE "inquestsca.sqlite3"

CMD [ "dist/index.handler" ]
