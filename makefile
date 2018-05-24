VERSION := $(shell cat VERSION)

build:
	docker build -t southclaws/pawndex-frontend:$(VERSION) \
		--build-arg app_env=production \
		.

push:
	docker push southclaws/pawndex-frontend:$(VERSION) 

run:
	-docker kill pawndex-frontend
	-docker rm pawndex-frontend
	docker run \
		--name pawndex-frontend \
		-p 3000:3000 \
		-d \
		southclaws/pawndex-frontend:$(VERSION)
