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
	make build-image