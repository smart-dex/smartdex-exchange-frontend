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

deploy:
	rsync -a /var/www/smartdex/smartdex-exchange/build  sotatek@192.168.1.206:/var/www/test