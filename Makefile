install-deps:
	./deploy-tools install-deps

build-app:
	./deploy-tools build-app
.PHONY: build-app

deploy-build:
	./deploy-tools deploy
.PHONY: deploy-build
