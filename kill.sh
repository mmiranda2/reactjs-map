#!/bin/bash

a=$(lsof -i :3000 | grep "chrome")
if [[ $a ]]; then
	pida=$(lsof -ti :3000)
	kill -9 $pida
fi

b=$(lsof -i :3000 | grep "node")
if [[ $b ]]; then
	pidb=$(lsof -ti :3000)
	kill -9 $pidb
fi

c=$(lsof -i :8080 | grep "node")
if [[ $c ]]; then
	pidc=$(lsof -ti :8080)
	kill -9 $pidc
fi

d=$(lsof -i :5000 | grep "python")
if [[ $d ]]; then
	pidd=$(lsof -ti :5000)
	kill -9 $pidd
fi
