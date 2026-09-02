# kivu-web-app

Application code for the **AWS ECS Fargate Blue/Green Lab** (owner: Claude Ishimwe).
A minimal full-stack app: a React (Vite) frontend served by an Express server, packaged
as a single container. The page displays the owner name and the lab name.

Infrastructure lives in the companion repo **kivu-web-infra**.

## Layout

```
client/   React + Vite frontend (built to static assets)
server/   Express server: serves the build and exposes GET /health
deploy/   appspec.yaml + taskdef.json for CodeDeploy blue/green
Dockerfile              multi-stage build (React -> Node runtime, non-root, port 3000)
.github/workflows/build-and-push.yml   OIDC build + push + deploy-bundle upload
```

## Local development

```bash
# frontend with hot reload
cd client && npm install && npm run dev

# or run the production shape locally
cd client && npm install && npm run build
cd ../server && npm install
cp -r ../client/dist ./public
npm start          # http://localhost:3000  (and /health)
```

## Container

```bash
docker build -t kivu-web:local .
docker run -p 3000:3000 kivu-web:local
```

The server listens on `3000`; the ALB target group health check hits `/health`.

## Required GitHub Actions repository Variables

Set these under **Settings -> Secrets and variables -> Actions -> Variables**
(plain Variables, not Secrets, since auth is OIDC). Values come from the infra
stack outputs.

| Variable | Example | Source |
|----------|---------|--------|
| `AWS_REGION` | `eu-north-1` | fixed |
| `AWS_ACCOUNT_ID` | `123456789012` | your account |
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/kivu-web-prod-github-oidc-role` | infra output `GitHubPushRoleArn` |
| `ECR_REPOSITORY` | `kivu-web-prod` | infra `NamePrefix` |
| `ARTIFACTS_BUCKET` | `kivu-web-prod-artifacts-123456789012` | infra output `ArtifactsBucketName` |

No AWS access keys are stored anywhere.

## CI/CD flow

1. Push to `main` (or run the workflow manually) triggers `build-and-push`.
2. The job authenticates to AWS with **OIDC**, builds the image, and tags it with
   both the commit SHA and `latest`.
3. It renders the deploy bundle (`appspec.yaml` + `taskdef.json`, with account ID
   and region substituted) and uploads `config-source.zip` to
   `s3://<ARTIFACTS_BUCKET>/config/` **before** pushing the image.
4. It pushes the image to ECR. The `:latest` push raises an EventBridge event that
   starts CodePipeline, which runs the CodeDeploy blue/green deployment.

## Image tagging strategy

Every build pushes two tags: the immutable **commit SHA** (traceability, easy
rollback to a known build) and the mutable **`latest`** (the deploy trigger the
pipeline and ECS reference). The ECR repo is configured `MUTABLE` so `latest`
can move.

## First deploy note

The ECS service pulls `:latest`, so this workflow must run once to seed the image
**before** the ECS stack is created. See the bring-up runbook in the
kivu-web-infra README.
