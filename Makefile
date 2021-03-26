ifndef u
u:=sotatek
endif

ifndef env
env:=dev
endif

OS:=$(shell uname)

build-image:
	docker build -t pancake-swap-interface .
	docker tag pancake-swap-interface registry-server:5000/pancake-swap-interface:latest
	docker push registry-server:5000/pancake-swap-interface:latest

build-staging:
	npm run build:staging
	
build-development:
	npm run build:development

build-production:
	sudo npm install env-cmd --save 
	npm run build:production

deploy-development:
	make build-development
	rsync -a build  sotatek@192.168.1.206:/var/www/test/smartdex-exchange