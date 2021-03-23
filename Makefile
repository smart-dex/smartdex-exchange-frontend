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

deploy-staging:
	sudo npm install env-cmd --save 
	npm run build:staging
	
deploy-development:
	sudo npm install env-cmd --save 
	npm run build:development

deploy-production:
	sudo npm install env-cmd --save 
	npm run build:production

deploy:
	npm run build
	rsync -a build  sotatek@192.168.1.206:/var/www/test/smartdex-exchange